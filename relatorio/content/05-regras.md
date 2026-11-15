# Regras de negócio automáticas

## Notação

As regras usam o formato do enunciado, **SE** <condição> **ENTÃO** <ação>,
o mesmo da Unidade 5, em que a regra de negócio é a "inteligência" do
software: traduz o fenômeno físico numa decisão, que pode mudar um estado,
registrar algo, avisar alguém ou acionar um atuador [@ufjf2026cap5, p. 4–6].
As variáveis são as do Capítulo 3, e `c` é uma carga controlada (bomba,
lavadora ou iluminação externa). "Por ≥ 5 min" quer dizer que a condição
precisa valer sem interrupção durante esse tempo, para não reagir a um pico
isolado. Os números são os valores padrão; todos podem ser configurados.

São nove regras: energia e cargas (R1 a R5), conforto (R6 e R7) e segurança
e saúde (R8 e R9). As que tratam falhas dos próprios dispositivos (R10 a R12)
estão no Capítulo 7.

## Energia e cargas

**R1 — Sobra solar liga uma carga adiável**

> **SE** sobra_solar ≥ potência_nominal(c) + 200 W por ≥ 5 min\
> **E** c está desligada e em modo automático\
> **E** [c = bomba **E** tempo_ligada_hoje(c) < tempo_mínimo(c)]
> **OU** [c = lavadora **E** o morador deixou um ciclo armado]\
> **E** não há gás detectado\
> **ENTÃO** ligar c, registrar a origem "sobra solar" e mostrar no painel.\
> **SE** hora ≥ horário_limite(c) **E** o compromisso do dia de c não foi cumprido\
> **ENTÃO** ligar c com energia da rede e avisar "ligada pela rede: a sobra
> solar não foi suficiente hoje".

Uma carga é ligada por vez, na ordem de prioridade, com 5 minutos entre uma
e outra para o medidor já mostrar o efeito da anterior. A segunda parte
garante o compromisso do dia, porque a piscina precisa ser filtrada e a roupa
lavada mesmo num dia nublado. A bomba precisa de 6 horas por dia, com limite
às 17:00. Para a lavadora, o morador diz até que horas a roupa deve estar
pronta, e o limite é esse prazo menos a duração do ciclo.

**R2 — Fim da sobra desliga a carga**

> **SE** grid_power_w > 300 W por ≥ 5 min\
> **E** c foi ligada pela R1 com sobra solar\
> **E** c não é uma lavadora no meio do ciclo\
> **ENTÃO** desligar c e registrar o motivo "sobra solar encerrada".

A lavadora não é interrompida: o ciclo termina quando `power_w` fica abaixo
de 5 W por 3 minutos. A distância entre o limite de ligar (sobra de 200 W
além da carga) e o de desligar (compra de 300 W) evita o liga-desliga quando
passa uma nuvem.

**R3 — Sobrecarga do disjuntor geral**

> **SE** max(current_a[a], current_a[b]) > 90 % da corrente do disjuntor (50 A) por ≥ 10 s\
> **ENTÃO** desligar a carga controlada de menor prioridade, abrir um aviso
> e repetir a cada 10 s enquanto durar.\
> **SE** a corrente fica abaixo de 70 % por ≥ 10 min **E** há cargas desligadas pela R3\
> **ENTÃO** religá-las, uma a cada 2 minutos.

O caso típico é um banho quente com a lavadora e a bomba ligadas. Desligar a
bomba evita que o disjuntor desarme e deixe a casa toda sem energia. Aqui até
a lavadora pode parar, porque proteger a instalação vem antes do ciclo.

**R4 — Conta projetada acima do orçamento**

> **SE** dia do mês ≥ 5 **E** custo projetado > orçamento mensal (R\$ 350)\
> **ENTÃO** avisar o morador responsável com a projeção e as três maiores
> fontes de consumo, no máximo uma vez por semana.

**R5 — Falha do sistema solar**

> **SE** inverter_state = `fault`\
> **OU** [entre 10:00 e 14:00 **E** a rede tem tensão **E** pv_power_w < 2 % dos
> 4 kWp instalados por ≥ 60 min]\
> **ENTÃO** avisar o instalador e o morador responsável.

A segunda condição pega o inversor que parou sem avisar. A exigência de
tensão na rede evita alarme falso: sem energia da rede, o inversor desliga
por segurança e geração zero é o esperado.

