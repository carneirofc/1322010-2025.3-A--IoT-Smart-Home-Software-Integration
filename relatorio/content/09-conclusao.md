# Considerações finais

Este documento especificou o software de um sistema IoT para uma residência
com geração solar fotovoltaica, contemplando os seis itens da Parte A:
problema e usuários, dicionário de dados, arquitetura de integração do
sensor à aplicação, doze regras no formato SE/ENTÃO, interface e análise de
riscos e resiliência. O Capítulo 6 apresentou, ainda, o protótipo visual
correspondente à Parte B.

Três decisões orientam o projeto. A primeira é que a segurança das pessoas
não depende do software: o sensor de gás possui alarme próprio, e o sistema
estende o alarme a toda a residência, notifica os responsáveis e registra a
ocorrência. A segunda é a execução integral na residência, de modo que a
indisponibilidade da internet afeta apenas o acesso remoto e as
notificações. A terceira é que dados de confiabilidade duvidosa não disparam
ações: leituras retransmitidas, atrasadas, nulas ou provenientes de
dispositivos offline são armazenadas no histórico, mas não acionam relés.

O projeto percorre a cadeia de valor estudada na disciplina
[@ufjf2026cap5, p. 3]. A coleta combina leituras periódicas e eventos com
*heartbeat* (Unidade 2); a validação aplica, na entrada, as dimensões de
qualidade de dados (Unidade 3); o armazenamento distingue dados quentes,
mornos e frios (Unidade 4); e a integração emprega *pub/sub*, armazenamento e
encaminhamento e regras SE/ENTÃO para entregar a informação adequada a cada
usuário (Unidade 5).

O trabalho apresenta limitações. O custo calculado é uma estimativa e não
reproduz a fatura, que inclui tributos, contribuição de iluminação pública,
tarifas de cada distribuidora e as regras de transição da compensação
[@brasil2022lei14300].
Os limites e intervalos das regras são valores iniciais, que dependem de
calibração com dados reais da residência. O *hub* único permanece como ponto
de falha; o nobreak, o reinício automático e a validade limitada dos
comandos reduzem o impacto, sem eliminá-lo. Além disso, a especificação e o
protótipo baseiam-se em dados simulados.

Como trabalhos futuros, propõem-se o desenvolvimento do protótipo funcional,
com as mesmas telas alimentadas por um simulador e pelo middleware
(Seção 6.8); a instalação do sistema em uma residência, com algumas semanas
de coleta para calibrar as regras; o uso da previsão do tempo no
planejamento das cargas do dia seguinte; e a consideração da tarifa branca,
na qual o preço da energia varia conforme o horário, como critério adicional
para o acionamento das cargas.
