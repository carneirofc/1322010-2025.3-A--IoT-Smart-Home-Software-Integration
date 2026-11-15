# Arquitetura de integração

## Visão geral

A Figura 1 mostra o fluxo completo, organizado nas cinco camadas pedidas no
enunciado: sensores e gateway, protocolo e broker, middleware, banco de dados
e aplicações. Todo o software, do broker ao painel, roda em um pequeno
computador dentro da casa (o *hub*). A internet é usada apenas para acesso
remoto, notificações no celular e acerto do relógio; sem ela, a casa continua
medindo, gravando e executando as regras (Seção 4.7).

As cinco camadas detalham o modelo de quatro camadas da Unidade 1
[@ufjf2026cap1, p. 5–6]: os sensores e atuadores formam a camada de
percepção; o Wi-Fi e o MQTT, a camada de rede; o middleware e o banco, a
camada de processamento e suporte; o painel, o Grafana e as notificações, a
camada de aplicação. O *hub* é um nó de névoa (*fog*): processa os dados
dentro da casa, perto dos sensores, em vez de enviá-los a uma nuvem distante
[@ufjf2026cap1, p. 6; @ufjf2026cap2, p. 6].

![Arquitetura de integração, do sensor à aplicação.](fig01-arquitetura.png){width=95%}

Fonte: Elaborado pelo autor (2026).

## Sensores e gateway

Os dispositivos da Tabela 3 publicam direto no broker MQTT por Wi-Fi: estão
dentro da casa, perto do roteador e ligados à tomada, o caso em que a
Unidade 2 indica o Wi-Fi [@ufjf2026cap2, p. 23]. Quando perdem a conexão,
guardam as leituras e as reenviam ao reconectar, com o instante original e a
marca `buffered`. É a estratégia *store-and-forward* (armazenar e encaminhar)
[@ufjf2026cap2, p. 6; @ufjf2026cap5, p. 17], detalhada na Seção 7.3.

A exceção é o inversor solar, que não fala MQTT. Um gateway local o consulta
a cada 30 s e publica o resultado em MQTT, no mesmo formato dos demais, sem
depender da nuvem do fabricante. É o papel clássico do gateway: converter
protocolos e encaminhar os dados [@ufjf2026cap2, p. 17]. Para o middleware,
todos os dispositivos são iguais.

## Protocolo e broker

O protocolo é o MQTT [@oasis2019mqtt5], no padrão publicador-assinante
(*pub/sub*): os dispositivos publicam em tópicos, e quem se interessa (o
middleware, o gateway de notificações, o painel) assina esses tópicos, sem
que o dispositivo precise saber quem consome os seus dados
[@ufjf2026cap2, p. 10–11; @ufjf2026cap5, p. 8–9]. Esse desacoplamento é o que
permite acrescentar um consumidor novo, como o Grafana, sem mexer em nenhum
sensor. O HTTP/REST ficou para a integração entre o painel e o middleware,
porque o seu custo por requisição pesa nos dispositivos e não nas aplicações
[@ufjf2026cap2, p. 12].

O ponto fraco do *pub/sub* é o broker, ponto único de falha
[@ufjf2026cap5, p. 9]. Aqui ele roda no próprio *hub*, junto do middleware: se
o *hub* cair, cai tudo de uma vez, e os dispositivos guardam as leituras até
ele voltar (Seção 7.3). O broker é o Mosquitto. A Tabela 9 resume os tópicos.

: Tópicos MQTT.

| Tópico | Quem publica | QoS | Retido | Conteúdo |
|------------------------------|-----------------|:---:|:------:|----------------------------------------|
| `home/{device}/telemetry` | dispositivo | 1 | não | leituras periódicas (Tabelas 4 a 6) |
| `home/{device}/event` | dispositivo | 1 | não | mudança de estado: gás, relé, alarme |
| `home/{device}/status` | dispositivo e broker | 1 | sim | `online` ao conectar; `offline` publicado pelo broker como *Last Will* |
| `home/{device}/cmd` | middleware | 1 | não | comando com `cmd_id` e prazo de validade |
| `home/{device}/state` | atuador | 1 | sim | estado atual do relé ou do alarme e o último `cmd_id` executado |

Fonte: Elaborado pelo autor (2026).

As escolhas principais são:

