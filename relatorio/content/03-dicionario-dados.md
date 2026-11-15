# Dicionário de dados dos sensores

## Dispositivos

Os dispositivos são caracterizados pela função e pelos dados que fornecem, e
não pelo modelo comercial; qualquer equipamento capaz de publicar as
mensagens definidas no Capítulo 4 é compatível. Cada dispositivo recebe um
identificador no formato `<tipo>_<local>_<nn>`, em que o tipo determina o
formato das mensagens, o local indica a instalação e `nn` distingue
dispositivos do mesmo tipo no mesmo local.

O identificador estabelece a associação entre o dado técnico e a entidade de
negócio descrita na apostila [@ufjf2026cap5, p. 6–8]. Uma leitura de 742 W
não tem significado isolado; associada a `relay_pool_01`, corresponde à
bomba da piscina. O cadastro de cada dispositivo (local, carga controlada,
limites e último estado conhecido) desempenha o papel de gêmeo digital
(*device shadow*). A inclusão de um novo dispositivo, como
`gas_sensor_gourmet_01`, exige apenas o cadastro do identificador, pois as
regras referenciam os dispositivos pelo tipo (por exemplo, "qualquer
`gas_sensor_*`").

: Dispositivos da casa.

| Identificador | Função | Local |
|------------------------------|----------------------------------------------|-------------------|
| `energy_meter_panel_01` | Medidor da entrada da casa, do chuveiro e do ar-condicionado | Quadro de distribuição |
| `pv_inverter_garage_01` | Inversor do sistema solar (lido pelo gateway local) | Garagem |
| `relay_pool_01` | Relé com medição da bomba da piscina | Casa de máquinas |
| `relay_laundry_01` | Relé com medição da lavadora | Lavanderia |
| `relay_outdoor_01` | Relé com medição da iluminação externa | Área externa |
| `gas_sensor_kitchen_01` | Sensor de gás (GLP ou natural) com alarme próprio | Cozinha |
| `air_quality_bedroom_01` | CO~2~ e temperatura | Quarto |
| `siren_hall_01` | Alarme sonoro e luminoso da casa | Corredor |

Fonte: Elaborado pelo autor (2026).

Todos os dispositivos utilizam Wi-Fi, com exceção do inversor. Os sensores
capturam grandezas do ambiente, enquanto os relés e o alarme são atuadores,
responsáveis por converter a decisão do software em ação física
[@ufjf2026cap1, p. 5]. O alarme possui dois modos ativos: `warning`, com
sinal luminoso e bipe curto, destinado a avisos, e `alarm`, com sirene
contínua, reservado a emergências.

## Variáveis medidas

A Tabela 2 relaciona as variáveis enviadas por tipo de dispositivo, com os
nomes de campo utilizados nas mensagens. A faixa válida corresponde ao limite
físico ou operacional de cada grandeza e é empregada pela validação para
distinguir o valor impossível do valor apenas improvável
[@ufjf2026cap3, p. 7–8].

A coleta combina dois métodos apresentados na Unidade 2
[@ufjf2026cap2, p. 3–5]. Grandezas de variação contínua são coletadas
periodicamente, com intervalo compatível com a dinâmica do fenômeno: 10 s
para a energia, pois o acionamento do chuveiro altera a potência da
residência de forma abrupta, e 60 s para o CO~2~, cuja variação é lenta.
Mudanças de estado, como a detecção de gás ou o acionamento de um relé, são
transmitidas como eventos. Como um sensor orientado a eventos não transmite
dados enquanto o estado não muda, uma falha do dispositivo não seria
percebida; por isso, cada evento é complementado por uma retransmissão
periódica do estado (*heartbeat*), conforme a abordagem híbrida recomendada
na apostila [@ufjf2026cap2, p. 5]. Na tabela, a notação "evento + 60 s"
indica esse comportamento. A potência trocada com a rede é positiva quando a
residência importa energia e negativa quando a injeta.

: Variáveis medidas, por tipo de dispositivo.

| Campo | Descrição | Unid. | Frequência | Faixa válida |
|------------------------|---------------------------------------|-------|---------------|-------------------|
| *`energy_meter_*`* | | | | |
| `voltage_v[a,b]` | Tensão de cada fase | V | 10 s | 0–160 (0 = sem energia) |
| `current_a[a,b]` | Corrente de cada fase na entrada | A | 10 s | 0–80 |
| `grid_power_w` | Potência trocada com a rede | W | 10 s | ±15 000 |
| `power_factor` | Fator de potência na entrada | – | 10 s | 0–1 |
| `frequency_hz` | Frequência da rede | Hz | 10 s | 55–65 |
| `import_kwh`, `export_kwh` | Energia importada e injetada, acumuladas | kWh | 10 s | ≥ 0, não decresce |
| `shower_power_w` | Potência do chuveiro | W | 10 s | 0–9 000 |
| `ac_power_w` | Potência do ar-condicionado | W | 10 s | 0–3 000 |
| *`pv_inverter_*`* | | | | |
| `pv_power_w` | Potência gerada | W | 30 s | 0–4 000 |
| `pv_energy_today_kwh` | Energia gerada no dia | kWh | 30 s | 0–40 |
| `inverter_state` | `generating`, `standby`, `fault` ou `off` | – | evento + 30 s | lista fechada |
| *`relay_*`* | | | | |
| `relay_on` | Relé ligado | – | evento + 60 s | – |
| `power_w` | Potência da carga | W | 10 s | 0–2 500 |
| `energy_kwh` | Energia acumulada da carga | kWh | 60 s | ≥ 0, não decresce |
| *`gas_sensor_*`, `air_quality_*`, `siren_*`* | | | | |
| `gas_detected` | Gás acima do limite do sensor | – | evento + 60 s | – |
| `co2_ppm` | Concentração de CO~2~ | ppm | 60 s | 300–5 000 |
| `temperature_c` | Temperatura do ambiente | °C | 60 s | −10 a 60 |
| `siren_mode` | `off`, `warning` ou `alarm` | – | evento + 60 s | lista fechada |

Fonte: Elaborado pelo autor (2026).

Os relés e o alarme informam ainda o campo `cmd_id`, identificador do último
comando executado, utilizado para confirmar a ação (Seção 4.3).

## Campos comuns a todas as mensagens

Sem metadados, não é possível determinar a origem de um valor, o instante da
medição nem o seu grau de confiabilidade [@ufjf2026cap4, p. 39]. Todas as
mensagens contêm os campos da Tabela 3.

: Metadados enviados em todas as mensagens.

| Campo | Conteúdo e uso |
|--------------|----------------------------------------------------------------------|
| `device` | Identificador do dispositivo; deve coincidir com o tópico MQTT |
| `ts` | Instante da leitura em UTC (ISO 8601, relógio sincronizado por NTP); em conjunto com `device`, forma a chave contra duplicatas |
| `seq` | Contador incrementado a cada mensagem e reiniciado ao religar; permite detectar perdas, duplicatas e reinícios |
| `uptime_s` | Tempo, em segundos, desde a inicialização; permite detectar reinícios inesperados |
| `rssi_dbm` | Intensidade do sinal Wi-Fi, para diagnóstico de cobertura |
| `buffered` | Indica leitura armazenada durante uma interrupção e enviada posteriormente; não dispara ações (Seção 7.3) |

Fonte: Elaborado pelo autor (2026).

## Variáveis calculadas

Parte das informações apresentadas ao usuário não é medida diretamente, mas
calculada pelo middleware: o consumo da residência (`pv_power_w` +
`grid_power_w`); o excedente solar (o valor de `grid_power_w` com sinal
invertido, quando há injeção); o autoconsumo ((geração − injeção) ÷
geração); o custo do dia e do mês ((importação − injeção compensável) ×
(tarifa + adicional da bandeira)); a projeção da fatura (custo acumulado ÷
fração decorrida do mês); e o estado de cada dispositivo (`online`,
`atrasado` ou `offline`, conforme o tempo desde a última mensagem). O custo
calculado é uma estimativa, uma vez que a fatura real inclui tributos,
contribuição de iluminação pública e regras de compensação que variam entre
distribuidoras [@brasil2022lei14300].
