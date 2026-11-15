# Análise de riscos e resiliência

## Requisitos não funcionais

Os requisitos funcionais (Capítulo 8) definem o que o sistema faz; os não
funcionais definem a qualidade com que o faz. Segundo a apostila, não basta
que o dado chegue: ele deve chegar correto, no tempo adequado e com a
confiabilidade necessária [@ufjf2026cap5, p. 14–15]. Em sistemas IoT, essa
condição não é garantida, pois a comunicação está sujeita a interrupções e os
dados podem chegar atrasados, duplicados ou fora de ordem
[@ufjf2026cap5, p. 4; @ufjf2026cap2, p. 22–23]. As metas estabelecidas, com o
respectivo método de verificação, são:

- RNF1, operação sem internet: medição, armazenamento, regras e painel local
  permanecem em funcionamento com a internet desconectada.
- RNF2, tempo de aviso: alerta crítico exibido no painel em até 5 s e
  notificação *push* em até 30 s, medidos a partir do evento.
- RNF3, preservação de dados em interrupções curtas: nenhuma leitura é
  perdida em interrupções de até 1 h, o que se verifica interrompendo o
  broker por 10 minutos e contando as leituras recebidas.
- RNF4, integridade: nenhum registro duplicado e nenhuma ação baseada em dado
  inválido, atrasado ou retransmitido, o que se verifica por testes do
  middleware.
- RNF5, segurança: TLS, credencial por dispositivo, ACL, nenhuma porta
  exposta à internet e acesso remoto exclusivamente por VPN.
- RNF6, privacidade: dados mantidos apenas no *hub*, com retenção definida
  (Seção 4.5) [@brasil2018lgpd], o que se verifica pela inspeção do tráfego
  de saída.
- RNF7, recuperação automática: os serviços são reiniciados automaticamente
  após falhas ou faltas de energia, e o banco possui cópia de segurança
  diária.

## Estado de cada dispositivo

O middleware acompanha cada dispositivo por meio da máquina de estados da
Figura 9. O intervalo considerado é o de publicação do dispositivo ou, para
os dispositivos orientados a eventos, o do *heartbeat*. O estado
intermediário "atrasado" evita que a perda de uma única mensagem gere um
alerta.

![Estados de um dispositivo acompanhados pelo middleware.](fig09-estados-dispositivo.png){width=75%}

Fonte: Elaborado pelo autor (2026).

## Falhas e tratamento

A Tabela 5 reúne as falhas previstas, incluindo as quatro citadas no
enunciado (sensor offline, perda de conexão com a internet, retransmissão e
dados nulos ou corrompidos) e outras que o software também deve tratar.

: Falhas previstas e tratamento.

| Falha | Detecção | Tratamento |
|------------------------------|------------------------------------|------------------------------------------------------------|
| Sensor offline | *Last Will* ou ausência de mensagens por mais de 3 × o intervalo | Alerta R10. As regras dependentes do sensor são suspensas, pois dado desconhecido não é tratado como normal. |
| Perda de conexão com a internet | Falha no envio de notificação *push* | O funcionamento local não se altera. As notificações aguardam na fila, e o painel indica a ausência de internet. |
| Perda do Wi-Fi ou do broker | O dispositivo não consegue publicar | O dispositivo armazena ao menos 1 h de leituras e as retransmite com `buffered`. |
| Retransmissão e duplicatas | Par `(device, ts)` já recebido | A chave única do banco descarta a cópia, que é apenas contabilizada. |
| Dados atrasados ou retransmitidos | `buffered` ou atraso superior a 30 s | São armazenados no histórico, mas não disparam regras, pois a situação descrita pode ter mudado. |
| Dados nulos | Campo ausente ou `null` | O campo permanece nulo e a leitura é marcada como `parcial`; regras com variável nula não mudam de estado. |
| Dados corrompidos | JSON inválido, esquema incorreto, valor fora da faixa, NaN, instante futuro | A mensagem inválida é rejeitada e armazenada com o motivo; o campo fora da faixa é anulado (Figura 10). |
| Dados incoerentes | Potência divergente de V·I·FP; contador decrescente | São armazenados com a marca `inconsistente` e excluídos do cálculo de custo. |
| Atuador sem resposta | Ausência de confirmação do `cmd_id` em 10 s | Até 3 tentativas; em seguida, alerta R11. |
| *Hub* desligado com carga ligada | O relé não recebe a renovação do comando | O comando automático tem validade máxima de 15 min; sem renovação, o relé desliga a carga, exceto a lavadora em ciclo. |
| Falta de energia na residência | Tensão nula em todas as fases | O *hub* permanece no nobreak e registra a ocorrência (R12); a geração nula não dispara a R5. |

