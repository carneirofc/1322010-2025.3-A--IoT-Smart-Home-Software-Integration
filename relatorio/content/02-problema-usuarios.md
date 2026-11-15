# Descrição do problema e dos usuários

## Cenário

A casa é uma residência de 3 a 4 moradores, alimentada em 220/127 V. Tem
energia solar conectada à rede, no Sistema de Compensação de Energia
Elétrica, em que a energia injetada vira crédito para abater o consumo
[@brasil2022lei14300]. As maiores cargas são o chuveiro elétrico e o
ar-condicionado do quarto; há ainda a bomba da piscina, a lavadora, a
iluminação externa e um fogão a gás. A casa tem Wi-Fi e um pequeno
computador sempre ligado, o *hub*.

## Problema

Sensor sozinho não resolve nada: a leitura só tem valor quando o software a
transforma em informação e em ação [@ufjf2026cap5, p. 3–4]. Hoje a família
vê dois números por mês, na conta de luz, e isso gera cinco problemas:

1. **Não há visibilidade.** Ninguém sabe que equipamento pesa na conta nem em
   que horário a casa mais consome.
2. **A sobra solar é desperdiçada.** A bomba e a lavadora funcionam a
   qualquer hora, inclusive à noite, enquanto a sobra do meio-dia vai para a
   rede.
3. **Falhas do sistema solar passam despercebidas.** Um inversor desligado só
   aparece na conta seguinte.
4. **A conta é uma surpresa.** No meio do mês não dá para saber se o valor
   vai passar do orçamento.
5. **Os riscos não chegam a quem está fora.** Gás no ambiente ou ar viciado
   no quarto só são notados por quem está em casa, quando são.

## Usuários

O morador responsável paga a conta e usa o celular, mas não é técnico: quer
ver custo e consumo, controlar as cargas, definir o orçamento e receber todos
os alertas. Os demais moradores controlam as cargas e recebem alertas, sem
mexer na configuração. O instalador (eletricista ou instalador solar)
acompanha a saúde dos dispositivos e as quedas de geração. Um contato de
emergência, vizinho ou parente, recebe só os alertas críticos de segurança.

## O que o software entrega

O painel mostra consumo e geração quase em tempo real, com o custo do dia e
do mês em reais. A tarifa e a bandeira do mês são configuráveis; a bandeira
acrescenta de R\$ 0,01885 (amarela) a R\$ 0,07877 (vermelha, patamar 2) por
kWh [@aneel2026bandeiras]. Com isso o sistema projeta a conta contra o
orçamento da família. A bomba e a lavadora passam a funcionar com a sobra
solar, e as cargas de menor prioridade são desligadas antes que o disjuntor
geral desarme. O ar-condicionado é só acompanhado: o sistema avisa quando ele
está frio demais ou ligado fora do horário. Avisos de segurança chegam ao
celular de quem precisa, e o instalador é avisado quando um dispositivo para
de responder ou a geração cai.

## Escopo

O sistema mede a entrada da casa, a geração solar e as duas maiores cargas
(chuveiro e ar-condicionado); aciona a bomba, a lavadora e a iluminação
externa; detecta gás e CO~2~ e aciona o alarme da casa; acompanha a tensão
da rede; e funciona sem internet. O restante do consumo aparece somado, como
"resto da casa". Fumaça, portas, fechaduras e câmeras podem entrar depois,
no mesmo padrão de dispositivos.

## Princípio de segurança

A proteção básica não depende do software. O sensor de gás é um aparelho
certificado, com alarme próprio, que apita mesmo com o *hub* desligado. O
sistema acrescenta o alarme da casa, ouvido em todos os cômodos, o aviso
remoto e o histórico, mas nunca é a única proteção. A apostila adota a mesma
postura para a saúde conectada: o software sinaliza, a decisão é humana
[@ufjf2026cap5, p. 20]. Esse princípio orienta as regras do Capítulo 5 e os
riscos do Capítulo 7.
