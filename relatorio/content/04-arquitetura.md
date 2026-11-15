# Arquitetura de integração

## Visão geral

A Figura 1 apresenta o fluxo completo, organizado nas cinco camadas
solicitadas no enunciado: sensores e gateway, protocolo e broker,
middleware, banco de dados e aplicações. Todo o software é executado em um
pequeno computador instalado na residência, o *hub*. A internet é utilizada
apenas para acesso remoto, notificações no celular e sincronização do
relógio; na sua ausência, o sistema mantém a medição, o armazenamento e a
execução das regras (Seção 4.6).

As cinco camadas detalham o modelo de quatro camadas apresentado na
Unidade 1 [@ufjf2026cap1, p. 5–6]: sensores e atuadores compõem a camada de
percepção; Wi-Fi e MQTT, a camada de rede; middleware e banco de dados, a
camada de processamento; painel, Grafana e notificações, a camada de
aplicação. O *hub* atua como nó de névoa (*fog*), processando os dados
próximo aos sensores, em vez de transmiti-los a uma nuvem remota
[@ufjf2026cap1, p. 6; @ufjf2026cap2, p. 6].

![Arquitetura de integração, do sensor à aplicação.](fig01-arquitetura.png){width=95%}

Fonte: Elaborado pelo autor (2026).

## Sensores e gateway

Os dispositivos da Tabela 1 publicam diretamente no broker por Wi-Fi. Por
estarem no interior da residência, próximos ao roteador e alimentados pela
rede elétrica, enquadram-se no caso em que a Unidade 2 recomenda essa
tecnologia [@ufjf2026cap2, p. 23]. Em caso de perda de conexão, os
dispositivos armazenam as leituras e as retransmitem posteriormente, com o
instante original e a marcação `buffered`, segundo a estratégia de
armazenamento e encaminhamento (*store-and-forward*)
[@ufjf2026cap2, p. 6; @ufjf2026cap5, p. 17], detalhada na Seção 7.3.

O inversor solar é a única exceção, por não suportar MQTT. Um gateway local
consulta o inversor a cada 30 s e republica as leituras no mesmo formato dos
demais dispositivos, sem depender da plataforma em nuvem do fabricante,
desempenhando a função de conversão de protocolos atribuída ao gateway
[@ufjf2026cap2, p. 17].

## Protocolo e broker

Adotou-se o protocolo MQTT [@oasis2019mqtt5], baseado no padrão
publicador-assinante (*pub/sub*): os dispositivos publicam em tópicos, e os
componentes interessados os assinam, sem que o dispositivo precise conhecer
os consumidores dos seus dados
[@ufjf2026cap2, p. 10–11; @ufjf2026cap5, p. 8–9]. Esse desacoplamento
permite incluir novos consumidores, como o Grafana, sem alterar os sensores.
O HTTP foi reservado à comunicação entre o painel e o middleware, na qual o
custo por requisição não onera os dispositivos [@ufjf2026cap2, p. 12]. O
broker utilizado é o Mosquitto, executado no próprio *hub*. Por constituir o
ponto único de falha do padrão *pub/sub* [@ufjf2026cap5, p. 9], sua
indisponibilidade é compensada pelo armazenamento local das leituras nos
dispositivos. A Tabela 4 resume os tópicos.

: Tópicos MQTT.

| Tópico | Publicador | Retido | Conteúdo |
|------------------------------|-----------------|:------:|----------------------------------------|
| `home/{device}/telemetry` | dispositivo | não | leituras periódicas (Tabela 2) |
| `home/{device}/event` | dispositivo | não | mudança de estado: gás, relé, alarme |
| `home/{device}/status` | dispositivo e broker | sim | `online` na conexão; `offline` publicado pelo broker (*Last Will*) |
| `home/{device}/cmd` | middleware | não | comando com `cmd_id` e prazo de validade |
| `home/{device}/state` | atuador | sim | estado atual e último `cmd_id` executado |

Fonte: Elaborado pelo autor (2026).

Todos os tópicos utilizam QoS 1 ("pelo menos uma vez"), nível em que a
mensagem é retransmitida até a confirmação do broker e pode, portanto, ser
recebida em duplicidade. A apostila apresenta duas alternativas para esse
problema: a deduplicação na ingestão ou o uso de QoS 2, de maior custo
[@ufjf2026cap2, p. 11, 23]. Para as leituras, a deduplicação é suficiente
(Seção 7.3). Para comandos críticos, a apostila recomenda QoS 2
[@ufjf2026cap5, p. 16–17]; neste projeto, o mesmo efeito é obtido com o
campo `cmd_id`. O atuador ignora comandos já executados e confirma o estado
no tópico `state`, de modo que a retransmissão de uma mensagem não resulta
na repetição da ação.

Outros recursos do MQTT complementam o projeto [@ufjf2026cap2, p. 11]. Na
conexão, cada dispositivo registra uma mensagem de desconexão (*Last Will*),
publicada pelo broker caso a conexão seja interrompida sem encerramento
regular; com intervalo de *keep-alive* de 10 s, o broker detecta a perda em
cerca de 15 s (1,5 vez o intervalo).
O tópico `state` é retido, de forma que todo novo assinante recebe
imediatamente o último estado de cada atuador. Os comandos, por sua vez, não
são retidos e possuem prazo de validade (*message expiry*, do MQTT 5), o que
impede que um atuador reconectado horas depois execute um comando expirado.

