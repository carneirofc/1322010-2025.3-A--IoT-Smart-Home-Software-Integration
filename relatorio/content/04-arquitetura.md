# Arquitetura de integração

## Visão geral

A Figura 1 mostra o fluxo completo nas cinco camadas pedidas no enunciado:
sensores e gateway, protocolo e broker, middleware, banco de dados e
aplicações. Todo o software roda num pequeno computador dentro da casa, o
*hub*. A internet serve só para acesso remoto, notificações no celular e
acerto do relógio; sem ela, a casa continua medindo, gravando e executando
as regras (Seção 4.6).

As cinco camadas detalham o modelo de quatro camadas da Unidade 1
[@ufjf2026cap1, p. 5–6]. Sensores e atuadores são a percepção; Wi-Fi e MQTT,
a rede; middleware e banco, o processamento; painel, Grafana e notificações,
a aplicação. O *hub* é um nó de névoa (*fog*): processa os dados perto dos
sensores em vez de mandá-los para uma nuvem distante
[@ufjf2026cap1, p. 6; @ufjf2026cap2, p. 6].

![Arquitetura de integração, do sensor à aplicação.](fig01-arquitetura.png){width=95%}

Fonte: Elaborado pelo autor (2026).

## Sensores e gateway

Os dispositivos da Tabela 1 publicam direto no broker por Wi-Fi. Estão dentro
de casa, perto do roteador e ligados à tomada, o caso em que a Unidade 2
indica o Wi-Fi [@ufjf2026cap2, p. 23]. Se perdem a conexão, guardam as
leituras e as reenviam depois, com o instante original e a marca `buffered`.
É a estratégia de armazenar e encaminhar (*store-and-forward*)
[@ufjf2026cap2, p. 6; @ufjf2026cap5, p. 17], detalhada na Seção 7.3.

Só o inversor solar não fala MQTT. Um gateway local o consulta a cada 30 s e
republica as leituras no mesmo formato dos outros dispositivos, sem passar
pela nuvem do fabricante [@ufjf2026cap2, p. 17].

## Protocolo e broker

O protocolo é o MQTT [@oasis2019mqtt5], no padrão publicador-assinante: os
dispositivos publicam em tópicos e quem tem interesse assina, sem que o
dispositivo saiba quem consome os dados
[@ufjf2026cap2, p. 10–11; @ufjf2026cap5, p. 8–9]. Por isso dá para
acrescentar um consumidor, como o Grafana, sem mexer em nenhum sensor. O
HTTP ficou entre o painel e o middleware, onde o custo por requisição não
pesa [@ufjf2026cap2, p. 12]. O broker é o Mosquitto, no próprio *hub*. Ele é
o ponto único de falha do *pub/sub* [@ufjf2026cap5, p. 9]; se cair, os
dispositivos guardam as leituras até ele voltar.

: Tópicos MQTT.

| Tópico | Quem publica | Retido | Conteúdo |
|------------------------------|-----------------|:------:|----------------------------------------|
| `home/{device}/telemetry` | dispositivo | não | leituras periódicas (Tabela 2) |
| `home/{device}/event` | dispositivo | não | mudança de estado: gás, relé, alarme |
| `home/{device}/status` | dispositivo e broker | sim | `online` ao conectar; `offline` publicado pelo broker (*Last Will*) |
| `home/{device}/cmd` | middleware | não | comando com `cmd_id` e prazo de validade |
| `home/{device}/state` | atuador | sim | estado atual e último `cmd_id` executado |

Fonte: Elaborado pelo autor (2026).

Todos os tópicos usam QoS 1, "pelo menos uma vez": a mensagem se repete até o
broker confirmar e pode chegar duplicada. A apostila oferece duas saídas,
deduplicar na ingestão ou usar QoS 2, mais pesado
[@ufjf2026cap2, p. 11, 23]. Para as leituras, deduplicar basta (Seção 7.3).
Para comandos críticos a apostila recomenda QoS 2 [@ufjf2026cap5, p. 16–17];
aqui o mesmo efeito vem do `cmd_id`. O atuador ignora um comando que já
executou e confirma o estado em `state`, então repetir a mensagem nunca
repete a ação.

