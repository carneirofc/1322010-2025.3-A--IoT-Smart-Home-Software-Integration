# Interface e protótipo

## Princípios

A interface é um painel web responsivo que, no celular, funciona como
aplicativo instalável (PWA). A tela inicial responde às duas perguntas mais
frequentes do morador: quanto a residência está gastando e se há alguma
situação de risco. Toda ação automática é acompanhada de explicação: cada
carga informa a origem do último comando (uma regra ou um morador), o
horário e a confirmação do relé. O morador mantém o controle, pois qualquer
carga pode ser colocada em modo manual, e a tela indica até quando a
automação permanece suspensa.

Cada cor possui um único significado. O ciano representa a geração solar e
o rosa, a rede; verde indica estado normal, âmbar indica atenção, laranja
indica aviso e vermelho indica situação crítica. A cor de estado é sempre
acompanhada do texto correspondente, de modo que a informação permaneça
legível em impressão monocromática e para usuários com deficiência na
percepção de cores.

O painel trata os dados quentes e mornos conforme descrito na apostila: o
estado atual é exibido assim que é medido, e o histórico recente alimenta
gráficos carregados em poucos segundos [@ufjf2026cap4, p. 14–15]. As novas
leituras chegam ao painel por WebSocket, sem necessidade de consultas
periódicas [@ufjf2026cap5, p. 13–14].

## O protótipo

O enunciado admite um protótipo visual com dados simulados
[@ufjf2026atividade]. O protótipo deste trabalho é uma aplicação Next.js
(React e TypeScript, com Tailwind CSS), disponível na pasta `prototype/` do
repositório. A aplicação utiliza os componentes da biblioteca
`@carneirofc/ui`, desenvolvida pelo autor e disponível em
<https://github.com/carneirofc/deedlit.dev.ui> (versão 1.2.0), e deriva dela
a identidade visual.

Os dados provêm de um cenário simulado, tipado e reunido em um único módulo,
que reproduz a residência em uma terça-feira, 17 de novembro de 2026, às
14:45, com leituras, cargas,
dispositivos, alertas e as curvas das últimas 24 horas. As telas não contêm
valores fixos no código; todos são lidos ou calculados a partir do cenário,
como a projeção da fatura e os totais do dia, o que
garante a coerência entre as telas e com as regras do Capítulo 5. Os tipos
do cenário seguem o dicionário de dados do Capítulo 3. A navegação entre
abas, o filtro de alertas e o reconhecimento de alertas, com atualização do
contador da aba, funcionam no próprio navegador. As figuras deste capítulo
são capturas da aplicação em uma janela de 1 024 px de largura.

## Navegação

O painel possui quatro abas fixas (Figura 4). A notificação *push* conduz
diretamente ao detalhe do alerta, e o Grafana permanece à parte, destinado
ao instalador e à análise do histórico.

![Navegação entre as telas do painel.](fig04-navegacao.png){width=80%}

Fonte: Elaborado pelo autor (2026).

## Visão geral

A tela inicial (Figura 5) informa, em primeiro lugar, se a residência está
importando ou injetando energia. No cenário, a geração é de 2,8 kW, o
consumo é de 2,2 kW e o excedente de 0,6 kW é injetado na rede. A tela
apresenta também o custo do dia e do mês, com a projeção da fatura em
relação ao orçamento (R4), e o gráfico das últimas 24 horas, com geração,
consumo e troca com a rede. Um resumo das cargas e dos alertas abertos dá
acesso às demais abas. A lavadora possui um ciclo programado, mas aguarda um
excedente de 1,2 kW, correspondente aos 1 000 W da carga e à margem de
200 W da R1.

![Tela Visão geral do protótipo.](fig05-tela-visao-geral.png){width=100%}

Fonte: Elaborado pelo autor (2026).

## Cargas

Na tela de cargas (Figura 6), cada carga controlada apresenta o estado e a
potência, a origem e o horário do último comando, o compromisso diário (o
tempo de funcionamento da bomba e o prazo da lavadora) e os comandos
disponíveis. A corrente de entrada é exibida em relação à capacidade do
disjuntor geral, indicando se a proteção contra sobrecarga (R3) está
atuando. A iluminação externa encontra-se em modo manual até 23:59, pois foi
desligada por um morador pela manhã (Seção 5.5). O histórico apresenta cada
comando com a origem e o tempo de confirmação do relé, incluindo o primeiro
ciclo da lavadora, ligado pela rede às 08:00 para cumprir um prazo da manhã,
desligado pela R3 quando o chuveiro foi ligado e religado depois.

![Tela Cargas do protótipo.](fig06-tela-cargas.png){width=100%}

Fonte: Elaborado pelo autor (2026).

## Segurança e saúde

A Figura 7 reúne as informações de segurança e saúde: detecção de gás e
estado do alarme da casa, que pode ser testado pela tela; qualidade do ar do
quarto; funcionamento do ar-condicionado; tensão de cada fase; e saúde dos
dispositivos. No cenário, a concentração de CO~2~ no quarto está acima de
1 000 ppm há 20 minutos (R9), e o ar-condicionado mantém o quarto a 21 °C,
abaixo da faixa recomendada (R6). O painel de dispositivos indica um relé em estado
atrasado (Figura 9) e apresenta a contagem de mensagens rejeitadas e de
duplicatas descartadas, informação útil ao instalador para o diagnóstico da
comunicação.

![Tela Segurança e saúde do protótipo.](fig07-tela-seguranca.png){width=100%}

Fonte: Elaborado pelo autor (2026).

## Alertas

A tela de alertas (Figura 8) separa os alertas abertos dos encerrados e
apresenta severidade, regra, descrição, estado e ação disponível. O
reconhecimento de um alerta crítico interrompe a repetição da notificação,
mas o alerta só é encerrado quando a condição deixa de ser verdadeira. A
detecção de gás ocorrida dois dias antes aparece encerrada, com o tempo de
acionamento do alarme e a identificação do morador que a reconheceu.

![Tela Alertas do protótipo.](fig08-tela-alertas.png){width=100%}

Fonte: Elaborado pelo autor (2026).

## Do protótipo visual ao funcional

Os diagramas deste documento (arquitetura, sequência, arbitragem,
navegação, estados e validação) foram escritos em Mermaid e são convertidos
em figuras durante a geração do PDF. O protótipo funcional seguiria o fluxo
da Figura 1 sem hardware: um simulador publicaria as mensagens dos
dispositivos da Tabela 1, incluindo as falhas da Tabela 6; o middleware
validaria, armazenaria e aplicaria as regras; e as mesmas telas substituiriam
o módulo simulado pela API REST e pelo canal WebSocket (Seção 4.4).
