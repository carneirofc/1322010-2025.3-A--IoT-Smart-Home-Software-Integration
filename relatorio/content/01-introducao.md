# Introdução

Este documento atende à atividade prática do Capítulo 5, que pede o projeto da
camada de software de uma solução de Internet das Coisas (IoT): requisitos,
fluxo de dados do sensor até a aplicação, regras de negócio automáticas,
protótipo das telas e tratamento de falhas [@ufjf2026atividade]. O tema
escolhido é o Tema 3, automação residencial e eficiência energética. O foco é
o software; a montagem do hardware não faz parte do trabalho.

A integração de software é o último elo da cadeia de valor estudada na
disciplina: fenômeno físico, sensoriamento, coleta, pré-processamento,
armazenamento, integração e, por fim, inteligência acionável
[@ufjf2026cap5, p. 3]. Por isso o projeto se apoia no conteúdo das cinco
unidades: os sensores e as características dos seus dados [@ufjf2026cap1],
os métodos e protocolos de coleta [@ufjf2026cap2], a qualidade e a limpeza
dos dados [@ufjf2026cap3], o armazenamento de séries temporais
[@ufjf2026cap4] e os padrões de integração com o software [@ufjf2026cap5].

O sistema proposto, chamado aqui de **Casa Monitorada**, atende uma casa com
geração solar fotovoltaica conectada à rede. Ele cobre três domínios:

- **Energia:** quanto a casa consome, quanto o telhado gera, quanto é trocado
  com a rede e quanto isso custa em reais;
- **Controle de cargas:** ligar cargas adiáveis quando há sobra de energia
  solar e desligá-las quando o disjuntor geral está perto do limite;
- **Segurança e saúde da casa:** detecção de gás e de CO~2~ com alarme
  sonoro e luminoso, e qualidade do fornecimento de energia.

Os Capítulos 2 a 7 seguem a ordem dos itens da Parte A do enunciado. O
Capítulo 2 descreve o problema e os usuários; o Capítulo 3, o dicionário de
dados dos sensores; o Capítulo 4, a arquitetura de integração; o Capítulo 5,
as regras de negócio; o Capítulo 6, as telas; e o Capítulo 7, os riscos e a
resiliência. O Capítulo 8 organiza a especificação como plano de
desenvolvimento (requisitos, decisões de tecnologia e rastreabilidade). O Capítulo 9 descreve o protótipo da Parte B, e o
Capítulo 10 resume as limitações e os próximos passos.

As fontes deste documento, das telas e de todos os diagramas estão no
repositório público
<https://github.com/carneirofc/1322010-2025.3-A--IoT-Smart-Home-Software-Integration>.
