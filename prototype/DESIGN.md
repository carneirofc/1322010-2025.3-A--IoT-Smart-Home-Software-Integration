# Design direction — Casa Monitorada

The panel borrows its look from the hardware a Brazilian family already has
at home for electricity: the **quadro de distribuição** (a row of white
breakers, each with a handwritten label), the **relógio de luz** (the
bidirectional meter that counts what the house buys and what it injects),
and the **conta de luz** with its **bandeira tarifária**. The screens should
read like those objects, printed in black ink on white paper.

## Palette

| Name            | Hex       | Role                                                                    |
| --------------- | --------- | ----------------------------------------------------------------------- |
| Placa           | `#F2F4F3` | Page ground: the grey-white plastic of the board. Never cream.          |
| Grafite         | `#1C2321` | Ink, board frame, the one solid block per screen, active tab.           |
| Fio             | `#56605C` | Secondary text and hairlines (5.9:1 on Placa).                          |
| Módulo          | `#1F4E8C` | Photovoltaic-module blue: solar series, links, buttons, focus ring.     |
| Bandeira        | see below | State only: verde normal, amarela attention, laranja warning, vermelha critical. |
| Fase marrom     | `#8A5A12` | Grid exchange series in the chart (brown phase wire), never a state.    |

Bandeira set (each pairs a solid with a dark ink for text on tinted ground):

- verde `#1E7A46` / ink `#145232` / tint `#E3F1E8`
- amarela `#E3AE00` / ink `#5A4300` / tint `#FFF3C4`
- laranja `#B85400` / ink `#8A3F00` / tint `#FCEBDD`
- vermelha `#B8261E` / ink `#8E1B15` / tint `#FBE6E4`

Status is never colour alone: every swatch sits next to its word
("normal", "atenção", "aviso", "crítico", "ligada", "vendendo").

## Type

Two families, bundled with `@fontsource`, no network fonts.

- **Barlow Condensed** (500, 600, 700): the voice of labels printed on
  breakers and meters. Used for screen titles, breaker labels, tab labels and
  every large reading (kW, R$, A, V, ppm).
- **Atkinson Hyperlegible Next** (400, 600, 700): body text, sentences,
  buttons and tables. Built for legibility, which a family panel needs more
  than personality in its paragraphs.

Scale (px, line height): reading 64/0.95 (one per screen), display 40/1,
title 28/1.1, heading 20/1.2, body 16/1.45, small 14/1.4, caption 13/1.35.
Nothing below 13 px. Numbers use tabular figures where they line up.

## Screens

Header for every screen: a white strip closed by a 3 px Grafite rule; the
four tabs are breaker modules side by side on that rule, the active one
switched "up" (Grafite fill, white label).

```
+-----------------------------------------------------------------+
| Casa Monitorada        hub online, internet ok      14:45       |
| [Visão geral][Cargas][Segurança e saúde][Alertas  2 abertos]     |
+=================================================================+
```

**Visão geral** — the loud thing is the meter: is the house buying or
selling right now.

```
| Vendendo 0,6 kW para a rede            telhado 2,8  casa 2,2    |
| comprando <=======|=========(*)====> vendendo   (meter scale)   |
+-------------------------------+---------------------------------+
| Conta de novembro (bill stub) | Hoje até 14:45                  |
| R$ 151 gastos   bandeira verde| 20,4 gerados  17,4 consumidos   |
| [spent|//projection//| budget]| 63 % autoconsumo  3,0 crédito   |
+-------------------------------+---------------------------------+
| Últimas 24 h  (solar area, house line, grid dashed)             |
+-------------------------------+---------------------------------+
| Cargas agora (3 breaker rows) | Precisa de atenção (open alerts)|
```

**Cargas** — the loud thing is the board itself: a Grafite frame holding
one breaker module per load.

```
| Disjuntor geral   4 A de 50 A  [====|.........R3 45 A|]  normal |
+==[ quadro ]=====================================================+
| |on|  Bomba da piscina   742 W | Automático, R1 10:42 | 4 h 03 de 6 h | [Desligar][Modo manual]
| |off| Lavadora                 | ciclo armado ...     | pronta 18:00  | [Ligar agora][Cancelar]
| |off| Iluminação externa       | manual até 23:59     | hoje 0 h      | [Ligar][Voltar ao automático]
+=================================================================+
| v Últimos comandos (collapsible, open)                          |
```

**Segurança e saúde** — the loud thing is the answer to "is anything
unsafe": gas and alarm in one Grafite-framed block, then what needs a hand.

```
| Gás na cozinha: não detectado   | Alarme: desligado [Testar]   |
+---------------------------------+-------------------------------+
| Ar do quarto 1 240 ppm (aviso)  | Ar-condicionado fora do       |
| scale 400..|1000|....2000       | horário (aviso, R7)           |
| abra a janela                   |                               |
+---------------------------------+-------------------------------+
| Rede elétrica  fase A 127 V  fase B 126 V  [117 ==== 133]        |
+-----------------------------------------------------------------+
| Dispositivos  8 / 7 online / 1 atrasado (copy id) / counters     |
| device labels in a rail                                         |
```

**Alertas** — the loud thing is the open warnings: a ledger where open
alerts carry a full-height colour edge and a button, closed ones fade to ink.

```
| [Todos|Abertos|Reconhecidos|Encerrados]                         |
| ▌Aviso  R9  CO₂ no quarto  1 240 ppm há 20 min    aberto 14:40 [Reconhecer]
| ▌Aviso  R7  Ar-condicionado ...                   aberto 13:40 [Reconhecer]
|  Aviso  R3  Sobrecarga ...                     encerrado 08:17 [Ver comandos]
|  Crítico R8 Gás ...                            encerrado 19:31 [Linha do tempo]
```

## Principles

1. **Speak hardware.** Breakers, a meter, a bill: shapes the family already
   reads without a manual. No generic cards floating on grey.
2. **One loud thing per screen.** A single Grafite block or 64 px reading
   answers the screen's question; everything else stays quiet and ruled.
3. **Colour is the bandeira.** Green, yellow, orange and red mean state and
   cost, always with the word next to them. Solar blue and phase brown are
   for data series only.
4. **Rules, not boxes.** Content is separated by hairlines and frames of
   different weights; corners stay square or nearly so (2 px on breakers,
   0 on the bill stub).
5. **Print first.** Black ink on a light ground, AA contrast, 13 px floor,
   each screen within 1100 px at 1024 px wide. Motion only answers a click
   (dialogs, disclosure) and stops under reduced motion.

## Rejected on review

- A dark header bar with a logo tile: replaced by the breaker-row tabs.
- Uppercase condensed state words ("VENDENDO"): sentence case reads as
  speech, uppercase reads as a sticker; breaker labels stay sentence case.
- Status pills on every block: a state is a short coloured edge or swatch
  plus its word, and only where the state can change.
- Monospace device ids: ids are set in Barlow Condensed like breaker labels.
