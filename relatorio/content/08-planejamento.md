# Planejamento do software

Este capítulo organiza a especificação dos capítulos anteriores na forma de
um plano de desenvolvimento.

## Requisitos funcionais

Os requisitos funcionais, com as regras e telas que os atendem, são:

- RF1: apresentar consumo, geração e troca com a rede com atraso máximo de
  15 s (Visão geral).
- RF2: calcular o custo do dia e do mês e projetar a fatura (R4, Visão
  geral).
- RF3: acionar cargas adiáveis com o excedente solar e cumprir o compromisso
  diário de cada uma (R1 e R2, Cargas).
- RF4: desligar cargas antes da atuação do disjuntor geral e religá-las em
  seguida (R3, Cargas).
- RF5: permitir o controle manual de cada carga, com prioridade sobre a
  automação até o fim do dia, exceto pela R3 e pela R8 (árbitro, Cargas).
- RF6: detectar falhas e quedas de geração do sistema solar (R5, Alertas).
- RF7: orientar o uso do ar-condicionado, sem controlá-lo (R6 e R7,
  Segurança e saúde).
- RF8: em caso de detecção de gás, acionar o alarme, notificar moradores e
  contato de emergência e suspender acionamentos (R8, Segurança e saúde,
  Alertas).
- RF9: monitorar a concentração de CO~2~ e orientar a renovação do ar (R9,
  Segurança e saúde).
- RF10: monitorar a saúde dos dispositivos e a tensão de fornecimento (R10 a
  R12, Segurança e saúde).
- RF11: gerir o ciclo de vida dos alertas: abertura, notificação, repetição,
  reconhecimento e encerramento (Alertas).
- RF12: armazenar o histórico com retenção definida e disponibilizar análise
  ao instalador (Grafana).

Os requisitos não funcionais estão na Seção 7.1.

## Decisões de tecnologia

Adotou-se o protocolo MQTT em lugar do HTTP com consultas periódicas e do
CoAP. O padrão publicador-assinante desacopla dispositivos e aplicações, e os
recursos de QoS, mensagem retida e *Last Will* atendem à entrega, à
manutenção de estado e à detecção de desconexão; o HTTP impõe maior custo
por mensagem, e o CoAP destina-se a redes restritas, condição que não se
aplica à residência [@oasis2019mqtt5; @ufjf2026cap2, p. 10–13].

O software é executado em um *hub* local, e não em nuvem, para garantir a
operação sem internet (RNF1), reduzir o tempo de resposta e manter os dados
na residência (RNF6) [@ufjf2026cap1, p. 6]. O middleware é desenvolvido em
Python com FastAPI. O Node-RED, utilizado na apostila para integrar broker e
banco de dados [@ufjf2026cap2, p. 20–22], é adequado a protótipos, mas
dificulta o teste e o versionamento de regras que envolvem tempo e
prioridade.

O banco de dados é o PostgreSQL com TimescaleDB, em lugar do InfluxDB ou do
SQLite, por reunir séries temporais e dados relacionais (alertas, comandos e
cadastro) em um único banco, com SQL, retenção, compressão e agregação
automáticas [@ufjf2026cap4, p. 9–10]. A interface é um painel web (PWA)
atualizado por WebSocket, com uma única base de código para celular e
computador, sem dependência de lojas de aplicativos
[@ufjf2026cap5, p. 12–14]. O Grafana atende à análise detalhada do
histórico, o que permite ao painel concentrar-se nas informações essenciais.
A implantação em contêineres com *compose* isola os serviços, permite o
reinício automático (RNF7) e reproduz a mesma configuração no *hub* e no
ambiente de testes.

## Rastreabilidade

A Tabela 7 relaciona cada problema da Seção 2.2 aos requisitos, às regras,
às telas e às falhas tratadas no Capítulo 7.

: Rastreabilidade do problema à solução.

| Problema (Seção 2.2) | Requisitos | Regras | Telas | Falhas tratadas (Tabela 6) |
|------------------------------|------------|----------------|-------------------------|----------------------------------------|
| 1. Ausência de visibilidade | RF1, RF7, RF12 | R6, R7 | Visão geral, Segurança e saúde | dados nulos, corrompidos, incoerentes e duplicados |
| 2. Aproveitamento insuficiente da geração | RF3, RF4, RF5 | R1 a R3 | Cargas | atuador sem resposta, *hub* desligado com carga ligada |
| 3. Falhas solares não detectadas | RF6, RF10 | R5, R10 | Alertas | sensor offline, falta de energia |
| 4. Imprevisibilidade da fatura | RF2 | R4 | Visão geral | contador de energia decrescente |
| 5. Riscos não comunicados | RF8 a RF11 | R8 a R12 | Segurança e saúde, Alertas | perda de internet, Wi-Fi ou broker |

Fonte: Elaborado pelo autor (2026).
