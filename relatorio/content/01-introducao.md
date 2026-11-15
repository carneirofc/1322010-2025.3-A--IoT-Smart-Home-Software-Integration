# Introdução

Este documento responde à atividade prática do Capítulo 5: projetar a camada
de software de uma solução de Internet das Coisas (IoT), do sensor até a
aplicação, com regras automáticas, telas e tratamento de falhas
[@ufjf2026atividade]. O tema escolhido é o 3, automação residencial e
eficiência energética. O foco é o software; o hardware entra só no nível
necessário para entender os dados.

A integração com o software fecha a cadeia de valor vista na disciplina, que
vai do fenômeno físico à informação que leva a uma ação [@ufjf2026cap5, p. 3].
Por isso o projeto usa o conteúdo das cinco unidades: sensores
[@ufjf2026cap1], coleta e protocolos [@ufjf2026cap2], qualidade dos dados
[@ufjf2026cap3], armazenamento de séries temporais [@ufjf2026cap4] e
integração [@ufjf2026cap5].

O sistema, chamado aqui de Casa Monitorada, atende uma casa com energia solar
conectada à rede. Ele mostra quanto a casa consome, gera e gasta; liga cargas
adiáveis quando sobra energia solar e as desliga quando o disjuntor geral se
aproxima do limite; e cuida da segurança e da saúde da casa, com detecção de
gás e de CO~2~ ligada ao alarme e acompanhamento da tensão da rede.

Os Capítulos 2 a 7 seguem a ordem da Parte A do enunciado: problema e
usuários, dicionário de dados, arquitetura, regras, telas e riscos. O
Capítulo 6 também descreve o protótipo visual da Parte B. O Capítulo 8 reúne
requisitos, decisões de tecnologia e rastreabilidade, e o Capítulo 9 fecha
com limitações e próximos passos. Os fontes do documento, das telas e dos
diagramas estão em
<https://github.com/carneirofc/1322010-2025.3-A--IoT-Smart-Home-Software-Integration>.
