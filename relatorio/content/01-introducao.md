# Introdução

Este documento atende à atividade prática do Capítulo 5, que solicita o
projeto da camada de software de uma solução de Internet das Coisas (IoT),
abrangendo o fluxo de dados do sensor à aplicação, as regras de negócio
automáticas, o protótipo das telas e o tratamento de falhas
[@ufjf2026atividade]. Adotou-se o Tema 3, automação residencial e eficiência
energética. O foco do trabalho é o software; o hardware é descrito apenas no
nível necessário para caracterizar os dados.

A integração com o software constitui a última etapa da cadeia de valor
estudada na disciplina, que parte do fenômeno físico e termina na informação
capaz de orientar uma ação [@ufjf2026cap5, p. 3]. Por esse motivo, o projeto
fundamenta-se no conteúdo das cinco unidades: sensores [@ufjf2026cap1],
coleta e protocolos [@ufjf2026cap2], qualidade dos dados [@ufjf2026cap3],
armazenamento de séries temporais [@ufjf2026cap4] e integração com o
software [@ufjf2026cap5].

O sistema proposto, denominado Casa Monitorada, destina-se a uma residência
com geração solar fotovoltaica conectada à rede. Ele apresenta o consumo, a
geração e o custo da energia; aciona cargas adiáveis quando há excedente de
geração e as desliga quando a corrente se aproxima do limite do disjuntor
geral; e monitora a segurança e a saúde do ambiente, com detecção de gás e
de CO~2~ integrada ao alarme da casa e acompanhamento da tensão de
fornecimento.

Os Capítulos 2 a 7 seguem a ordem dos itens da Parte A do enunciado:
problema e usuários, dicionário de dados, arquitetura, regras, interface e
riscos. O Capítulo 6 apresenta também o protótipo visual da Parte B. O
Capítulo 8 reúne os requisitos, as decisões de tecnologia e a
rastreabilidade, e o Capítulo 9 apresenta as considerações finais. Os
arquivos-fonte do documento, das telas e dos diagramas estão disponíveis em
<https://github.com/carneirofc/1322010-2025.3-A--IoT-Smart-Home-Software-Integration>.
