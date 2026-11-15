# Dicionário de dados dos sensores

## Dispositivos

O foco deste trabalho é o software, então os dispositivos são descritos pela
função e pelos dados que entregam, não pelo modelo do equipamento. Qualquer
equipamento que publique as mensagens do Capítulo 4 serve.

Cada dispositivo tem um identificador no formato `<tipo>_<local>_<nn>`:

- **tipo** diz o que o dispositivo mede ou faz e define o formato das suas
  mensagens (Tabelas 4 a 6);
- **local** diz onde ele fica;
- **nn** numera dispositivos do mesmo tipo no mesmo local.

O identificador faz a associação que a apostila descreve entre o dado técnico
e a entidade de negócio [@ufjf2026cap5, p. 6–8]: uma leitura de 742 W não
diz nada sozinha, mas `relay_pool_01` diz que é a bomba da piscina, na casa de
máquinas. O cadastro de cada dispositivo (local, carga controlada, limites,
último estado conhecido) faz o papel do gêmeo digital (*device shadow*).

Ampliar a casa é só cadastrar um novo identificador: um segundo sensor de
gás na área gourmet seria `gas_sensor_gourmet_01`; um sensor de ar na sala,
`air_quality_living_01`. Nada muda no middleware nem nas regras, que se
referem aos dispositivos pelo tipo (por exemplo, "qualquer `gas_sensor_*`").

: Dispositivos da casa.

| Identificador | Função | Local | Conexão |
|------------------------------|----------------------------------------------|-------------------|-------------------|
| `energy_meter_panel_01` | Medidor de energia da entrada da casa, do chuveiro e do ar-condicionado | Quadro de distribuição | Wi-Fi |
| `pv_inverter_garage_01` | Inversor do sistema solar | Garagem | Gateway local |
| `relay_pool_01` | Relé com medição: bomba da piscina | Casa de máquinas | Wi-Fi |
| `relay_laundry_01` | Relé com medição: lavadora | Lavanderia | Wi-Fi |
| `relay_outdoor_01` | Relé com medição: iluminação externa | Área externa | Wi-Fi |
| `gas_sensor_kitchen_01` | Sensor de gás (GLP ou gás natural) com alarme local | Cozinha | Wi-Fi |
| `air_quality_bedroom_01` | CO~2~ e temperatura do quarto | Quarto | Wi-Fi |
| `siren_hall_01` | Alarme sonoro e luminoso da casa (atuador) | Corredor | Wi-Fi |

Fonte: Elaborado pelo autor (2026).

Todos os dispositivos publicam direto no broker por Wi-Fi, exceto o inversor,
lido por um gateway local (Seção 4.2). Os sensores capturam o ambiente; os
relés e o alarme são atuadores, que convertem a decisão do software em ação
física [@ufjf2026cap1, p. 5].

## Variáveis medidas

As Tabelas 4 a 6 listam o que cada dispositivo envia. Os nomes dos campos são
os usados nas mensagens (Capítulo 4). A coluna "Faixa válida" é uma regra de domínio: o
limite físico ou operacional de cada grandeza, usado pela validação do
middleware (Seção 7.4) para separar o valor impossível do valor apenas raro
[@ufjf2026cap3, p. 7–8].

Os dispositivos usam dois dos métodos de coleta vistos na Unidade 2
[@ufjf2026cap2, p. 3–5]:

- **Periódica** para grandezas que variam o tempo todo (energia, potência,
  CO~2~). O intervalo acompanha a velocidade do fenômeno: 10 s para a energia,
  porque o chuveiro ou a bomba mudam a potência da casa de um instante para
  o outro; 60 s para o CO~2~, que sobe devagar.
- **Orientada a eventos** para mudanças de estado (gás detectado, relé ligado,
  modo do alarme). A detecção de vazamento de gás é o exemplo típico desse
  método na apostila. Como um sensor que só fala quando algo acontece fica
  "silencioso" se quebrar, os eventos vêm com um envio periódico de
  confirmação (*heartbeat*). É a abordagem híbrida recomendada: uma leitura de
  fundo mostra que o sensor está vivo, e o evento chega na hora
  [@ufjf2026cap2, p. 5].

Na coluna "Frequência", "evento + 60 s" significa que o dispositivo publica
na hora em que o estado muda e repete o estado a cada 60 s.

O medidor publica a média de cada janela de 10 s. A potência da rede tem sinal:
positiva quando a casa compra energia, negativa quando injeta.

: Variáveis de energia (`energy_meter_*` e `pv_inverter_*`).