Fonte: Elaborado pelo autor (2026).

Mesmo na falha mais grave, com o *hub* desligado, o sensor de gás mantém o
alarme sonoro próprio (Seção 2.6); perdem-se apenas o alarme da casa e a
notificação remota.

A perda de conexão é tratada pela estratégia de armazenamento e
encaminhamento, na qual o dispositivo armazena as leituras e as retransmite
quando a conexão é restabelecida [@ufjf2026cap5, p. 17]. A apostila aponta
três riscos dessa estratégia [@ufjf2026cap5, p. 18], tratados no projeto da
seguinte forma. Quanto à memória limitada, a fila comporta ao menos 1 h de
leituras, descarta as mais antigas quando cheia e prioriza as mudanças de
estado. Quanto ao relógio incorreto, que comprometeria a série temporal, os
dispositivos sincronizam o relógio por NTP, e leituras com instante futuro
recebem a marca `relogio`. Quanto ao volume concentrado após uma interrupção
longa, a retransmissão segue a ordem cronológica, com vazão limitada, e as
leituras marcadas como `buffered` não disparam regras.

## Validação de dados

A validação aplica, na entrada, as dimensões de qualidade de dados da
Unidade 3 [@ufjf2026cap3, p. 5]. A validade é verificada pela faixa de cada
campo (Tabela 2). A unicidade é garantida pela chave `(device, ts)`, aplicada
na ingestão conforme recomenda a apostila [@ufjf2026cap3, p. 6–7]. A
completude trata o campo ausente como nulo e a ausência de mensagens como
mudança de estado do dispositivo. A consistência compara a potência com o
produto V·I·FP e exige que os contadores de energia não decresçam. A
atualidade impede que dados atrasados disparem regras, e a coerência
temporal identifica instantes futuros e utiliza o campo `seq` para revelar
perdas e reinícios.

A Figura 10 apresenta a sequência de validação aplicada a cada mensagem, com
três níveis de gravidade. A mensagem com JSON inválido, esquema incorreto,
dispositivo desconhecido ou instante excessivamente antigo é rejeitada por
inteiro e armazenada com o motivo. O campo fora da faixa, NaN ou nulo é
convertido em `NULL`, e a leitura é marcada como `parcial`, preservando os
demais campos, pois uma tensão corrompida não deve invalidar a potência
medida no mesmo instante. A leitura incoerente, por fim, é armazenada com a
marca `inconsistente` ou `relogio`, para que relatórios e regras possam
desconsiderá-la.

![Validação aplicada a cada mensagem recebida.](fig10-validacao.png){width=55%}

Fonte: Elaborado pelo autor (2026).

Apenas o valor fisicamente impossível é anulado. O valor possível, ainda que
raro, é preservado, pois pode corresponder justamente ao evento de interesse.
Esse critério segue a orientação da Unidade 3 de avaliar primeiro a
possibilidade física e só depois a estatística: o *outlier* impossível torna-se
dado faltante, e o possível é candidato a evento [@ufjf2026cap3, p. 8]. Um
pico de 46 A na entrada, por exemplo, é a condição que dispara a R3, e uma
tensão de 0 V caracteriza a falta de energia tratada pela R12. O middleware
também não preenche lacunas, pois a imputação de valores é uma técnica de
análise [@ufjf2026cap3, p. 10–16], e um valor estimado na entrada poderia
disparar indevidamente uma regra.

## Regras de resiliência

As falhas dos dispositivos são tratadas por regras no mesmo formato SE/ENTÃO,
avaliadas pelo motor descrito no Capítulo 5.

**R10 — Dispositivo offline**

> **SE** o dispositivo d passou ao estado offline (Figura 9)\
> **ENTÃO** notificar o instalador e o morador responsável, com severidade
> crítica se d for um `gas_sensor_*` ou `siren_*`\
> **E** suspender as regras dependentes de d até o restabelecimento.

**R11 — Atuador sem resposta**

> **SE** um comando permaneceu sem confirmação após 3 tentativas\
> **ENTÃO** registrar um aviso e colocar a carga em modo manual até a verificação pelo morador.

**R12 — Qualidade do fornecimento de energia**

> **SE** a tensão de uma fase permanece fora de 117 a 133 V por ≥ 60 s\
> **ENTÃO** registrar o evento e emitir um aviso, com severidade crítica abaixo
> de 110 V ou acima de 135 V.\
> **SE** a tensão é nula em todas as fases\
> **ENTÃO** registrar o início da falta de energia e, no restabelecimento,
> notificar a duração.

As faixas adotadas são as definidas pela ANEEL para a tensão nominal de
127 V em regime permanente [@aneel2021prodist8]. O histórico desses eventos
subsidia eventuais reclamações do morador junto à distribuidora.
