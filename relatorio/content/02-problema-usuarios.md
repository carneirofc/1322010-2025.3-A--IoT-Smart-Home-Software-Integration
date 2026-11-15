# Descrição do problema e dos usuários

## Cenário

Considera-se uma residência unifamiliar com três a quatro moradores,
alimentada em 220/127 V. A casa possui geração solar fotovoltaica conectada à
rede e participa do Sistema de Compensação de Energia Elétrica, no qual a
energia injetada gera créditos que abatem o consumo [@brasil2022lei14300]. As
maiores cargas são o chuveiro elétrico e o ar-condicionado do quarto; há
também bomba de filtragem da piscina, lavadora de roupas, iluminação externa
e fogão a gás. A residência dispõe de rede Wi-Fi e de um pequeno computador
permanentemente ligado, doravante denominado *hub*.

## Problema

A leitura de um sensor só gera valor quando o software a converte em
informação e em ação [@ufjf2026cap5, p. 3–4]. Na situação atual, a família
dispõe apenas dos dois valores mensais da fatura de energia, a energia
consumida da rede e o crédito da energia injetada, o que resulta em cinco
problemas:

1. **Ausência de visibilidade.** Não se sabe quais equipamentos mais pesam na
   fatura nem em que horários o consumo é maior.
2. **Aproveitamento insuficiente da geração solar.** A bomba e a lavadora
   funcionam em qualquer horário, inclusive à noite, enquanto o excedente do
   meio-dia é injetado na rede.
3. **Falhas do sistema solar não detectadas.** O desligamento do inversor ou
   a queda de geração só se tornam visíveis na fatura seguinte.
4. **Imprevisibilidade da fatura.** No decorrer do mês, não é possível estimar
   se o valor excederá o orçamento familiar.
5. **Riscos não comunicados a moradores ausentes.** A presença de gás ou a
   concentração elevada de CO~2~ no quarto são percebidas apenas por quem
   está na residência.

## Usuários

O sistema atende quatro perfis. O morador responsável, que paga a fatura e
não possui formação técnica, acompanha custo e consumo, controla as cargas,
define orçamento e horários e recebe todos os alertas. Os demais moradores
controlam as cargas e recebem alertas, sem acesso à configuração. O
instalador, eletricista ou técnico do sistema solar, acompanha a saúde dos
dispositivos e as quedas de geração. O contato de emergência, vizinho ou
parente, recebe apenas os alertas críticos de segurança.

## Funcionalidades oferecidas

O painel apresenta consumo e geração em tempo quase real, com o custo
estimado do dia e do mês. A tarifa e a bandeira tarifária são configuráveis;
o adicional da bandeira varia de R\$ 0,01885 (amarela) a R\$ 0,07877
(vermelha, patamar 2) por kWh [@aneel2026bandeiras]. A partir desses
valores, o sistema projeta a fatura do mês e a compara com o orçamento
definido pela família.

No controle de cargas, a bomba e a lavadora passam a operar com o excedente
solar, e as cargas de menor prioridade são desligadas antes que o disjuntor
geral atue. O ar-condicionado é apenas monitorado: o sistema emite
orientações quando a temperatura está abaixo do necessário ou quando o
aparelho permanece ligado fora do horário de uso. Os avisos de segurança são
enviados ao celular dos usuários pertinentes, e o instalador é notificado
quando um dispositivo deixa de responder ou quando a geração cai.

## Escopo

O sistema mede a entrada de energia da residência, a geração solar e as duas
maiores cargas (chuveiro e ar-condicionado); aciona a bomba, a lavadora e a
iluminação externa; detecta gás e CO~2~ e aciona o alarme da casa;
acompanha a tensão de fornecimento; e opera sem dependência da internet. O
consumo das demais cargas é apresentado de forma agregada. Detecção de
fumaça, sensores de portas, fechaduras e câmeras podem ser incorporados
posteriormente, segundo o mesmo padrão de dispositivos.

## Princípio de segurança

A proteção básica não depende do software. O sensor de gás é um equipamento
certificado, dotado de alarme sonoro próprio, que funciona mesmo com o *hub*
desligado. O sistema acrescenta o alarme audível em toda a residência, a
notificação remota e o registro histórico, sem jamais constituir a única
camada de proteção. A apostila adota postura equivalente para a saúde
conectada, em que o software sinaliza a anomalia e a decisão permanece
humana [@ufjf2026cap5, p. 20]. Esse princípio orienta as regras do
Capítulo 5 e a análise de riscos do Capítulo 7.