A segurança é organizada em camadas: TLS na porta 8883, credencial
individual por dispositivo e lista de controle de acesso (ACL) que restringe
cada dispositivo aos próprios tópicos. A credencial individual corresponde à
boa prática indicada na apostila [@ufjf2026cap5, p. 15–16] e impede, por
exemplo, que um relé comprometido se passe pelo sensor de gás. Como os
tópicos incorporam o identificador do dispositivo (`home/relay_pool_01/cmd`),
a inclusão de um novo dispositivo requer apenas o cadastro, o usuário no
broker e uma entrada na ACL. O exemplo a seguir apresenta uma mensagem do
medidor:

```json
{
  "device": "energy_meter_panel_01", "ts": "2026-11-15T15:20:10Z", "seq": 48213,
  "uptime_s": 482130, "rssi_dbm": -58, "buffered": false,
  "voltage_v": {"a": 126.4, "b": 127.1}, "current_a": {"a": 6.2, "b": 5.6},
  "grid_power_w": -1450.0, "power_factor": 0.97, "frequency_hz": 60.0,
  "import_kwh": 5231.42, "export_kwh": 3120.77,
  "shower_power_w": 0.0, "ac_power_w": 0.0
}
```

## Middleware

O middleware é um serviço em Python, construído com o FastAPI. O módulo de
ingestão assina o tópico `home/#` e valida cada mensagem quanto ao esquema,
à faixa dos valores, à coerência entre campos e ao relógio; mensagens
inválidas são rejeitadas e armazenadas com o motivo (Seção 7.4). Em seguida,
o middleware atualiza o último estado conhecido do dispositivo, o gêmeo
digital definido no Capítulo 3, e só então avalia as regras associadas a ele
[@ufjf2026cap5, p. 6–7].

O motor de regras é executado a cada leitura e, adicionalmente, a cada 10 s,
para as regras que dependem de duração ("há 5 minutos"). O motor não realiza
operações de entrada e saída: recebe fatos e devolve decisões, o que permite
testá-lo sem broker e sem banco de dados. O módulo de despacho publica cada
comando, aguarda no tópico `state` a confirmação com o mesmo `cmd_id` e
realiza até três tentativas antes de registrar um alerta de atuador sem
resposta. As notificações são gravadas no banco antes do envio (padrão
*outbox*) e, em caso de indisponibilidade da internet, são enviadas quando a
conexão é restabelecida. Uma API REST atende às consultas e aos comandos
manuais, e um canal WebSocket envia leituras e alertas ao painel, combinação
indicada na apostila para painéis com atualização automática
[@ufjf2026cap5, p. 12–14]. A Figura 2 ilustra o percurso de uma leitura até
a ação correspondente, tomando como exemplo a regra de excedente solar (R1).

![Sequência de uma leitura até o acionamento da bomba da piscina por excedente solar.](fig02-sequencia-excedente.png){width=100%}

Fonte: Elaborado pelo autor (2026).

## Banco de dados

O banco de dados adotado é o PostgreSQL com a extensão TimescaleDB. A maior
parte das consultas do sistema é temporal ("consumo das últimas 24 h"), o
que corresponde ao padrão de escrita intensa e leitura por janelas de tempo
para o qual os bancos de séries temporais são projetados
[@ufjf2026cap4, p. 9–10]. As leituras são armazenadas em tabelas
particionadas por tempo (*hypertables*), comprimidas após uma semana e
agregadas automaticamente por minuto, hora e dia (*continuous aggregates*);
as consultas de histórico utilizam esses agregados. Os dados relacionais
(cadastro, alertas e comandos) permanecem no mesmo banco.

A política de retenção segue a classificação em dados quentes, mornos e
frios [@ufjf2026cap4, p. 14–19]. O dado quente é a leitura recém-recebida,
que alimenta as regras. As leituras brutas de energia, cargas e qualidade do
ar são mantidas por 90 dias, e os agregados por minuto, por dois anos;
constituem os dados mornos utilizados pelo painel e pelo Grafana. Os
agregados por hora e por dia são mantidos sem prazo, como dados frios, para
comparações entre anos. Eventos, alertas e comandos também são preservados
indefinidamente, pois o dado bruto deve ser mantido sempre que houver um
evento a ser explicado [@ufjf2026cap4, p. 38–39]. As mensagens rejeitadas
são mantidas por 30 dias.

## Aplicações e implantação

O painel web (Capítulo 6) é a interface dos moradores e funciona no celular
como aplicativo instalável (PWA). O Grafana oferece ao instalador a análise
do histórico, com acesso ao banco por um usuário somente de leitura. As
notificações *push* entregam os alertas no celular mesmo com o painel
fechado. Como a entrega do *push* não é garantida e o contato de emergência
não utiliza o painel, os alertas críticos seguem também por mensagem de
texto (SMS), que alcança o contato de emergência sem aplicativo instalado.

Todos os serviços do *hub* são executados em contêineres, iniciados em
conjunto por um arquivo *compose*, e o *hub* e o roteador são alimentados
por um nobreak, para que o registro e a rede local continuem durante uma
falta de energia. Sem internet, o
sistema mantém medição, armazenamento, regras e painel na rede local; apenas
as notificações aguardam na fila, e o acesso externo, realizado por VPN,
fica indisponível. A permanência dos dados na residência protege também a
privacidade, uma vez que o perfil de consumo revela a rotina da família e
constitui dado pessoal [@brasil2018lgpd]. Para o uso pela própria família, a
LGPD não se aplica (art. 4º, I); ela passa a reger o sistema se ele for
oferecido como serviço a terceiros.
