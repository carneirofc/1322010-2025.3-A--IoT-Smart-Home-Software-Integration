# Planejamento do software

Este capítulo organiza a especificação como plano de desenvolvimento.

## Requisitos funcionais

Os doze requisitos funcionais, com as regras e telas que os atendem, são:

- RF1: mostrar consumo, geração e troca com a rede com atraso de até 10 s
  (Visão geral).
- RF2: calcular o custo do dia e do mês e projetar a conta (R4, Visão
  geral).
- RF3: ligar cargas adiáveis com a sobra solar e cumprir o compromisso do
  dia (R1 e R2, Cargas).
- RF4: desligar cargas antes que o disjuntor geral desarme e religá-las
  depois (R3, Cargas).
- RF5: permitir o controle manual de cada carga, acima da automação até o
  fim do dia (árbitro, Cargas).
- RF6: detectar falha e queda de geração do sistema solar (R5, Alertas).
- RF7: orientar o uso do ar-condicionado sem controlá-lo (R6 e R7).
- RF8: diante de gás, acionar o alarme, avisar moradores e contato de
  emergência e suspender acionamentos (R8).
- RF9: acompanhar o CO~2~ e avisar quando renovar o ar (R9).
- RF10: acompanhar a saúde dos dispositivos e a tensão da rede (R10 a R12).
- RF11: gerir o ciclo de vida dos alertas: abrir, avisar, repetir,
  reconhecer e encerrar (Alertas).
- RF12: guardar o histórico com retenção definida e oferecer análise ao
  instalador (Grafana).

Os não funcionais estão na Seção 7.1.

## Decisões de tecnologia

O protocolo é o MQTT, e não HTTP com consulta periódica nem CoAP. O
publicador-assinante desacopla dispositivos e aplicações, e QoS, mensagem
retida e *Last Will* resolvem entrega, estado e detecção de queda; o HTTP
pesa mais por mensagem, e o CoAP foi feito para redes restritas que a casa
não tem [@oasis2019mqtt5; @ufjf2026cap2, p. 10–13].

O software roda num *hub* local, e não na nuvem, para funcionar sem internet
(RNF1), responder mais rápido e manter os dados em casa (RNF6)
[@ufjf2026cap1, p. 6]. O middleware é escrito em Python com FastAPI. O
Node-RED, que a apostila usa para ligar broker e banco
[@ufjf2026cap2, p. 20–22], serve bem a protótipos, mas regras com tempo e
prioridade ficam difíceis de testar e versionar fora do código.

O banco é PostgreSQL com TimescaleDB, em vez de InfluxDB ou SQLite, porque
guarda as séries temporais e os dados relacionais (alertas, comandos,
cadastro) no mesmo lugar, com SQL, retenção, compressão e resumos
automáticos [@ufjf2026cap4, p. 9–10]. A interface é um painel web (PWA)
atualizado por WebSocket, uma só base de código para celular e computador,
sem loja de aplicativos [@ufjf2026cap5, p. 12–14]. O Grafana cuida do
histórico detalhado, para o painel mostrar só o essencial. Tudo roda em
contêineres com *compose*, que isolam os serviços, os reiniciam sozinhos
(RNF7) e repetem a mesma configuração no *hub* e no ambiente de testes.

## Rastreabilidade

A Tabela 6 liga cada problema da Seção 2.2 aos requisitos, às regras, às
telas e às falhas tratadas no Capítulo 7.

: Rastreabilidade do problema à solução.

| Problema (Seção 2.2) | Requisitos | Regras | Telas | Falhas tratadas (Tabela 5) |
|------------------------------|------------|----------------|-------------------------|----------------------------------------|
| 1. Não há visibilidade | RF1, RF7, RF12 | R6, R7 | Visão geral | dados nulos, corrompidos, incoerentes e duplicados |
| 2. Sobra solar desperdiçada | RF3, RF4, RF5 | R1 a R3 | Cargas | atuador sem resposta, *hub* desligado com carga ligada |
| 3. Falha solar despercebida | RF6, RF10 | R5, R10 | Alertas | sensor offline, falta de energia |
| 4. Conta surpresa | RF2 | R4 | Visão geral | contador de energia que regride |
| 5. Riscos não chegam a quem está fora | RF8 a RF11 | R8 a R12 | Segurança e saúde, Alertas | perda de internet, Wi-Fi ou broker |

Fonte: Elaborado pelo autor (2026).
