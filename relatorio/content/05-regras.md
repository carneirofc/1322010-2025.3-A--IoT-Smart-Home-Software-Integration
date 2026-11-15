# Regras de negócio automáticas

## Notação

As regras seguem o formato solicitado no enunciado,
**SE** <condição> **ENTÃO** <ação>, o mesmo empregado na Unidade 5, em que a
regra de negócio representa a inteligência do software: ela traduz o
fenômeno físico em uma decisão, que pode alterar um estado, registrar uma
ocorrência, notificar um usuário ou acionar um atuador
[@ufjf2026cap5, p. 4–6]. As variáveis são as definidas no Capítulo 3, e `c`
representa uma carga controlada (bomba, lavadora ou iluminação externa). A
expressão "por ≥ 5 min" indica que a condição deve permanecer verdadeira,
sem interrupção, durante o intervalo, o que evita reações a picos isolados.
Os valores numéricos apresentados são os padrões e podem ser configurados.

As nove regras deste capítulo dividem-se em três grupos: energia e cargas
(R1 a R5), conforto (R6 e R7) e segurança e saúde (R8 e R9). As regras
relativas a falhas dos próprios dispositivos (R10 a R12) são apresentadas no
Capítulo 7.

## Energia e cargas

**R1 — Excedente solar aciona uma carga adiável**

> **SE** excedente_solar ≥ potência_nominal(c) + 200 W por ≥ 5 min\
> **E** c está desligada e em modo automático\
> **E** [c = bomba **E** tempo_ligada_hoje(c) < tempo_mínimo(c)]
> **OU** [c = lavadora **E** há um ciclo programado pelo morador]\
> **E** não há gás detectado\
> **ENTÃO** ligar c, registrar a origem "excedente solar" e exibir no painel.\
> **SE** hora ≥ horário_limite(c) **E** o compromisso diário de c não foi cumprido\
> **ENTÃO** ligar c com energia da rede e notificar "carga ligada pela rede:
> o excedente solar não foi suficiente".

As cargas são acionadas uma de cada vez, em ordem de prioridade, com
intervalo de 5 minutos, para que o medidor reflita o efeito da carga
anterior antes da próxima decisão. A segunda condição assegura o compromisso
diário, uma vez que a filtragem da piscina e a lavagem de roupas são
necessárias mesmo em dias nublados. A bomba deve funcionar 6 horas por dia,
com horário limite às 17:00. Para a lavadora, o morador informa o horário em
que a roupa deve estar pronta, e o horário limite corresponde a esse prazo
subtraído da duração do ciclo.

**R2 — Fim do excedente desliga a carga**

> **SE** grid_power_w > 300 W por ≥ 5 min\
> **E** c foi ligada pela R1 com excedente solar\
> **E** c não é uma lavadora com ciclo em andamento\
> **ENTÃO** desligar c e registrar o motivo "fim do excedente solar".

A lavadora não é interrompida durante o ciclo, cujo término é identificado
quando `power_w` permanece abaixo de 5 W por 3 minutos. A diferença entre o
limiar de acionamento (excedente de 200 W além da potência da carga) e o de
desligamento (importação de 300 W) estabelece uma histerese que evita
acionamentos sucessivos durante a passagem de nuvens.

**R3 — Sobrecarga do disjuntor geral**

> **SE** max(current_a[a], current_a[b]) > 90 % da corrente do disjuntor (50 A) por ≥ 10 s\
> **ENTÃO** desligar a carga controlada de menor prioridade, registrar um aviso
> e repetir a cada 10 s enquanto a condição persistir.\
> **SE** a corrente permanece abaixo de 70 % por ≥ 10 min **E** há cargas desligadas pela R3\
> **ENTÃO** religá-las, uma a cada 2 minutos.

A situação típica é o uso do chuveiro com a lavadora e a bomba em
funcionamento. O desligamento da bomba impede a atuação do disjuntor geral,
que deixaria toda a residência sem energia. Nesse caso, a lavadora pode ser
interrompida, pois a proteção da instalação tem prioridade sobre a
conclusão do ciclo.

**R4 — Projeção da fatura acima do orçamento**

> **SE** dia do mês ≥ 5 **E** custo projetado > orçamento mensal (R\$ 350)\
> **ENTÃO** notificar o morador responsável com a projeção e as três maiores
> parcelas de consumo, no máximo uma vez por semana.

**R5 — Falha do sistema solar**

> **SE** inverter_state = `fault`\
> **OU** [entre 10:00 e 14:00 **E** há tensão na rede **E** pv_power_w < 2 % dos
> 4 kWp instalados por ≥ 60 min]\
> **ENTÃO** notificar o instalador e o morador responsável.

A segunda condição identifica a parada do inversor sem registro de falha. A
verificação de tensão na rede evita falsos positivos, pois, na ausência de
tensão, o inversor conectado à rede se desliga por proteção, e a geração
nula é o comportamento esperado.

