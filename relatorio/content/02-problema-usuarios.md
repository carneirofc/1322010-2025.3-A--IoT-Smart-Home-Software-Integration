# Descrição do problema e dos usuários

## Cenário

A casa considerada é uma residência unifamiliar com 3 a 4 moradores,
alimentada em 220/127 V, com quadro de distribuição próprio. Ela tem:

- um sistema solar fotovoltaico conectado à rede, que participa do Sistema de
  Compensação de Energia Elétrica: a energia injetada na rede vira crédito
  para abater o consumo [@brasil2022lei14300];
- chuveiro elétrico e um ar-condicionado no quarto, as duas maiores cargas;
- piscina com bomba de filtragem, lavadora de roupas e iluminação externa;
- fogão a gás (botijão ou gás encanado);
- Wi-Fi e um pequeno computador sempre ligado (o *hub* da casa).

## Problema

Os sensores, sozinhos, não resolvem nada: a leitura só tem valor quando o
software a transforma em informação e em ação [@ufjf2026cap5, p. 3–4]. Hoje
a família só vê dois números por mês, na conta de luz: a energia
comprada da rede e o crédito da energia injetada. Com isso:

1. **Não há visibilidade.** Ninguém sabe quais equipamentos pesam na conta nem
   em que horário a casa consome mais.
2. **A energia solar é mal aproveitada.** A bomba da piscina e a lavadora
   funcionam em qualquer horário, inclusive à noite, enquanto a sobra solar do
   meio-dia vai para a rede.
3. **Falhas do sistema solar passam despercebidas.** Um inversor desligado ou
   uma queda de geração só aparecem na conta seguinte, semanas depois.
4. **A conta é uma surpresa.** Não há como saber, no meio do mês, se o valor
   vai passar do orçamento da família.
5. **Riscos da casa não chegam a quem está fora.** Gás no ambiente ou ar
   viciado no quarto fechado só são notados, quando são, por quem está em
   casa.

## Usuários

: Usuários do sistema e o que cada um precisa.

| Usuário | Perfil | Precisa de |
|---------------------|------------------------------------|---------------------------------------------------------|
| Morador responsável | Adulto que paga a conta; usa o celular, não é técnico | Ver custo e consumo, controlar cargas, configurar o orçamento e os horários, receber todos os alertas |
| Demais moradores | Adultos e adolescentes da casa | Controlar cargas e receber alertas, sem alterar configurações |
| Instalador / técnico | Eletricista ou instalador solar | Saúde dos dispositivos, falhas do inversor e quedas de geração |
| Contato de emergência | Vizinho ou parente | Apenas alertas críticos de segurança, quando a família está fora |

Fonte: Elaborado pelo autor (2026).

## Valor entregue pelo software

- **Consumo e geração quase em tempo real**, com o custo em reais do dia e do
  mês. A tarifa e a bandeira tarifária do mês são configuráveis; a bandeira
  acrescenta de R\$ 0,01885 (amarela) a R\$ 0,07877 (vermelha patamar 2) por
  kWh [@aneel2026bandeiras].
- **Projeção da conta** contra um orçamento definido pela família.
- **Uso da sobra solar:** a bomba da piscina e a lavadora passam a funcionar
  quando o telhado gera mais do que a casa consome.
- **Proteção contra sobrecarga:** cargas de baixa prioridade são desligadas
  antes que o disjuntor geral desarme.
- **Orientação sobre o ar-condicionado**, sem controlá-lo: aviso de
  temperatura muito baixa e de uso fora do horário habitual.
- **Avisos de segurança e de saúde da casa** no celular de quem precisa,
  inclusive de quem está fora.
- **Avisos ao instalador** quando um dispositivo para de responder ou o
  sistema solar gera menos do que deveria.

## Escopo

: O que o sistema faz e o que fica de fora.

| Dentro do escopo | Fora do escopo (e por quê) |
|-----------------------------------------------|-----------------------------------------------|
| Medição da rede (importação e exportação), da geração solar, do chuveiro e do ar-condicionado | Separar o consumo de cada aparelho a partir de um único medidor (exige técnicas de desagregação, fora do alcance deste projeto) |
| Acionamento da bomba da piscina, da lavadora e da iluminação externa | Acionar o chuveiro (um chuveiro de 5 500 W em 220 V puxa 25 A; um relé nesse circuito é um risco) |
| Ar-condicionado apenas monitorado, com orientações | Controlar o ar-condicionado (ele mantém o próprio termostato) |
| Detecção de gás e de CO~2~ com alarme sonoro e luminoso; qualidade do fornecimento de energia | Fumaça, portas e janelas, caixa d'água, fechaduras e câmeras (podem ser acrescentados depois, seguindo o mesmo padrão de dispositivos) |
| Funcionamento local, mesmo sem internet | Integração com os sistemas da distribuidora |

Fonte: Elaborado pelo autor (2026).

## Princípio de segurança

A proteção básica não depende do software. O sensor de gás é um aparelho
certificado, com alarme local próprio, que apita mesmo com o *hub* desligado.
O sistema acrescenta o alarme da casa (sonoro e luminoso, ouvido em todos os
cômodos), o aviso remoto, o histórico e ações secundárias; ele nunca é a
única proteção. É a mesma postura que a apostila adota para a saúde
conectada: o software sinaliza a anomalia, mas a decisão é sempre humana
[@ufjf2026cap5, p. 20]. Esse princípio orienta as regras do Capítulo 5 e a
análise de riscos do Capítulo 7.
