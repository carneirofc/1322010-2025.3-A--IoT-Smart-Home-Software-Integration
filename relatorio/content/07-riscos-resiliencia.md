# Análise de riscos e resiliência

## Requisitos não funcionais

Os requisitos funcionais (Capítulo 8) dizem o que o sistema faz; os não
funcionais, com que qualidade. A apostila resume a questão: não basta o dado
chegar, ele precisa chegar certo, no tempo certo e com a confiança necessária
[@ufjf2026cap5, p. 14–15]. Em IoT isso não é garantido, porque a comunicação
cai e os dados chegam atrasados, duplicados ou fora de ordem
[@ufjf2026cap5, p. 4; @ufjf2026cap2, p. 22–23]. As metas, com o modo de
verificar cada uma, são:

- RNF1, funcionar sem internet: medição, gravação, regras e painel local
  seguem funcionando com o roteador desconectado.
- RNF2, avisar rápido: alerta crítico no painel em até 5 s e *push* em até
  30 s, medidos do evento ao aviso.
- RNF3, não perder dados em quedas curtas: uma queda de até 1 h não perde
  leituras, o que se testa derrubando o broker por 10 minutos e contando.
- RNF4, não duplicar nem agir com dado ruim: nenhuma linha duplicada e
  nenhuma ação a partir de dado inválido, atrasado ou reenviado, coberto
  pelos testes do middleware.
- RNF5, segurança: TLS, um usuário por dispositivo, lista de acesso, nenhuma
  porta aberta para a internet e acesso remoto só por VPN.
- RNF6, privacidade: dados só no *hub*, com retenção definida (Seção 4.5)
  [@brasil2018lgpd], conferido pelo tráfego de saída.
- RNF7, recuperação automática: os serviços voltam sozinhos depois de uma
  falha ou falta de energia, e o banco tem cópia diária.

## Estado de cada dispositivo

O middleware acompanha cada dispositivo pela máquina de estados da Figura 9.
O intervalo é o de publicação do dispositivo ou, para os que publicam por
evento, o do *heartbeat*. O estado "atrasado" existe para que uma única
mensagem perdida não vire alerta.

![Estados de um dispositivo acompanhados pelo middleware.](fig09-estados-dispositivo.png){width=75%}

Fonte: Elaborado pelo autor (2026).

## Falhas e tratamento

A Tabela 5 reúne as falhas previstas: as quatro do enunciado (sensor
offline, perda de internet, retransmissão e dados nulos ou corrompidos) e
outras que o software também precisa tratar.

: Falhas previstas e tratamento.

| Falha | Como é detectada | Tratamento |
|------------------------------|------------------------------------|------------------------------------------------------------|
| Sensor offline | *Last Will* ou silêncio maior que 3 × o intervalo | Alerta R10. As regras que dependem do sensor param: dado desconhecido nunca conta como "normal". |
| Perda de internet | Falha ao enviar *push* | Nada muda dentro de casa. As notificações esperam na fila e o painel mostra "sem internet". |
| Perda do Wi-Fi ou do broker | O dispositivo não consegue publicar | O dispositivo guarda pelo menos 1 h de leituras e as reenvia com `buffered`. |
| Retransmissão e duplicatas | Mesmo `(device, ts)` já recebido | A chave única do banco descarta a cópia, que só é contada. |
| Dados atrasados ou reenviados | `buffered` ou atraso maior que 30 s | Vão para o histórico, mas não disparam regras: a situação pode já ter mudado. |
| Dados nulos | Campo ausente ou `null` | O campo fica nulo e a leitura é marcada `parcial`; regra com variável nula não muda de estado. |
| Dados corrompidos | JSON inválido, esquema errado, valor fora da faixa, NaN, instante no futuro | A mensagem inválida é rejeitada e guardada com o motivo; o campo fora da faixa vira nulo (Figura 10). |
| Dados incoerentes | Potência longe de V·I·FP; contador que regride | Gravados com a marca `inconsistente`, fora do cálculo de custo. |
| Atuador não responde | Sem confirmação do `cmd_id` em 10 s | Até 3 tentativas; depois, alerta R11. |
| *Hub* desligado com carga ligada | O relé não recebe a renovação do comando | Comando automático vale no máximo 15 min; sem renovação, o relé desliga sozinho, exceto a lavadora no meio do ciclo. |
| Falta de energia na casa | Tensão das fases cai a zero | O *hub* segue no nobreak e registra a falta (R12); a geração zero não abre a R5. |

