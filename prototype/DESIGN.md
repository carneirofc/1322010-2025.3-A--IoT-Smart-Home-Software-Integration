# Design direction: Casa Monitorada

The panel speaks the visual language of `@carneirofc/ui` (deedlit.dev): a
pale blue-lavender wash, translucent panels edged by a cyan-to-pink
gradient, violet-tinted ink, Sora headings over IBM Plex Mono readings, and
a faint scanline texture. This app is a **light, print-first member of that
family**, applied to the energy and safety of a Brazilian home with rooftop
solar. The library's neon accents get one job each, and every accent text
uses its dark ink twin so the screens survive an A4 print on white paper.

## Palette

| Name  | Hex       | Role                                                                                      |
| ----- | --------- | ----------------------------------------------------------------------------------------- |
| Névoa | `#F3F7FD` | Page ground: the library's light `--bg-0`, a cool wash, never cream.                      |
| Tinta | `#241F31` | Ink for text and readings: the library's violet-black `--ui-ink-strong`.                  |
| Ciano | `#00B7FF` | Solar: generation, the roof, the chart's solar area. Ink `#00648C`.                       |
| Rosa  | `#FF4AD8` | The grid exchange and the interactive accent (active tab, primary button). Ink `#A3127F`. |
| Lima  | `#67F8BF` | Normal state, selling to the grid, inside the budget. Ink `#0B6B47`.                      |
| Âmbar | `#FFBF4A` | Attention state (the library's `--accent-warn`). Ink `#7A4B00`.                           |

Supporting values come straight from the library's light set: secondary ink
`#5F5772`, panel border `#C9CDF5` (cyan/pink blend), divider `#E1D9EF`,
surface `#FFFFFF` at 86 % over the wash. Two state hues extend the warn
accent for the report's four-step scale: laranja `#FF8A3D` (aviso, ink
`#9C3D00`) and vermelho `#F0445A` (crítico, ink `#B0132E`).

State is always a word plus a colour (normal, atenção, aviso, crítico). Tints
and inks pass AA: lima tint `#DDFBEF` with its ink is 6.0:1, âmbar 6.6:1,
laranja 5.7:1, vermelho 5.8:1. Secondary ink on Névoa is 6.3:1.

## Type

Bundled with `@fontsource`; no network fonts.

- **Sora** (400, 600, 700): headings and body, as in the library (`h1–h3`
  tracked at −0.02em).
- **IBM Plex Mono** (400, 500, 600): every reading and identifier (kW, R$,
  A, V, ppm, clock times, rule ids, device ids). It carries the data,
  never small labels as decoration.

Scale in px: reading 56/1 (mono, one per screen), display 34/1.05 (mono
values), title 24/1.15, heading 18/1.25, body 15/1.5, small 14/1.45, caption
13/1.4. Nothing below 13 px.

## Shape and depth

- Radii from the library scale: 28 px on the one `CyberPanel` per screen,
  18 px on `CyberSubpanel`s, 10 px on controls, 6 px on chips. Lists inside a
  panel are separated by dividers, never boxed again.
- Shadows: the library's long, low shadow (`0 28px 78px -52px`) on the hero
  panel only; subpanels sit flat with a 1 px gradient-tinted border.
- Texture: the hero panel carries a 3 px scanline at 5 % ink; the page
  carries two faint cyan and pink glows in its top corners. Nothing else.

## Screens

Shell: a translucent header with the gradient mark, the hub state and the
clock; tabs in the library's sidebar-item style (10 px radius, active tab
tinted cyan with the strong gradient border).

```
(◆) Casa Monitorada                 ● hub online, internet ok   14:45
[ Visão geral ][ Cargas ][ Segurança e saúde ][ Alertas  2 abertos ]
```

**Visão geral**: the hero answers "buying or selling right now".

