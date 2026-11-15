# Análise de riscos e resiliência

## Requisitos não funcionais

Os requisitos funcionais (Capítulo 8) dizem o que o sistema faz; os não
funcionais dizem com que qualidade ele faz: quão seguro, confiável e tolerante
a falhas precisa ser. Na formulação da apostila, a pergunta não é "o dado
chega?", mas "o dado chega do jeito certo, no tempo certo e com a confiança
necessária?" [@ufjf2026cap5, p. 14–15]. Num sistema IoT, a resposta não é
garantida: a comunicação sofre interrupções e os dados chegam atrasados,
duplicados ou fora de ordem [@ufjf2026cap5, p. 4; @ufjf2026cap2, p. 22–23]. A
Tabela 13 fixa as metas.

: Requisitos não funcionais.

| ID | Requisito | Meta | Como verificar |
|------|--------------------------------------------|-------------------------------------|----------------------------------|
| RNF1 | Funcionar sem internet | medição, gravação, regras e painel local continuam | desligar o roteador da internet e observar o painel |
| RNF2 | Avisar rápido | alerta crítico no painel em até 5 s; push em até 30 s com internet | medir o tempo entre o evento e o alerta |
| RNF3 | Não perder dados em quedas curtas | queda de até 1 h sem perda (memória dos dispositivos) | derrubar o broker por 10 min e contar as leituras |
| RNF4 | Não duplicar nem agir com dado ruim | nenhuma linha duplicada; nenhuma ação a partir de dado inválido, atrasado ou reenviado | testes do middleware |
| RNF5 | Segurança | TLS, um usuário por dispositivo, ACL, nenhuma porta aberta para a internet, acesso remoto só por VPN | revisão da configuração do broker e do roteador |
| RNF6 | Privacidade | dados só no *hub*; retenção definida (Tabela 10) [@brasil2018lgpd] | inspeção do tráfego de saída |
| RNF7 | Recuperação automática | serviços religam sozinhos depois de falha ou falta de energia; cópia diária do banco | reiniciar o *hub* e cada contêiner |

Fonte: Elaborado pelo autor (2026).

## Estado de cada dispositivo

O middleware acompanha cada dispositivo pela máquina de estados da Figura 9. O
intervalo é o de publicação do dispositivo (Capítulo 3); para os dispositivos
por evento, vale o intervalo do *heartbeat*. O estado "atrasado" existe para
não gerar alerta por uma única mensagem perdida.

![Estados de um dispositivo acompanhados pelo middleware.](fig09-estados-dispositivo.png){width=75%}

Fonte: Elaborado pelo autor (2026).

## Falhas e tratamento

A Tabela 14 reúne as falhas previstas: as quatro citadas no enunciado
(sensor offline, perda de conexão com a internet, retransmissão e dados nulos
ou corrompidos) e outras que o software também precisa tratar.

: Falhas previstas e tratamento.

| Falha | Como é detectada | Tratamento |
|------------------------------|------------------------------------|------------------------------------------------------------|
| Sensor offline | LWT do broker ou silêncio maior que 3 × o intervalo (Figura 9) | Alerta R10. As regras que dependem do sensor param de agir: dado desconhecido nunca é tratado como "normal". |
| Perda de conexão com a internet | Falha ao enviar push | Nada muda dentro de casa (Seção 4.7). As notificações ficam na fila e saem quando a conexão volta; o painel mostra "sem internet". |
| Perda do Wi-Fi ou broker fora do ar | O dispositivo não consegue publicar | O dispositivo guarda as leituras (pelo menos 1 h) e as reenvia com `buffered` = verdadeiro; o middleware reconecta sozinho. |
| Retransmissão e duplicatas | Mesmo `(device, ts)` já recebido | A chave única do banco descarta a cópia; a duplicata só é contada. |
| Dados atrasados ou reenviados | `buffered` = verdadeiro ou atraso maior que 30 s | Vão para o histórico, mas não disparam regras: a situação que descrevem pode já ter mudado. |
| Dados nulos | Campo ausente ou `null` | O campo fica nulo e a leitura recebe a marca `parcial`; uma regra com variável nula não muda de estado. |
| Dados corrompidos | JSON inválido, esquema errado, valor fora da faixa (Tabelas 4 a 6), NaN, instante no futuro | Mensagem inválida é rejeitada e guardada com o motivo; campo fora da faixa vira nulo; instante no futuro é trocado pelo de chegada (Figura 10). |
| Dados incoerentes | P muito diferente de V·I·FP; contador de energia que regride | Gravados com a marca `inconsistente`; o custo do dia não usa o trecho marcado. |
| Atuador não responde | Sem confirmação do `cmd_id` em 10 s | Até 3 tentativas; depois, alerta R11. |
| *Hub* desligado com carga ligada | O relé deixa de receber a renovação do comando | Comandos automáticos duram no máximo 15 min: sem renovação, o relé desliga sozinho. A lavadora termina o ciclo em andamento. |
| Falta de energia na casa | Tensão das fases cai a zero | O *hub* fica no nobreak e registra a falta (R12); a geração zero não abre alerta de falha solar (R5). |

Fonte: Elaborado pelo autor (2026).

Mesmo na pior falha, com o *hub* desligado, o sensor de gás continua
apitando pelo próprio alarme local (Seção 2.6); o que se perde é o alarme da
casa e o aviso remoto.

### Armazenar e encaminhar