Fonte: Elaborado pelo autor (2026).

Na pior falha, com o *hub* desligado, o sensor de gás continua apitando
sozinho (Seção 2.6); perdem-se o alarme da casa e o aviso remoto.

A queda de conexão é tratada por armazenar e encaminhar: o dispositivo
guarda as leituras e as reenvia quando a conexão volta
[@ufjf2026cap5, p. 17]. A apostila aponta três armadilhas dessa estratégia
[@ufjf2026cap5, p. 18], e o projeto responde a cada uma. A memória é finita,
então a fila guarda pelo menos 1 h, descarta as leituras mais antigas quando
enche e dá prioridade às mudanças de estado. Um relógio errado corrompe a
série, então os dispositivos usam NTP e uma leitura com instante no futuro é
marcada `relogio`. E tudo chega de uma vez depois de uma queda longa, então
o reenvio segue a ordem cronológica, com vazão limitada, e as leituras
`buffered` não disparam regras.

## Validação de dados

A validação aplica na entrada as dimensões de qualidade da Unidade 3
[@ufjf2026cap3, p. 5]. A validade confere a faixa de cada campo (Tabela 2).
A unicidade usa a chave `(device, ts)`, aplicada na ingestão como a apostila
recomenda [@ufjf2026cap3, p. 6–7]. A completude trata o campo ausente como
nulo e o silêncio do dispositivo como mudança de estado. A consistência
compara a potência com V·I·FP e exige que os contadores não regridam. A
atualidade impede que um dado atrasado dispare regra, e a coerência temporal
marca instantes no futuro e usa `seq` para revelar perdas e reinícios.

A Figura 10 mostra a sequência aplicada a cada mensagem, com três níveis de
gravidade. Uma mensagem com JSON inválido, esquema errado, dispositivo
desconhecido ou instante antigo demais é rejeitada inteira e guardada com o
motivo. Um campo fora da faixa, NaN ou nulo vira `NULL` e a leitura é marcada
`parcial`, aproveitando o resto: uma tensão corrompida não deve apagar a
potência medida no mesmo instante. Por fim, uma leitura incoerente é gravada
com a marca `inconsistente` ou `relogio`, para que relatórios e regras possam
ignorá-la.

![Validação aplicada a cada mensagem recebida.](fig10-validacao.png){width=55%}

Fonte: Elaborado pelo autor (2026).

Só o valor impossível é anulado. O valor possível, ainda que raro, fica,
porque pode ser justamente o evento que interessa. É a regra da Unidade 3:
perguntar primeiro ao fenômeno se o valor é possível e só depois à
estatística; o *outlier* impossível vira dado faltante e o possível é
candidato a evento [@ufjf2026cap3, p. 8]. Um pico de 46 A na entrada é o que
dispara a R3, e uma tensão de 0 V é a falta de energia que a R12 precisa
ver. O middleware também não preenche lacunas: imputar valores é técnica de
análise [@ufjf2026cap3, p. 10–16], e na entrada um valor inventado poderia
disparar uma regra.

## Regras de resiliência

As falhas dos dispositivos também viram regras SE/ENTÃO, avaliadas pelo
mesmo motor do Capítulo 5.

**R10 — Dispositivo offline**

> **SE** o dispositivo d passou a offline (Figura 9)\
> **ENTÃO** avisar o instalador e o morador responsável, com severidade
> crítica se d é um `gas_sensor_*` ou `siren_*`\
> **E** suspender as regras que dependem de d até ele voltar.

**R11 — Atuador sem resposta**

> **SE** um comando ficou sem confirmação após 3 tentativas\
> **ENTÃO** abrir um aviso e pôr a carga em modo manual até o morador verificar.

**R12 — Qualidade do fornecimento de energia**

> **SE** a tensão de uma fase fica fora de 117 a 133 V por ≥ 60 s\
> **ENTÃO** registrar o evento e abrir um aviso, crítico abaixo de 110 V ou
> acima de 135 V.\
> **SE** todas as fases estão em 0 V\
> **ENTÃO** registrar o início da falta de energia e, na volta, avisar a duração.

As faixas são as da ANEEL para a tensão nominal de 127 V em regime
permanente [@aneel2021prodist8]. O histórico desses eventos ajuda o morador a
reclamar com a distribuidora.