```
╭─ CyberPanel ───────────────────────────────────────────────────╮
│ Agora a casa está vendendo energia      Telhado 2,8  Casa 2,2  │
│ 0,6 kW injetados na rede                                       │
│ [ casa 2,2 kW (ciano)                    | rede 0,6 (lima) ]   │
╰────────────────────────────────────────────────────────────────╯
╭ Conta de novembro ─────────────╮ ╭ Hoje, até 14:45 ───────────╮
│ R$ 151  bandeira verde         │ │ gerada ......... 20,4 kWh  │
│ [gasto|//projeção//|orçamento] │ │ consumida ...... 17,4 kWh  │
╰────────────────────────────────╯ ╰────────────────────────────╯
  Últimas 24 horas (open chart on the wash, legend on the title line)
╭ Cargas agora ──────────────────╮ ╭ 2 alertas abertos ─────────╮
```

**Cargas**: the hero is the set of controlled loads.

```
╭ Disjuntor geral 4 A de 50 A  [==|...........R3 45 A|]  normal ╮
╭─ CyberPanel: Cargas controladas ───────────────────────────────╮
│ ● ligada   Bomba da piscina 742 W | Automático, R1 10:42 | 4 h 03 de 6 h | [Desligar][Modo manual]
│ ○ aguarda  Lavadora               | Ciclo armado        | pronta 18:00  | [Ligar agora][Cancelar ciclo]
│ ○ deslig.  Iluminação externa     | Manual até 23:59    | 0 h hoje      | [Ligar][Voltar ao automático]
╰────────────────────────────────────────────────────────────────╯
 ▾ Últimos comandos (2)  (CollapsiblePanel, open)
```

**Segurança e saúde**: the hero answers "is anything unsafe".

```
╭─ CyberPanel ───────────────────────────────────────────────────╮
│ Gás na cozinha: não detectado │ Alarme da casa: desligado [Testar alarme]
│ 2 alertas abertos de saúde: CO₂ no quarto, ar-condicionado     │
╰────────────────────────────────────────────────────────────────╯
╭ Ar do quarto 1 240 ppm ───────╮ ╭ Ar-condicionado do quarto ────╮
╭ Rede elétrica ─╮ ╭ Dispositivos 8 | 7 online | 1 atrasado [Copiar id] ╮
```

**Alertas**: the hero is the open alerts; closed ones recede.

```
[ Todos | Abertos | Reconhecidos | Encerrados ]  (SegmentedControl)
╭─ CyberPanel: open ─────────────────────────────────────────────╮
│ Aviso  R9  CO₂ no quarto  1 240 ppm há 20 min  aberto 14:40 [Reconhecer]
╰────────────────────────────────────────────────────────────────╯
  Encerrados: plain rows on the wash, [Ver comandos] [Linha do tempo] (opens a Dialog)
```

## Principles

1. **Same family, own house.** Tokens, radii, panel recipe and type come
   from deedlit.dev; the meaning (solar, grid, safety) belongs to this app.
2. **Accents mean one thing.** Cyan is the sun, rosa the grid and the hand
   on the controls, lima is normal, âmbar to vermelho is state. Text always
   uses the ink twin.
3. **One panel speaks loudest.** Each screen has a single `CyberPanel` with
   the gradient, shadow and scanline; everything else is a quieter subpanel
   or open content on the wash.
4. **Readings in mono, sentences in Sora.** Numbers line up and look
   measured; prose reads like speech, in sentence case.
5. **Print first.** Light ground, AA ink, 13 px floor, ≤ 1100 px tall at
   1024 px wide. Motion only answers a click (dialog, disclosure) and stops
   under reduced motion.

## Relation to deedlit.dev.ui

- **Kept:** the light token set (`--bg-0`, violet inks, `--ui-border*`), the
  four accents, the cyan-to-pink panel border, the `cyber-panel` and
  `cyber-subpanel` recipes, the radius scale, the long low shadow, Sora with
  IBM Plex Mono, −0.02em headings, the scanline texture.
- **Changed:** no dark theme and no full-page noise overlay (they blur in
  print); glows cut to two faint corner washes; every accent gets a dark ink
  for text; the warn accent is extended to a four-step state scale; the
  type floor rises to 13 px from the library's 11 px.
- **Not imported:** `@carneirofc/ui/styles.css`. The language is re-expressed
  in `src/app/globals.css` and `src/app/ui-library.css`.