- **QoS 1** ("pelo menos uma vez"): a mensagem é repetida até o broker
  confirmar. Pode chegar duplicada, e por isso o middleware descarta
  duplicatas (Seção 7.3). A apostila apresenta as duas saídas para esse
  problema: deduplicar na ingestão ou usar QoS 2, com mais sobrecarga
  [@ufjf2026cap2, p. 11, 23]. Para as leituras, a deduplicação basta. Para
  os comandos, a apostila recomenda QoS 2 em ações críticas
  [@ufjf2026cap5, p. 16–17]; o mesmo efeito é obtido com QoS 1 e o `cmd_id`:
  o atuador ignora um comando que já executou e confirma o estado no tópico
  `state`, de modo que repetir a mensagem nunca repete a ação.
- **Last Will (LWT):** cada dispositivo registra, ao conectar, uma mensagem
  `offline` que o broker publica sozinho se a conexão cair sem despedida
  [@ufjf2026cap2, p. 11]. Isso detecta o dispositivo mudo em segundos, sem
  esperar o tempo limite.
- **Estado retido:** o tópico `state` guarda o último estado de cada atuador,
  e quem se conecta recebe esse valor na hora [@ufjf2026cap2, p. 11].
- **Comandos não retidos e com validade:** um comando guardado no broker
  poderia ser executado horas depois, quando o atuador voltasse, numa situação
  já diferente. Por isso o comando não é retido e leva um prazo de validade
  (*message expiry* do MQTT 5); se expirar, o atuador o ignora.
- **Segurança em camadas:** TLS na porta 8883 (MQTTS), uma credencial
  própria para cada dispositivo e uma lista de controle de acesso (ACL) que só
  deixa cada dispositivo publicar nos próprios tópicos e receber os próprios
  comandos. A apostila aponta a credencial única por dispositivo como a boa
  prática contra o erro de usar a mesma senha em todos
  [@ufjf2026cap5, p. 15–16]: um relé invadido não consegue se passar pelo
  sensor de gás.
- **Identificadores genéricos:** o tópico usa o identificador do dispositivo
  (`home/relay_pool_01/cmd`). Um dispositivo novo só precisa de cadastro, de
  um usuário no broker e de uma linha na ACL; os tópicos já existem pelo
  padrão.

Exemplo de mensagem do medidor do quadro:

```json
{
  "device": "energy_meter_panel_01", "ts": "2026-11-15T15:20:10Z", "seq": 48213,
  "uptime_s": 482130, "rssi_dbm": -58, "buffered": false,
  "voltage_v": {"a": 126.4, "b": 127.1}, "current_a": {"a": 3.1, "b": 2.4},
  "grid_power_w": -1450.0, "power_factor": 0.97, "frequency_hz": 60.0,
  "import_kwh": 5231.42, "export_kwh": 3120.77,
  "shower_power_w": 0.0, "ac_power_w": 0.0
}
```

## Middleware

O middleware é um serviço em Python (FastAPI) com cinco partes:

1. **Ingestão:** assina `home/#` e valida cada mensagem: esquema, faixa de
   cada campo (Tabelas 4 a 6),
   coerência entre campos e relógio. Mensagens inválidas são rejeitadas e
   guardadas com o motivo; campos inválidos viram nulos (Seção 7.4).
2. **Motor de regras:** avalia as regras do Capítulo 5 a cada leitura e a cada
   10 s (para as regras que dependem de tempo, como "há 5 minutos"). O motor
   não faz entrada e saída: recebe fatos e devolve decisões, o que permite
   testá-lo sem broker nem banco.
3. **Despacho de comandos:** publica o comando, espera a confirmação no tópico
   `state` com o mesmo `cmd_id` e tenta de novo até três vezes. Sem
   confirmação, gera um alerta de atuador sem resposta.
4. **Fila de notificações:** grava cada notificação no banco antes de
   enviá-la. Se a internet cair, as notificações ficam na fila e saem quando
   ela voltar (padrão *outbox*).
5. **API:** REST para consultas e comandos manuais, e WebSocket para empurrar
   leituras e alertas ao painel sem que ele precise perguntar. É a combinação
   que a apostila indica para painéis que se atualizam sozinhos
   [@ufjf2026cap5, p. 12–14].