| Campo | Descrição | Unidade | Frequência | Tipo | Faixa válida |
|------------------------|----------------------------------------|---------|------------|---------|--------------|
| `voltage_v[a,b]` | Tensão de cada fase (fase-neutro) | V | 10 s | float | 0–160 (0 = falta de energia) |
| `current_a[a,b]` | Corrente de cada fase na entrada da casa | A | 10 s | float | 0–80 |
| `grid_power_w` | Potência ativa trocada com a rede (+ compra, − injeção) | W | 10 s | float | −15 000 a 15 000 |
| `power_factor` | Fator de potência na entrada | – | 10 s | float | 0–1 |
| `frequency_hz` | Frequência da rede | Hz | 10 s | float | 55–65 |
| `import_kwh` | Energia comprada, acumulada | kWh | 10 s | float | ≥ 0, não decresce |
| `export_kwh` | Energia injetada, acumulada | kWh | 10 s | float | ≥ 0, não decresce |
| `shower_power_w` | Potência do chuveiro | W | 10 s | float | 0–9 000 |
| `ac_power_w` | Potência do ar-condicionado | W | 10 s | float | 0–3 000 |
| `pv_power_w` | Potência gerada pelo inversor | W | 30 s | float | 0–4 000 |
| `pv_energy_today_kwh` | Energia gerada no dia (zera à meia-noite) | kWh | 30 s | float | 0–40 |
| `inverter_state` | Estado do inversor | – | evento + 30 s | enum: `generating`, `standby`, `fault`, `off` | lista fechada |
| `inverter_fault_code` | Código de falha do fabricante | – | evento | int | ≥ 0 |

Fonte: Elaborado pelo autor (2026).

: Variáveis das cargas controladas (`relay_*`).

| Campo | Descrição | Unidade | Frequência | Tipo | Faixa válida |
|------------------------|----------------------------------------|---------|------------|---------|--------------|
| `relay_on` | Relé ligado | – | evento + 60 s | boolean | – |
| `power_w` | Potência consumida pela carga | W | 10 s | float | 0–2 500 |
| `energy_kwh` | Energia acumulada da carga | kWh | 60 s | float | ≥ 0, não decresce |
| `cmd_id` | Identificador do último comando executado (confirmação) | – | evento | string | UUID |

Fonte: Elaborado pelo autor (2026).

: Variáveis de segurança e do ar interno (`gas_sensor_*`, `air_quality_*`, `siren_*`).

| Campo | Descrição | Unidade | Frequência | Tipo | Faixa válida |
|------------------------|----------------------------------------|---------|------------|---------|--------------|
| `gas_detected` | Gás detectado acima do limite do sensor | – | evento + 60 s | boolean | – |
| `co2_ppm` | Concentração de CO~2~ | ppm | 60 s | int | 300–5 000 |
| `temperature_c` | Temperatura do ambiente | °C | 60 s | float | −10 a 60 |
| `siren_mode` | Modo do alarme da casa | – | evento + 60 s | enum: `off`, `warning`, `alarm` | lista fechada |
| `cmd_id` | Último comando executado pelo alarme (confirmação) | – | evento | string | UUID |

Fonte: Elaborado pelo autor (2026).

O alarme da casa tem dois modos ativos: `warning` (sinal luminoso e bipe
curto, para avisos) e `alarm` (sirene contínua, para emergências). Ele é o
único atuador que não é uma carga: recebe comandos do middleware e confirma
o estado como os relés.

## Campos comuns a todas as mensagens

O valor sozinho não basta: sem metadados, não se sabe de onde veio, quando
foi medido nem se é confiável [@ufjf2026cap4, p. 39]. Todas as mensagens
trazem os campos da Tabela 7.

: Metadados enviados em todas as mensagens.

| Campo | Descrição | Unidade | Tipo | Uso |
|------------------------|----------------------------------------|---------|---------|------------------------------------|
| `device` | Identificador do dispositivo | – | string | Confere com o tópico MQTT |
| `ts` | Instante da leitura, em UTC (ISO 8601), relógio sincronizado por NTP | – | timestamp | Ordenação, janelas de tempo e, com `device`, chave contra duplicatas |
| `seq` | Número de sequência, cresce a cada mensagem e zera ao religar | – | int | Detectar perdas, duplicatas e reinícios |
| `uptime_s` | Tempo desde que o dispositivo ligou | s | int | Detectar reinícios inesperados |
| `rssi_dbm` | Sinal Wi-Fi | dBm | int | Diagnóstico de cobertura |
| `buffered` | Leitura guardada no dispositivo durante uma queda e enviada depois | – | boolean | Não dispara ações (Seção 7.3) |

Fonte: Elaborado pelo autor (2026).

## Variáveis calculadas pelo software

Algumas informações que o usuário vê não são medidas por nenhum sensor; o
middleware as calcula a partir das medidas (Tabela 8).

: Variáveis derivadas.

| Variável | Cálculo |
|------------------------------|----------------------------------------------------------------|
| Consumo da casa (W) | `pv_power_w` + `grid_power_w` |
| Sobra solar (W) | −`grid_power_w` quando negativo; 0 caso contrário |
| Autoconsumo (%) | (geração − injeção) ÷ geração, no dia ou no mês |
| Custo do dia e do mês (R\$) | (importação − injeção compensável) × (tarifa + adicional da bandeira) |
| Projeção da conta (R\$) | custo do mês até agora ÷ fração do mês já decorrida |
| Estado de cada dispositivo | `online`, `atrasado` ou `offline`, pelo tempo desde a última mensagem |

Fonte: Elaborado pelo autor (2026).

O cálculo do custo é uma estimativa para orientar a família. A conta real
também inclui impostos, a contribuição de iluminação pública e as regras de
compensação dos créditos [@brasil2022lei14300], que variam com a distribuidora.
