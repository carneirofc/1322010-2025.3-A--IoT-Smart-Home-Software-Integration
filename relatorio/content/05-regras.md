# Regras de negócio automáticas

## Notação

As regras seguem o formato pedido no enunciado,
**SE** <condição> [**E**/**OU** <condição>] **ENTÃO** <ação de software>, o
mesmo da Unidade 5, onde a regra de negócio é a "inteligência" do software:
ela traduz o fenômeno físico em uma decisão computacional — mudar um estado,
registrar a ocorrência, notificar alguém, acionar um atuador
[@ufjf2026cap5, p. 4–6]. Os nomes
das variáveis são os do Capítulo 3; `c` representa uma carga controlada
(bomba da piscina, lavadora ou iluminação externa). "Por ≥ 5 min" significa
que a condição precisa ficar verdadeira sem interrupção durante esse tempo,
o que evita reagir a um pico isolado. Os limites numéricos são parâmetros
configuráveis (Tabela 11); os valores mostrados são os padrões.

São nove regras, em três grupos: energia e cargas (R1 a R5), conforto
(R6 e R7) e segurança e saúde da casa (R8 e R9). As regras que tratam falhas
dos próprios dispositivos (R10 a R12) estão no Capítulo 7.

## Energia e cargas

**R1 — Sobra solar liga uma carga adiável**

> **SE** sobra_solar ≥ potência_nominal(c) + 200 W por ≥ 5 min\
> **E** c está desligada e em modo automático\
> **E** [c = bomba da piscina **E** tempo_ligada_hoje(c) < tempo_mínimo(c)]
> **OU** [c = lavadora **E** o morador deixou um ciclo armado]\
> **E** não há gás detectado\
> **ENTÃO** ligar c, registrar a origem "sobra solar" e mostrar no painel.\
> **SE** hora ≥ horário_limite(c) **E** o compromisso do dia de c ainda não foi
> cumprido\
> **ENTÃO** ligar c com energia da rede e notificar "ligada pela rede: a sobra
> solar não foi suficiente hoje".

Só uma carga é ligada por vez, na ordem de prioridade configurada. A regra
espera 5 minutos antes de avaliar a próxima, para que o medidor já mostre o
efeito da carga anterior. A segunda parte garante o compromisso do dia: a
sobra solar é preferida, mas a piscina precisa ser filtrada e a roupa precisa
ser lavada mesmo em dia nublado. Para a bomba, o compromisso é funcionar 6
horas, com horário limite às 17:00; para a lavadora, o morador informa até
que horas a roupa deve estar pronta, e o horário limite é esse prazo menos a
duração do ciclo.

**R2 — Fim da sobra desliga a carga adiável**

> **SE** grid_power_w > 300 W por ≥ 5 min\
> **E** c foi ligada pela R1 com sobra solar\
> **E** c não é uma lavadora com ciclo em andamento\
> **ENTÃO** desligar c e registrar o motivo "sobra solar encerrada".

A lavadora nunca é interrompida no meio do ciclo: o software considera o ciclo
encerrado quando `power_w` fica abaixo de 5 W por 3 minutos. A diferença entre
o limite de ligar (sobra acima da potência da carga mais 200 W) e o de
desligar (compra acima de 300 W) cria uma folga que impede o liga-desliga
quando uma nuvem passa.

**R3 — Proteção contra sobrecarga do disjuntor geral**

> **SE** max(current_a[a], current_a[b]) > 0,9 × corrente_disjuntor_geral por ≥ 10 s\
> **ENTÃO** desligar a carga controlada ligada de menor prioridade, abrir um
> alerta de aviso e repetir a cada 10 s enquanto a condição continuar.\
> **SE** max(current_a[a], current_a[b]) < 0,7 × corrente_disjuntor_geral por ≥ 10 min\
> **E** há cargas desligadas pela R3\
> **ENTÃO** religar essas cargas, uma por vez, a cada 2 minutos.

O chuveiro, que não é controlado, é o motivo típico: banho quente com a
lavadora e a bomba ligadas. Desligar a bomba evita que o disjuntor desarme e
deixe a casa inteira sem energia. Aqui a lavadora pode ser interrompida,
porque proteger a instalação vem antes de terminar o ciclo.

**R4 — Projeção da conta acima do orçamento**

> **SE** dia_do_mês ≥ 5\
> **E** custo_projetado_do_mês > orçamento_mensal\
> **ENTÃO** notificar o morador responsável com a projeção e as três maiores
> fontes de consumo do mês, no máximo uma vez por semana.

**R5 — Falha do sistema solar**

> **SE** inverter_state = `fault`\
> **OU** [10:00 ≤ hora ≤ 14:00 **E** a rede tem tensão **E** pv_power_w < 2 %
> da potência instalada por ≥ 60 min]\
> **ENTÃO** abrir alerta de aviso para o instalador e para o morador
> responsável, com o código de falha, se houver.

A segunda condição pega o inversor que parou sem avisar. A exigência de rede
com tensão evita um falso alarme: na falta de energia, o inversor conectado à
rede desliga por segurança e a geração zero é esperada.

## Conforto (ar-condicionado, apenas orientação)

O ar-condicionado mantém o próprio termostato; o software só observa e
sugere. A faixa de 23 a 26 °C é a recomendada para o verão pela ANVISA para
ambientes climatizados [@anvisa2003re9]; a norma trata de ambientes de uso
coletivo e é usada aqui como referência para a casa.

**R6 — Ar-condicionado mais frio que o necessário**

> **SE** ac_power_w > 300 W por ≥ 30 min\
> **E** temperature_c(quarto) < 23 °C\
> **ENTÃO** sugerir ajustar o termostato para 23 a 26 °C, no máximo uma vez por dia.

**R7 — Ar-condicionado ligado fora do horário de uso**

> **SE** ac_power_w > 300 W\
> **E** a hora está na faixa "casa vazia" configurada há ≥ 30 min\
> **ENTÃO** avisar os moradores: "ar-condicionado ligado fora do horário de uso".

## Segurança e saúde da casa

Nas duas regras abaixo, o atuador é o alarme da casa (`siren_*`). O modo
`alarm` (sirene contínua) é reservado para emergências; o modo `warning`
(luz e bipe curto) chama a atenção sem assustar.

**R8 — Gás detectado**

> **SE** gas_detected = verdadeiro em qualquer `gas_sensor_*`\
> **ENTÃO** colocar todos os `siren_*` em modo `alarm`, abrir alerta crítico,
> notificar todos os moradores e o contato de emergência, repetir a
> notificação a cada 5 min até alguém reconhecer o alerta **E** suspender
> todo acionamento automático de relés enquanto durar a detecção.\
> **SE** o alarme não confirmar o modo `alarm` em 10 s\
> **ENTÃO** abrir um segundo alerta crítico: "o alarme da casa não respondeu".\
> **SE** gas_detected = falso por ≥ 5 min **E** o alerta foi reconhecido\
> **ENTÃO** desligar o alarme e encerrar o alerta.

O sensor de gás já apita sozinho; o alarme da casa espalha o aviso pelos
outros cômodos, e a notificação alcança quem está fora. Reconhecer o alerta
silencia a sirene, mas não encerra o alerta enquanto houver gás. A suspensão
dos relés segue a orientação de não acionar interruptores com gás no
ambiente, porque o contato do relé pode gerar faísca.

**R9 — CO~2~ alto no ambiente**

> **SE** co2_ppm > 1 000 por ≥ 15 min\
> **ENTÃO** colocar o alarme em modo `warning` por 1 min, abrir alerta de aviso
> e notificar os moradores: "abra a janela para renovar o ar".\
> **SE** co2_ppm < 800 por ≥ 10 min\
> **ENTÃO** encerrar o alerta.

O limite de 1 000 ppm é o indicador de renovação do ar da mesma orientação da
ANVISA usada na R6 [@anvisa2003re9]. O CO~2~ alto é comum no quarto fechado
durante a noite, e a folga entre 1 000 e 800 ppm evita que o alerta abra e
feche seguidamente. Entre 22:00 e 07:00, a R9 só notifica e não usa o alarme,
para não acordar a casa por um aviso que não é emergência.

## Parâmetros

: Parâmetros das regras e valores padrão.

| Parâmetro | Regra | Padrão |
|---------------------------------------------------|---------|-----------------|
| Folga de sobra acima da potência da carga | R1 | 200 W |
| Compra da rede que encerra a sobra | R2 | 300 W |
| Tempo de confirmação da sobra e do fim da sobra | R1, R2 | 5 min |
| Compromisso diário da bomba / horário limite | R1 | 6 h / 17:00 |
| Corrente do disjuntor geral | R3 | 50 A |
| Limites de desligar / religar | R3 | 90 % / 70 % |
| Orçamento mensal | R4 | R\$ 350,00 |
| Potência instalada do sistema solar | R5 | 4 kWp |
| Faixa de temperatura recomendada | R6 | 23 a 26 °C |
| Faixa "casa vazia" | R7 | dias úteis, 08:00 a 17:00 |
| CO~2~ para abrir / encerrar o alerta | R9 | 1 000 / 800 ppm |
| Tempo para encerrar o alarme de gás | R8 | 5 min sem detecção |
| Tempo mínimo ligado e desligado de cada carga | todas | 10 min |

Fonte: Elaborado pelo autor (2026), com base em @anvisa2003re9.

## Conflitos entre regras

Duas regras podem querer coisas opostas para a mesma carga: a R1 quer ligar a
bomba porque sobra energia, enquanto a R3 quer desligá-la porque o disjuntor
está no limite. O motor resolve isso em duas etapas. Primeiro, todas as regras
são avaliadas e propõem ações; depois, um árbitro escolhe, para cada carga, a
proposta de maior nível (Figura 3). O morador sempre pode assumir o controle de
uma carga pelo painel: ela passa para o modo manual e a automação não a toca
até o fim do dia, exceto pela segurança.

![Ordem de prioridade aplicada pelo árbitro a cada ciclo de avaliação.](fig03-arbitragem.png){width=85%}

Fonte: Elaborado pelo autor (2026).

O tempo mínimo ligado e desligado de 10 minutos protege o motor da bomba e o
relé contra acionamentos seguidos.

## Alertas e notificações

Cada regra que dispara abre um alerta com regra, alvo, severidade e mensagem.
Existe no máximo um alerta aberto por regra e alvo: se a condição continuar,
o mesmo alerta é mantido, sem repetir a notificação. O alerta é encerrado
sozinho quando a condição deixa de valer, ou reconhecido pelo morador. A
severidade define quem é avisado (Tabela 12).

: Severidade dos alertas e destino das notificações.

| Severidade | Exemplos | Quem recebe | Como |
|------------|-----------------------|-----------------------------|----------------------------------------|
| Crítico | R8 | todos os moradores e o contato de emergência | push repetido a cada 5 min até ser reconhecido |
| Aviso | R3 a R5, R7, R9 | morador responsável (R5 também o instalador) | um push |
| Informação | R1, R2, R6 | moradores | só no painel, sem push |

Fonte: Elaborado pelo autor (2026).