O tratamento da queda de conexão é o *store-and-forward*: o dispositivo
guarda as leituras e as reenvia quando a conexão volta
[@ufjf2026cap5, p. 17]. A apostila aponta três armadilhas dessa estratégia
[@ufjf2026cap5, p. 18], e cada uma tem resposta no projeto:

- **Memória finita:** a fila do dispositivo comporta pelo menos 1 h de
  leituras; se encher, descarta as mais antigas (FIFO), e as mudanças de
  estado têm prioridade sobre as leituras periódicas.
- **Relógio errado:** um instante errado corrompe a série temporal. Os
  dispositivos acertam o relógio por NTP, e uma leitura com instante no futuro
  recebe a marca `relogio` (Seção 7.4).
- **Avalanche no retorno:** depois de uma queda longa, tudo chega de uma vez.
  O reenvio é feito em ordem cronológica e com vazão limitada, e as leituras
  marcadas `buffered` só vão para o histórico, sem disparar regras.

## Validação de dados

A validação aplica, na entrada, as dimensões de qualidade de dados da
Unidade 3 [@ufjf2026cap3, p. 5]. A Tabela 15 mostra como cada uma é
verificada.

: Dimensões de qualidade dos dados e como o middleware as verifica.

| Dimensão | Pergunta | Verificação no middleware |
|----------------------|------------------------------------|----------------------------------------------------|
| Validade | O valor é possível? | Faixa válida de cada campo (Tabelas 4 a 6) |
| Unicidade | O registro é repetido? | Chave `(device, ts)`; repetição é descartada |
| Completude | O dado esperado está presente? | Campo ausente vira nulo e a leitura fica `parcial`; silêncio do dispositivo muda o seu estado (Figura 9) |
| Consistência | Os campos concordam entre si? | P ≈ V·I·FP; contadores de energia não regridem |
| Atualidade | O dado é do momento esperado? | Atraso maior que 30 s ou `buffered` não dispara regra |
| Coerência temporal | A sequência no tempo faz sentido? | Instante no futuro é marcado `relogio`; `seq` revela perdas e reinícios |

Fonte: Elaborado pelo autor (2026), com base em @ufjf2026cap3.

A chave contra duplicatas segue a recomendação da apostila: identificador do
dispositivo mais instante da medição, aplicada no momento da ingestão
[@ufjf2026cap3, p. 6–7]. A Figura 10 mostra a sequência aplicada a cada
mensagem. Ela distingue três níveis de gravidade:

1. **Mensagem rejeitada:** JSON inválido, esquema errado, dispositivo
   desconhecido ou instante antigo demais. A mensagem inteira é descartada e
   guardada com o motivo, para diagnóstico.
2. **Campo anulado:** um valor fora da faixa, NaN ou nulo vira `NULL`, e a
   leitura recebe a marca `parcial`. O resto da leitura é aproveitado: uma
   tensão corrompida não deve apagar a potência medida no mesmo instante.
3. **Leitura marcada:** a leitura é gravada, mas marcada como `inconsistente`
   ou `relogio`, para que relatórios e regras possam ignorá-la.

![Validação aplicada a cada mensagem recebida.](fig10-validacao.png){width=55%}

Fonte: Elaborado pelo autor (2026).

O middleware só anula o valor impossível; o valor possível, ainda que raro,
é mantido, porque pode ser exatamente o evento que interessa. É a regra de
ouro da Unidade 3: primeiro perguntar ao fenômeno se o valor é fisicamente
possível, depois à estatística; o *outlier* impossível vira dado faltante, e o
possível é candidato a evento [@ufjf2026cap3, p. 8]. Um pico de 46 A na
entrada não é ruído: é o que dispara a R3. Pelo mesmo motivo, uma tensão de
0 V é aceita: não é um erro do sensor, é a falta de energia, e precisa chegar
à regra R12.

O middleware também não preenche lacunas. Imputar valores (média,
interpolação, última observação) é uma técnica de análise
[@ufjf2026cap3, p. 10–16]; na entrada, um valor inventado poderia disparar uma
regra. A lacuna fica registrada como lacuna, e quem analisa o histórico decide
como tratá-la.

## Regras de resiliência

As falhas dos próprios dispositivos também são tratadas por regras no formato
SE/ENTÃO, avaliadas pelo mesmo motor do Capítulo 5.

**R10 — Dispositivo offline**

> **SE** o estado do dispositivo d passou a offline (Figura 9)\
> **ENTÃO** abrir alerta para o instalador e para o morador responsável, com
> severidade crítica se d é um `gas_sensor_*` ou um `siren_*` e de aviso nos
> demais casos\
> **E** suspender as regras que dependem de d até ele voltar.

**R11 — Atuador sem resposta**

> **SE** um comando não teve confirmação após 3 tentativas\
> **ENTÃO** abrir alerta de aviso e colocar a carga em modo manual até o
> morador verificar.

**R12 — Qualidade do fornecimento de energia**

> **SE** a tensão de uma fase está fora da faixa adequada (117 a 133 V) por ≥ 60 s\
> **ENTÃO** registrar o evento e abrir aviso; severidade crítica se a tensão
> está abaixo de 110 V ou acima de 135 V.\
> **SE** a tensão de todas as fases é 0 V\
> **ENTÃO** registrar o início da falta de energia e, quando a tensão voltar,
> notificar a duração.

As faixas da R12 são as da classificação da tensão em regime permanente da
ANEEL para a tensão nominal de 127 V [@aneel2021prodist8]. O registro dos
eventos ajuda o morador a reclamar com a distribuidora.
