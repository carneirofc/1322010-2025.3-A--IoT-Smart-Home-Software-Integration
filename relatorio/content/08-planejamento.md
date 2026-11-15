# Planejamento do software

Este capítulo organiza a especificação dos capítulos anteriores como plano de
desenvolvimento: requisitos funcionais, decisões de tecnologia e a
rastreabilidade entre o problema e a solução.

## Requisitos funcionais

: Requisitos funcionais.

| ID | Requisito | Regras | Tela |
|------|------------------------------------------------------------------|--------------|------------------|
| RF1 | Mostrar consumo, geração e troca com a rede quase em tempo real (atraso de até 10 s) | — | Visão geral |
| RF2 | Calcular o custo do dia e do mês com a tarifa e a bandeira configuradas, e projetar a conta | R4 | Visão geral |
| RF3 | Ligar cargas adiáveis com a sobra solar e garantir o compromisso diário de cada uma | R1, R2 | Cargas |
| RF4 | Desligar cargas de menor prioridade antes que o disjuntor geral desarme, e religá-las depois | R3 | Cargas |
| RF5 | Permitir o controle manual de cada carga, com prioridade sobre a automação até o fim do dia | árbitro (Figura 3) | Cargas |
| RF6 | Detectar falha e queda de produção do sistema solar | R5 | Alertas |
| RF7 | Orientar o uso do ar-condicionado, sem controlá-lo | R6, R7 | Segurança e saúde, Alertas |
| RF8 | Ao detectar gás, acionar o alarme da casa, avisar todos os moradores e o contato de emergência, e suspender acionamentos | R8 | Segurança e saúde, Alertas |
| RF9 | Acompanhar o CO~2~ e avisar quando o ar precisa ser renovado | R9 | Segurança e saúde |
| RF10 | Acompanhar a saúde dos dispositivos e a qualidade do fornecimento de energia | R10 a R12 | Segurança e saúde |
| RF11 | Gerir o ciclo de vida dos alertas: abrir, notificar, repetir, reconhecer e encerrar | todas | Alertas |
| RF12 | Guardar o histórico com retenção definida e oferecer análise detalhada ao instalador | — | Grafana |

Fonte: Elaborado pelo autor (2026).

Os requisitos não funcionais estão na Tabela 13 (Seção 7.1).

## Decisões de tecnologia

: Decisões de tecnologia e alternativas consideradas.

| Decisão | Escolha | Alternativas | Motivo |
|------------------------|----------------------------|------------------------|------------------------------------------------|
| Protocolo | MQTT | HTTP com consulta periódica; CoAP | Publicar/assinar desacopla dispositivos e aplicação; QoS, mensagem retida e LWT resolvem entrega, estado e detecção de queda; o HTTP pesa mais por mensagem e o CoAP visa redes restritas que a casa não tem [@oasis2019mqtt5; @ufjf2026cap2, p. 10–13] |
| Onde roda | *Hub* local na casa (névoa) | Nuvem | Funciona sem internet (RNF1), responde mais rápido e mantém os dados na casa (RNF6) [@ufjf2026cap1, p. 6] |
| Middleware | Python com FastAPI | Node-RED | Regras em código podem ser testadas e versionadas; o Node-RED, usado na apostila para organizar o fluxo entre broker e banco [@ufjf2026cap2, p. 20–22], é bom para protótipos, mas regras com tempo e prioridade ficam difíceis de testar |
| Banco de dados | PostgreSQL + TimescaleDB | InfluxDB; SQLite | Séries temporais e dados relacionais (alertas, comandos, cadastro) no mesmo banco, com SQL, retenção, compressão e resumos automáticos [@ufjf2026cap4, p. 9–10] |
| Interface | Painel web responsivo (PWA), atualizado por WebSocket | Aplicativo nativo; painel que consulta a cada X segundos | Uma base de código para celular e computador, sem loja de aplicativos; o servidor empurra a leitura nova [@ufjf2026cap5, p. 12–14] |
| Histórico | Grafana | Gráficos no painel | O painel mostra o essencial; análises detalhadas ficam com o Grafana, já pronto para séries temporais |
| Implantação | Contêineres com *compose* | Instalação direta | Serviços isolados, reinício automático (RNF7), a mesma configuração no *hub* e no ambiente de testes |

Fonte: Elaborado pelo autor (2026).

## Rastreabilidade

A Tabela 18 liga cada problema do Capítulo 2 aos requisitos, às regras, às
telas e às falhas tratadas no Capítulo 7.

: Rastreabilidade do problema à solução.

| Problema (Seção 2.2) | Requisitos | Regras | Telas | Falhas tratadas (Tabela 14) |
|------------------------------|------------|----------------|-------------------------|----------------------------------------|
| 1. Não há visibilidade | RF1, RF7, RF12 | R6, R7 | Visão geral | dados nulos, corrompidos, incoerentes e duplicados |
| 2. Sobra solar mal aproveitada | RF3, RF4, RF5 | R1 a R3 | Cargas | atuador sem resposta, *hub* desligado com carga ligada |
| 3. Falha solar despercebida | RF6, RF10 | R5, R10 | Alertas | sensor offline, falta de energia |
| 4. Conta surpresa | RF2 | R4 | Visão geral | contador de energia que regride |
| 5. Riscos não chegam a quem está fora | RF8 a RF11 | R8 a R12 | Segurança e saúde, Alertas | perda de internet, Wi-Fi ou broker |

Fonte: Elaborado pelo autor (2026).