A cada leitura, o middleware atualiza o último estado conhecido do
dispositivo (o gêmeo digital do Capítulo 3) e só então avalia as regras
ligadas a ele [@ufjf2026cap5, p. 6–7].

A Figura 2 mostra o caminho de uma leitura até uma ação, usando a regra de
sobra solar (R1, Capítulo 5) como exemplo.

![Sequência de uma leitura até o acionamento da bomba da piscina por sobra solar.](fig02-sequencia-excedente.png){width=100%}

Fonte: Elaborado pelo autor (2026).

## Banco de dados

O banco é o PostgreSQL com a extensão TimescaleDB, um banco de séries
temporais (TSDB). Quase toda consulta do sistema é temporal ("consumo das
últimas 24 h", "média por hora no mês"), o padrão "escrever muito, ler por
janelas de tempo" para o qual esses bancos são feitos [@ufjf2026cap4, p. 9–10].
As tabelas de leituras são particionadas por tempo (*hypertables*),
comprimidas depois de uma semana e resumidas automaticamente em médias por
minuto, hora e dia (*continuous aggregates*). As consultas de histórico leem
os resumos, não os dados brutos. Por ser PostgreSQL, os dados relacionais
(cadastro, alertas, comandos) ficam no mesmo banco.

A retenção da Tabela 10 segue a divisão em dados quentes, mornos e frios
[@ufjf2026cap4, p. 14–19]. O dado quente é a leitura que acabou de chegar e
dispara as regras; o morno são as leituras brutas dos últimos 90 dias e os
resumos por minuto, que alimentam o painel e o Grafana; o frio são os resumos
por hora e por dia, guardados sem prazo para comparar um ano com o outro. As
leituras brutas são descartadas depois de 90 dias, mas os eventos, os alertas
e os comandos nunca são: na apostila, o dado bruto deve ser preservado
justamente quando há um evento que precisa ser explicado depois
[@ufjf2026cap4, p. 38–39].

: Tabelas principais e tempo de retenção.

| Tabela | Conteúdo | Retenção |
|------------------------------|--------------------------------------------------|-------------------|
| `energy_readings` | leituras do medidor e do inversor | 90 dias |
| `load_readings` | potência e estado dos relés | 90 dias |
| `environment_readings` | CO~2~ e temperatura do quarto | 90 dias |
| `energy_1min`, `energy_1h`, `energy_1d` | resumos de energia, custo por dia | 2 anos (1 min); indefinida (hora e dia) |
| `device_events` | mudanças de estado (gás, relés, alarme) | indefinida |
| `alerts` | alertas, com regra, severidade, abertura, reconhecimento e encerramento | indefinida |
| `commands` | comandos, origem (regra ou usuário), confirmação | indefinida |
| `rejected_messages` | mensagens rejeitadas e o motivo | 30 dias |
| `devices` | cadastro e último contato de cada dispositivo | — |

Fonte: Elaborado pelo autor (2026).

## Aplicações

- **Painel web** (Capítulo 6): página responsiva que também funciona como
  aplicativo no celular (PWA). É a interface dos moradores: energia, cargas,
  segurança e alertas.
- **Grafana:** painéis de histórico para o instalador e para quem quer
  analisar o consumo em detalhe. Acessa o banco com um usuário somente
  leitura.
- **Notificações push:** os alertas chegam ao celular mesmo com o painel
  fechado. Os críticos de segurança também vão para o contato de emergência.

## Implantação e funcionamento sem internet

Todos os serviços do *hub* (broker, gateway do inversor, middleware, banco,
painel e Grafana) são contêineres, iniciados juntos por um arquivo
*compose*. O *hub* fica ligado a um nobreak, para continuar registrando
durante uma falta de energia.

Sem internet, a casa continua medindo, gravando, executando as regras e
mostrando o painel na rede local. Só duas coisas dependem da internet: as
notificações no celular, que ficam na fila e saem quando a conexão volta, e o
acesso ao painel de fora de casa, feito por VPN. O alarme local do sensor de gás
não depende nem do *hub*.

Manter tudo dentro de casa também protege a privacidade: os dados de consumo
revelam a rotina da família (quando acorda, quando sai, quando viaja) e são
dados pessoais [@brasil2018lgpd]. Nada sai da casa, exceto as notificações.
