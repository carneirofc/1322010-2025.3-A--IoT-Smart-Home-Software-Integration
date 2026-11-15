# Interface e protótipo

## Princípios

A interface é um painel web responsivo que no celular funciona como
aplicativo (PWA). A primeira tela responde às duas perguntas mais comuns do
morador, "quanto estou gastando?" e "está tudo bem em casa?". Toda ação
automática tem explicação: cada carga mostra quem a ligou ou desligou por
último, uma regra ou um morador, quando, e se o relé confirmou. O morador
manda, e qualquer carga pode passar ao modo manual; a tela diz até quando a
automação fica de fora.

Cada cor tem um só significado. Ciano é a energia solar e rosa é a rede;
verde é normal, âmbar é atenção, laranja é aviso e vermelho é crítico. A cor
de estado sempre vem com a palavra, para a tela continuar legível impressa ou
para quem não distingue cores.

O painel trata o dado quente e o morno como a apostila descreve: o estado
atual chega à tela assim que é medido, e o histórico recente alimenta
gráficos que abrem em poucos segundos [@ufjf2026cap4, p. 14–15]. As leituras
novas chegam por WebSocket, sem a página precisar perguntar
[@ufjf2026cap5, p. 13–14].

## O protótipo

O enunciado aceita um protótipo visual com dados simulados
[@ufjf2026atividade]. O deste trabalho é uma aplicação Next.js (React e
TypeScript, com Tailwind CSS), na pasta `prototype/` do repositório. Ela usa
os componentes da biblioteca `@carneirofc/ui`, do próprio autor, e herda dela
a identidade visual: painéis com borda em gradiente, a fonte Sora nos textos
e IBM Plex Mono nas leituras, sobre um fundo claro que também funciona
impresso. Cada tela destaca num painel principal a pergunta que responde.

Os dados vêm de um cenário simulado, tipado e reunido num único módulo, que
reproduz a casa num dia útil às 14:45: leituras, cargas, dispositivos,
alertas e as curvas das últimas 24 horas. As telas não têm números fixos no
código; tudo é calculado a partir do cenário, e por isso os números batem
entre as telas e com as regras do Capítulo 5. Os tipos do cenário seguem o
dicionário de dados do Capítulo 3. As abas navegam, o filtro de alertas
funciona e o botão "Reconhecer" muda o alerta e o contador da aba, tudo no
próprio navegador. As figuras deste capítulo são capturas da aplicação numa
janela de 1 024 px de largura.

## Navegação

O painel tem quatro abas fixas (Figura 4). A notificação *push* abre direto
o detalhe do alerta, e o Grafana fica à parte, para o instalador e para
análises de histórico.

![Navegação entre as telas do painel.](fig04-navegacao.png){width=80%}

Fonte: Elaborado pelo autor (2026).

## Visão geral

A tela inicial (Figura 5) diz, antes de tudo, se a casa está comprando ou
vendendo energia. No exemplo, o telhado gera 2,8 kW, a casa consome 2,2 kW e
sobram 0,6 kW para a rede. Ao lado ficam o custo de hoje e do mês, com a
projeção da conta contra o orçamento (R4), e abaixo o gráfico das últimas 24
horas, com geração, consumo e troca com a rede. Um resumo das cargas e dos
alertas abertos leva às outras abas. A lavadora tem um ciclo armado, mas
espera, porque precisa de 1,2 kW de sobra: 1 000 W da carga e 200 W de folga
(R1).

![Tela Visão geral do protótipo.](fig05-tela-visao-geral.png){width=100%}

Fonte: Elaborado pelo autor (2026).

## Cargas

Na tela de cargas (Figura 6), cada carga controlada mostra estado e
potência, quem deu o último comando e quando, o compromisso do dia (as horas
da bomba, o prazo da lavadora) e os botões. Ao lado, a corrente na entrada
da casa aparece contra o disjuntor geral, mostrando se a proteção contra
sobrecarga (R3) está agindo. A iluminação externa está em modo manual até 23:59 porque um morador
a desligou de manhã (Seção 5.5). O histórico mostra cada comando com a origem
e o tempo de confirmação do relé.

![Tela Cargas do protótipo.](fig06-tela-cargas.png){width=100%}

Fonte: Elaborado pelo autor (2026).

## Segurança e saúde

A Figura 7 reúne o que não é energia do dia a dia: gás e alarme da casa, que
pode ser testado pela tela, o ar do quarto, o ar-condicionado, a tensão de
cada fase e a saúde dos dispositivos. No exemplo, o CO~2~ do quarto passou de
1 000 ppm há 20 minutos (R9) e o ar-condicionado está ligado com a casa vazia
(R7). O painel de dispositivos mostra um relé atrasado (Figura 9) e conta as
mensagens rejeitadas e as duplicatas descartadas, o que ajuda o instalador a
achar problemas de comunicação.

![Tela Segurança e saúde do protótipo.](fig07-tela-seguranca.png){width=100%}

Fonte: Elaborado pelo autor (2026).

## Alertas

A tela de alertas (Figura 8) separa os abertos dos encerrados e mostra
severidade, regra, descrição, estado e a ação possível. Reconhecer um alerta
crítico para a repetição do *push*, mas ele só se encerra quando a condição
deixa de valer. A detecção de gás de dois dias antes aparece encerrada, com
o tempo que o alarme levou para tocar e quem reconheceu.

![Tela Alertas do protótipo.](fig08-tela-alertas.png){width=100%}

Fonte: Elaborado pelo autor (2026).

## Do protótipo visual ao funcional

Os diagramas do documento (arquitetura, sequência, arbitragem, navegação,
estados e validação) estão em Mermaid, guardados como texto e convertidos em
figura na geração do PDF. O protótipo funcional seguiria o caminho da
Figura 1 sem hardware: um simulador publicaria as mensagens dos dispositivos
da Tabela 1, inclusive com as falhas da Tabela 5; o middleware validaria,
gravaria e aplicaria as regras; e as mesmas telas trocariam o módulo
simulado pela API REST e pelo WebSocket (Seção 4.4).