## Conforto

O ar-condicionado possui termostato próprio; o software apenas o monitora e
emite orientações. A faixa de 23 a 26 °C é a recomendada pela ANVISA para
ambientes climatizados [@anvisa2003re9]. Embora a norma se refira a
ambientes de uso coletivo, ela é adotada aqui como referência para a
residência.

**R6 — Ar-condicionado abaixo da faixa recomendada**

> **SE** ac_power_w > 300 W por ≥ 30 min **E** temperature_c(quarto) < 23 °C\
> **ENTÃO** sugerir o ajuste do termostato para 23 a 26 °C, no máximo uma vez por dia.

**R7 — Ar-condicionado ligado fora do horário de uso**

> **SE** ac_power_w > 300 W **E** é dia útil, entre 08:00 e 17:00, há ≥ 30 min\
> **ENTÃO** notificar os moradores: "ar-condicionado ligado fora do horário de uso".

## Segurança e saúde da casa

Nas duas regras a seguir, o atuador é o alarme da casa (`siren_*`). O modo
`alarm`, com sirene contínua, é reservado a emergências; o modo `warning`,
com sinal luminoso e bipe curto, chama a atenção sem caráter de emergência.

**R8 — Gás detectado**

> **SE** gas_detected = verdadeiro em qualquer `gas_sensor_*`\
> **ENTÃO** colocar todos os `siren_*` em modo `alarm`, registrar alerta
> crítico, notificar todos os moradores e o contato de emergência, repetir a
> notificação a cada 5 min até o reconhecimento **E** suspender todo
> acionamento automático de relés.\
> **SE** o alarme não confirmar o modo `alarm` em 10 s\
> **ENTÃO** registrar um segundo alerta crítico: "o alarme da casa não respondeu".\
> **SE** gas_detected = falso por ≥ 5 min **E** o alerta foi reconhecido\
> **ENTÃO** desligar o alarme e encerrar o alerta.

O sensor de gás dispõe de alarme sonoro próprio; o alarme da casa estende o
aviso aos demais cômodos, e a notificação alcança os moradores ausentes. O
reconhecimento silencia a sirene, mas o alerta permanece aberto enquanto
houver gás. Os acionamentos de relés são suspensos porque a comutação de
contatos pode produzir faíscas.

**R9 — Concentração elevada de CO~2~**

> **SE** co2_ppm > 1 000 por ≥ 15 min\
> **ENTÃO** colocar o alarme em modo `warning` por 1 min, registrar um aviso e
> notificar os moradores: "abra a janela para renovar o ar".\
> **SE** co2_ppm < 800 por ≥ 10 min\
> **ENTÃO** encerrar o alerta.

O limite de 1 000 ppm provém da mesma orientação da ANVISA [@anvisa2003re9].
A concentração elevada de CO~2~ é frequente em quartos fechados durante a
noite; por isso, entre 22:00 e 07:00, a R9 apenas notifica, sem acionar o
alarme. A diferença entre 1 000 e 800 ppm estabelece uma histerese que
impede a abertura e o encerramento sucessivos do alerta.

## Conflitos entre regras

Duas regras podem propor ações opostas para a mesma carga: a R1 propõe ligar
a bomba em razão do excedente solar, enquanto a R3 propõe desligá-la porque
a corrente se aproxima do limite do disjuntor. O motor resolve o conflito em
duas etapas: todas as regras propõem ações e, em seguida, um árbitro
seleciona, para cada carga, a proposta de maior prioridade (Figura 3). O
morador pode assumir o controle de uma carga pelo painel; nesse caso, ela
passa ao modo manual e não é alterada pela automação até o fim do dia,
exceto por razões de segurança. Cada carga permanece, ainda, no mínimo 10
minutos em cada estado, o que protege o motor da bomba e o relé contra
acionamentos sucessivos.

![Ordem de prioridade aplicada pelo árbitro a cada ciclo de avaliação.](fig03-arbitragem.png){width=85%}

Fonte: Elaborado pelo autor (2026).

## Alertas e notificações

Cada regra disparada registra um alerta com regra, alvo, severidade e
mensagem. Admite-se no máximo um alerta aberto por regra e alvo; enquanto a
condição persistir, o mesmo alerta é mantido, sem nova notificação. O
alerta é encerrado automaticamente quando a condição deixa de ser
verdadeira, e o morador pode reconhecê-lo antes disso.

A severidade determina os destinatários. O alerta crítico (R8) é enviado a
todos os moradores e ao contato de emergência, com notificação *push*
repetida a cada 5 minutos até o reconhecimento. O aviso (R3, R4, R5, R7 e R9)
gera uma única notificação ao morador responsável e, no caso da R5, também
ao instalador. A informação (R1, R2 e R6) é exibida apenas no painel.