## Conforto

O ar-condicionado tem termostato próprio; o software só observa e sugere. A
faixa de 23 a 26 °C é a que a ANVISA recomenda para ambientes climatizados
[@anvisa2003re9]. A norma trata de ambientes coletivos e serve aqui de
referência.

**R6 — Ar-condicionado frio demais**

> **SE** ac_power_w > 300 W por ≥ 30 min **E** temperature_c(quarto) < 23 °C\
> **ENTÃO** sugerir ajustar o termostato para 23 a 26 °C, no máximo uma vez por dia.

**R7 — Ar-condicionado ligado com a casa vazia**

> **SE** ac_power_w > 300 W **E** é dia útil entre 08:00 e 17:00 há ≥ 30 min\
> **ENTÃO** avisar os moradores: "ar-condicionado ligado fora do horário de uso".

## Segurança e saúde da casa

Nas duas regras a seguir o atuador é o alarme da casa (`siren_*`). O modo
`alarm`, de sirene contínua, fica para emergências; o `warning`, de luz e bipe
curto, chama a atenção sem assustar.

**R8 — Gás detectado**

> **SE** gas_detected = verdadeiro em qualquer `gas_sensor_*`\
> **ENTÃO** pôr todos os `siren_*` em `alarm`, abrir alerta crítico, avisar
> todos os moradores e o contato de emergência, repetir o aviso a cada 5 min
> até alguém reconhecer **E** suspender todo acionamento automático de relés.\
> **SE** o alarme não confirmar o modo `alarm` em 10 s\
> **ENTÃO** abrir outro alerta crítico: "o alarme da casa não respondeu".\
> **SE** gas_detected = falso por ≥ 5 min **E** o alerta foi reconhecido\
> **ENTÃO** desligar o alarme e encerrar o alerta.

O sensor já apita sozinho; o alarme leva o aviso aos outros cômodos e a
notificação alcança quem está fora. Reconhecer silencia a sirene, mas o
alerta continua aberto enquanto houver gás. Os relés ficam parados porque o
contato de um relé pode gerar faísca.

**R9 — CO~2~ alto no ambiente**

> **SE** co2_ppm > 1 000 por ≥ 15 min\
> **ENTÃO** pôr o alarme em `warning` por 1 min, abrir um aviso e dizer aos
> moradores: "abra a janela para renovar o ar".\
> **SE** co2_ppm < 800 por ≥ 10 min\
> **ENTÃO** encerrar o alerta.

O limite de 1 000 ppm vem da mesma orientação da ANVISA [@anvisa2003re9]. CO~2~
alto é comum no quarto fechado à noite; por isso, entre 22:00 e 07:00, a R9
só notifica e deixa o alarme quieto. A folga entre 1 000 e 800 ppm evita que
o alerta abra e feche em sequência.

## Conflitos entre regras

Duas regras podem querer coisas opostas para a mesma carga: a R1 quer ligar
a bomba porque sobra energia, e a R3 quer desligá-la porque o disjuntor está
no limite. O motor resolve em duas etapas. Todas as regras propõem ações, e
um árbitro escolhe, para cada carga, a proposta de maior prioridade
(Figura 3). O morador pode assumir uma carga pelo painel; ela fica em modo
manual e a automação não a toca até o fim do dia, salvo por segurança. Cada
carga também fica pelo menos 10 minutos ligada ou desligada, para poupar o
motor da bomba e o relé.

![Ordem de prioridade aplicada pelo árbitro a cada ciclo de avaliação.](fig03-arbitragem.png){width=85%}

Fonte: Elaborado pelo autor (2026).

## Alertas e notificações

Cada regra que dispara abre um alerta com regra, alvo, severidade e
mensagem. Há no máximo um alerta aberto por regra e alvo; se a condição
continua, o alerta é o mesmo e a notificação não se repete. Ele se encerra
sozinho quando a condição deixa de valer, e o morador pode reconhecê-lo
antes disso.

A severidade decide quem é avisado. O alerta crítico (R8) vai a todos os
moradores e ao contato de emergência, com *push* repetido a cada 5 minutos
até ser reconhecido. O aviso (R3, R4, R5, R7 e R9) gera um único *push* ao
morador responsável, e a R5 também ao instalador. A informação (R1, R2 e R6)
aparece só no painel.
