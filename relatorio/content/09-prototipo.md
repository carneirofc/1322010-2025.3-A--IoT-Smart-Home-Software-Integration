# Protótipo

O enunciado aceita um protótipo funcional ou visual e sugere, entre outras
ferramentas, protótipos de telas e painéis com dados simulados
[@ufjf2026atividade]. Este trabalho entrega o protótipo visual em duas
partes:

- **Telas:** uma aplicação web em Next.js (React e TypeScript, estilizada
  com Tailwind CSS e montada com os componentes da biblioteca
  `@carneirofc/ui`, incluída no repositório), na pasta `prototype/` do
  repositório, com as quatro
  telas do Capítulo 6. Os dados vêm de um cenário simulado (*mock*), tipado e
  reunido em um único módulo, que reproduz a casa às 14:45 de um dia útil:
  leituras, cargas, dispositivos, alertas e as curvas das últimas 24 h. As
  telas não têm números fixos no código; tudo é calculado a partir do
  cenário. A aplicação é exportada como site estático e pode ser aberta sem
  servidor de aplicação. As figuras do Capítulo 6 são capturas dela, geradas
  pelo script `relatorio/scripts/screens.mjs`.
- **Diagramas:** a arquitetura, a sequência de uma leitura até a ação, a
  arbitragem, a navegação, os estados dos dispositivos e a validação
  (Capítulos 4 a 7), em Mermaid, guardados como texto e convertidos em figura
  na geração deste documento.

Os tipos do cenário simulado (dispositivo, leitura, carga, alerta,
severidade) seguem o dicionário de dados do Capítulo 3 e os identificadores
da Tabela 3. Assim, o protótipo funcional só precisa trocar a origem dos
dados: em vez do módulo de *mock*, as telas passam a consultar a API REST e a
receber as atualizações por WebSocket (Seção 4.4).

Um protótipo funcional seguiria o caminho da Figura 1 sem hardware: um
simulador publicaria as mensagens dos dispositivos da Tabela 3, inclusive com
as falhas da Tabela 14 (desconexão, reenvio, duplicatas, dados nulos e
corrompidos); o middleware validaria, gravaria e aplicaria as regras; e as
mesmas telas passariam a mostrar os dados do middleware. Esse é o próximo
passo do projeto (Capítulo 10).

As fontes deste documento, das telas e dos diagramas estão no repositório
<https://github.com/carneirofc/1322010-2025.3-A--IoT-Smart-Home-Software-Integration>.
