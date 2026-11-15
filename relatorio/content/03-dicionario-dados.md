# Dicionário de dados dos sensores

## Dispositivos

Os dispositivos são descritos pela função e pelos dados que entregam, não
pelo modelo: qualquer equipamento que publique as mensagens do Capítulo 4
serve. O identificador segue o formato `<tipo>_<local>_<nn>`. O tipo define o
formato das mensagens, o local diz onde o dispositivo fica e `nn` numera
dispositivos iguais no mesmo lugar.

É esse identificador que liga o dado técnico à entidade de negócio
[@ufjf2026cap5, p. 6–8]. Uma leitura de 742 W não diz nada sozinha; vinda de
`relay_pool_01`, é a bomba da piscina. O cadastro de cada dispositivo (local,
carga, limites e último estado conhecido) faz o papel do gêmeo digital
(*device shadow*). Para ampliar a casa basta cadastrar outro identificador,
como `gas_sensor_gourmet_01`, porque as regras se referem aos dispositivos
pelo tipo ("qualquer `gas_sensor_*`").

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

Todos usam Wi-Fi, menos o inversor. Os sensores capturam o ambiente; os relés
e o alarme são atuadores, que transformam a decisão do software em ação
física [@ufjf2026cap1, p. 5]. O alarme tem dois modos ativos: `warning`, com
luz e bipe curto, para avisos, e `alarm`, com sirene contínua, para
emergências.

## Variáveis medidas

A Tabela 2 lista o que cada dispositivo envia, com os nomes de campo usados
nas mensagens. A faixa válida é o limite físico ou operacional da grandeza;
a validação a usa para separar o valor impossível do valor apenas raro
[@ufjf2026cap3, p. 7–8].

A coleta combina dois métodos da Unidade 2 [@ufjf2026cap2, p. 3–5].
Grandezas que variam o tempo todo são periódicas, num intervalo que
acompanha o fenômeno: 10 s para a energia, porque o chuveiro muda a potência
da casa de um instante para o outro, e 60 s para o CO~2~, que sobe devagar.
Mudanças de estado, como gás detectado ou relé ligado, são eventos. Um sensor
que só fala quando algo acontece fica mudo se quebrar, então todo evento vem
com uma repetição periódica do estado (*heartbeat*), a abordagem híbrida da
apostila [@ufjf2026cap2, p. 5]. Na tabela, "evento + 60 s" quer dizer isso.
A potência da rede tem sinal: positiva quando a casa compra, negativa quando
injeta.

: Variáveis medidas, por tipo de dispositivo.

| Campo | Descrição | Unid. | Frequência | Faixa válida |
|------------------------|---------------------------------------|-------|---------------|-------------------|
| *`energy_meter_*`* | | | | |
| `voltage_v[a,b]` | Tensão de cada fase | V | 10 s | 0–160 (0 = sem energia) |
| `current_a[a,b]` | Corrente de cada fase na entrada | A | 10 s | 0–80 |
| `grid_power_w` | Potência trocada com a rede | W | 10 s | ±15 000 |
| `power_factor` | Fator de potência na entrada | – | 10 s | 0–1 |
| `frequency_hz` | Frequência da rede | Hz | 10 s | 55–65 |
| `import_kwh`, `export_kwh` | Energia comprada e injetada, acumuladas | kWh | 10 s | ≥ 0, não decresce |
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

Relés e alarme também devolvem `cmd_id`, o identificador do último comando
executado, que confirma a ação (Seção 4.3).

## Campos comuns a todas as mensagens

Sem metadados não se sabe de onde o valor veio, quando foi medido nem se é
confiável [@ufjf2026cap4, p. 39]. Toda mensagem traz os campos da Tabela 3.

: Metadados enviados em todas as mensagens.

| Campo | Conteúdo e uso |
|--------------|----------------------------------------------------------------------|
| `device` | Identificador do dispositivo; precisa bater com o tópico MQTT |
| `ts` | Instante da leitura em UTC (ISO 8601, relógio por NTP); com `device`, é a chave contra duplicatas |
| `seq` | Contador que cresce a cada mensagem e zera ao religar; revela perdas, duplicatas e reinícios |
| `uptime_s` | Segundos desde que o dispositivo ligou; revela reinícios inesperados |
| `rssi_dbm` | Sinal do Wi-Fi, para diagnóstico de cobertura |
| `buffered` | Leitura guardada durante uma queda e enviada depois; não dispara ações (Seção 7.3) |

Fonte: Elaborado pelo autor (2026).

## Variáveis calculadas

Parte do que o usuário vê não vem de nenhum sensor. O middleware calcula o
consumo da casa (`pv_power_w` + `grid_power_w`), a sobra solar (o valor de
`grid_power_w` com o sinal trocado, quando a casa injeta), o autoconsumo
((geração − injeção) ÷ geração), o custo do dia e do mês ((importação −
injeção compensável) × (tarifa + bandeira)), a projeção da conta (custo até
agora ÷ fração do mês decorrida) e o estado de cada dispositivo (`online`,
`atrasado` ou `offline`, pelo tempo desde a última mensagem). O custo é uma
estimativa: a conta real inclui impostos, iluminação pública e regras de
compensação que variam com a distribuidora [@brasil2022lei14300].