Outros recursos do MQTT completam o desenho [@ufjf2026cap2, p. 11]. Ao
conectar, cada dispositivo registra uma mensagem de despedida (*Last Will*)
que o broker publica sozinho se a conexão cair; assim um dispositivo mudo
aparece em segundos. O tópico `state` é retido, e quem se conecta recebe na
hora o último estado de cada atuador. Já os comandos não são retidos e levam
prazo de validade (*message expiry* do MQTT 5), para que um relé que volta
depois de horas não execute uma ordem velha.

A segurança vem em camadas: TLS na porta 8883, uma credencial por
dispositivo e uma lista de controle de acesso que só deixa cada um publicar
nos próprios tópicos. A credencial única é a boa prática que a apostila
aponta [@ufjf2026cap5, p. 15–16]: um relé invadido não consegue se passar
pelo sensor de gás. Como os tópicos usam o identificador
(`home/relay_pool_01/cmd`), um dispositivo novo só precisa de cadastro,
usuário no broker e uma linha na lista. Uma mensagem do medidor fica assim:

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

O middleware é um serviço em Python (FastAPI). A ingestão assina `home/#` e
valida cada mensagem (esquema, faixa, coerência e relógio); o que é inválido
é rejeitado e guardado com o motivo (Seção 7.4). Em seguida o middleware
atualiza o último estado conhecido do dispositivo, o gêmeo digital do
Capítulo 3, e só então avalia as regras ligadas a ele
[@ufjf2026cap5, p. 6–7].

O motor de regras roda a cada leitura e também a cada 10 s, para as regras
que dependem de tempo ("há 5 minutos"). Ele não lê nem escreve nada: recebe
fatos e devolve decisões, o que permite testá-lo sem broker nem banco. O
despacho publica cada comando, espera em `state` a confirmação com o mesmo
`cmd_id` e tenta até três vezes antes de abrir um alerta de atuador sem
resposta. As notificações são gravadas no banco antes do envio (padrão
*outbox*) e, se a internet cair, saem quando ela voltar. Por fim, uma API
REST atende consultas e comandos manuais, e um WebSocket empurra leituras e
alertas ao painel, a combinação que a apostila indica para painéis que se
atualizam sozinhos [@ufjf2026cap5, p. 12–14]. A Figura 2 mostra o caminho
de uma leitura até uma ação, com a regra de sobra solar (R1).

![Sequência de uma leitura até o acionamento da bomba da piscina por sobra solar.](fig02-sequencia-excedente.png){width=100%}

Fonte: Elaborado pelo autor (2026).

## Banco de dados

O banco é o PostgreSQL com a extensão TimescaleDB. Quase toda consulta do
sistema é temporal ("consumo das últimas 24 h"), o padrão de escrever muito e
ler por janelas de tempo para o qual os bancos de séries temporais são feitos
[@ufjf2026cap4, p. 9–10]. As leituras ficam em tabelas particionadas por
tempo (*hypertables*), comprimidas após uma semana e resumidas
automaticamente por minuto, hora e dia (*continuous aggregates*); o
histórico lê os resumos. Cadastro, alertas e comandos ficam no mesmo banco.

A retenção segue a divisão em dados quentes, mornos e frios
[@ufjf2026cap4, p. 14–19]. A leitura que acabou de chegar é quente e dispara
as regras. As leituras brutas de energia, cargas e ar ficam 90 dias, e os
resumos por minuto, dois anos; são os dados mornos do painel e do Grafana. Os
resumos por hora e por dia ficam sem prazo, para comparar um ano com outro.
Eventos, alertas e comandos também nunca são apagados, porque o dado bruto
deve ser preservado justamente quando há um evento a explicar
[@ufjf2026cap4, p. 38–39]. As mensagens rejeitadas ficam 30 dias.

## Aplicações e implantação

O painel web (Capítulo 6) é a interface dos moradores e funciona no celular
como aplicativo (PWA). O Grafana mostra o histórico ao instalador, com um
usuário só de leitura no banco. As notificações *push* levam os alertas ao
celular com o painel fechado, e os críticos de segurança vão também ao
contato de emergência.

Todos os serviços do *hub* são contêineres iniciados juntos por um arquivo
*compose*, e o *hub* fica num nobreak para continuar registrando durante uma
falta de energia. Sem internet, a casa mede, grava, executa as regras e
mostra o painel na rede local; só as notificações esperam na fila, e o
acesso de fora de casa, feito por VPN, fica indisponível. Manter os dados em
casa também protege a privacidade: o consumo revela a rotina da família e é
dado pessoal [@brasil2018lgpd].
