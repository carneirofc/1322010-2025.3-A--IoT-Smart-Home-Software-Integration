# Considerações finais

O documento especificou o software de um sistema IoT para uma casa com
energia solar, cobrindo os seis itens da Parte A: problema e usuários,
dicionário de dados, arquitetura do sensor à aplicação, doze regras SE/ENTÃO,
telas e riscos. O Capítulo 6 também apresentou o protótipo visual da Parte B.

Três decisões dão forma ao projeto. A segurança de vida não depende do
software: o sensor de gás tem alarme próprio, e o sistema leva o alarme à
casa toda, avisa e registra. Tudo roda dentro de casa, então a falta de
internet só afeta o acesso remoto e as notificações. E dado duvidoso nunca
aciona nada: leituras reenviadas, atrasadas, nulas ou de dispositivos
offline vão para o histórico, mas não ligam relés.

O projeto percorre a cadeia de valor da disciplina [@ufjf2026cap5, p. 3]: a
coleta combina leituras periódicas e eventos com *heartbeat* (Unidade 2), a
validação aplica as dimensões de qualidade na entrada (Unidade 3), o
armazenamento separa dados quentes, mornos e frios (Unidade 4), e a
integração usa *pub/sub*, armazenar e encaminhar e regras SE/ENTÃO para
entregar a informação certa a quem precisa (Unidade 5).

O trabalho tem limites claros. O custo em reais é uma estimativa e não
reproduz a conta, que inclui impostos, iluminação pública e regras de
compensação próprias de cada distribuidora [@brasil2022lei14300]. Os
limites e tempos das regras são valores iniciais, que só dados reais da casa
vão calibrar. O *hub* único continua sendo um ponto de falha; o nobreak, o
reinício automático e a validade curta dos comandos reduzem o impacto, mas
não o eliminam. E tudo foi feito com dados simulados.

O próximo passo é o protótipo funcional, ligando as mesmas telas a um
simulador e ao middleware (Seção 6.8). Depois vêm a instalação numa casa,
com algumas semanas de dados para calibrar as regras, o uso da previsão do
tempo para planejar as cargas do dia seguinte e a tarifa branca, em que o
preço muda com o horário, como mais um critério para as cargas.
