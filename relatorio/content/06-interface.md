# Prototipagem da interface

## Princípios

A interface é um painel web responsivo que também funciona como aplicativo no
celular (PWA). Ela segue quatro princípios:

- **O que importa primeiro:** a primeira tela responde às perguntas mais
  comuns do morador: "quanto estou gastando?" e "está tudo bem em casa?".
- **Toda ação automática tem explicação:** cada carga mostra quem a ligou ou
  desligou por último (uma regra ou um morador), quando, e se o relé
  confirmou.
- **Cor só para estado:** verde para normal, amarelo para atenção, laranja
  para aviso e vermelho para crítico. As mesmas cores valem nos alertas e nos
  cartões.
- **O morador manda:** qualquer carga pode ser assumida manualmente; a tela
  diz até quando a automação fica afastada.

O painel segue o papel que a apostila atribui aos dados quentes e mornos: o
estado atual dispara a reação imediata e chega à tela assim que é medido,
enquanto o histórico recente alimenta gráficos que carregam em poucos
segundos [@ufjf2026cap4, p. 14–15]. As leituras novas chegam ao painel por
WebSocket, sem que a página precise perguntar [@ufjf2026cap5, p. 13–14].

As telas a seguir vêm do protótipo visual: uma aplicação Next.js, na pasta
`prototype/` do repositório, alimentada por dados simulados (*mock*) que
reproduzem um instante da casa. As abas navegam entre as telas, os filtros
de alertas funcionam e o botão "Reconhecer" muda o estado do alerta no
próprio navegador; não há comunicação com o middleware. Todas mostram a mesma casa no mesmo instante, um dia útil às 14:45, para que
os números sejam coerentes entre si e com as regras do Capítulo 5. As figuras
são capturas dessas telas em uma janela de 1 024 px de largura.

## Navegação

O painel tem quatro abas fixas (Figura 4). A notificação push leva direto ao
detalhe do alerta; o Grafana fica à parte, para o instalador e para análises
de histórico.

![Navegação entre as telas do painel.](fig04-navegacao.png){width=80%}

Fonte: Elaborado pelo autor (2026).

## Visão geral

A Figura 5 mostra a tela inicial. O fluxo de energia (solar, casa e rede)
responde se a casa está comprando ou vendendo energia agora. Os cartões de
hoje e do mês trazem o custo estimado em reais e a projeção da conta contra o
orçamento (R4). Embaixo, um resumo das cargas e dos alertas abertos leva às
outras abas.

![*Mockup* da tela Visão geral.](fig05-tela-visao-geral.png){width=100%}

Fonte: Elaborado pelo autor (2026).

No exemplo, o telhado gera 2,8 kW, a casa consome 2,2 kW (incluindo a bomba
da piscina e o ar-condicionado do quarto) e sobram 0,6 kW, injetados na rede. A lavadora tem um ciclo
armado, mas espera: ela precisa de 1,2 kW de sobra (1 000 W da carga mais
200 W de folga, R1).

## Cargas

Na tela de cargas (Figura 6), cada carga ocupa uma linha com quatro partes:
estado e potência medida; modo e origem do último comando; o compromisso do
dia (tempo mínimo da bomba, prazo da lavadora); e os botões. A faixa do topo
mostra a corrente na entrada da casa e se a proteção contra sobrecarga (R3)
está ativa. O histórico no rodapé mostra cada comando com a origem e o tempo
de confirmação do relé.

![*Mockup* da tela Cargas.](fig06-tela-cargas.png){width=100%}

Fonte: Elaborado pelo autor (2026).

A iluminação externa está em modo manual até 23:59 porque um morador a
desligou de manhã: a automação não a toca até o fim do dia (Seção 5.6). Os
botões "Voltar ao automático" e "Modo manual" alternam esse estado.

## Segurança e saúde

A Figura 7 reúne o que não é energia do dia a dia: gás, o alarme da casa,
qualidade da rede elétrica, o ar do quarto, o ar-condicionado e a saúde dos
dispositivos. O cartão do alarme mostra o modo atual e permite testá-lo. No
exemplo, o CO~2~ do quarto está acima de 1 000 ppm há 20 minutos (R9) e o
ar-condicionado do quarto está ligado fora do horário de uso (R7). O cartão de
dispositivos mostra um sensor atrasado (Figura 9) e os
contadores de mensagens rejeitadas e duplicatas descartadas, que ajudam o
instalador a perceber problemas de comunicação.

![*Mockup* da tela Segurança e saúde.](fig07-tela-seguranca.png){width=100%}

Fonte: Elaborado pelo autor (2026).

## Alertas

A lista de alertas (Figura 8) mostra severidade, regra, descrição, estado e a
ação disponível. Reconhecer um alerta crítico para a repetição do push, mas o
alerta só é encerrado quando a condição deixa de valer. No exemplo, a
detecção de gás de dois dias antes aparece encerrada, com o tempo que o
alarme da casa levou para tocar e quem reconheceu o alerta.

![*Mockup* da tela Alertas.](fig08-tela-alertas.png){width=100%}

Fonte: Elaborado pelo autor (2026).
