# Casa Monitorada — visual prototype

Visual prototype (Part B of the assignment) of the home-monitoring dashboard
specified in the report (`relatorio/content/06-interface.md`, rules R1–R9 in
`05-regras.md`). Four screens, mock data only, no backend.

| Route         | Screen                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------- |
| `/`           | Visão geral — energy flow, today, month budget, 24 h chart, loads, open alerts           |
| `/cargas/`    | Cargas — service entrance current (R3), controlled loads, last commands                  |
| `/seguranca/` | Segurança e saúde — gas, house alarm, supply voltage, bedroom air (R9), AC (R7), devices |
| `/alertas/`   | Alertas — filters and alert list                                                         |

## Stack

Next.js 16 (App Router, static export), React 19, TypeScript (strict,
`noUncheckedIndexedAccess`), Tailwind CSS v4 (CSS-first tokens in
`src/app/globals.css`), Biome. No UI kit, chart library, icon package or
external font: icons are inline SVG components and the chart is an SVG
computed from the mock series.

## Commands

Run from the repository root (pnpm workspace) or from `prototype/`:

```sh
pnpm install                       # once, at the repository root
pnpm dev                           # dev server (root script → prototype)
pnpm --filter prototype build      # static export to prototype/out/
pnpm --filter prototype typecheck  # tsc --noEmit
pnpm --filter prototype lint       # biome check .
pnpm --filter prototype format     # biome format --write .
```

`prototype/out/` is plain static files; serve it with any static server.

## Layout

```
src/
  app/          routes, root layout (header + tab navigation), globals.css
  components/   small presentational components (Card, StatusPill, Meter,
                EnergyFlow, DayChart, LoadRow, AlertItem, DeviceList, …)
  lib/format.ts pt-BR number formatting (2,8 kW · R$ 151 · 1 240 ppm · −0,6)
  mocks/        types.ts (domain types), scenario.ts (the example scenario),
                series.ts (24 h solar / load / grid curves)
```

## Data

Every value comes from `src/mocks/scenario.ts`: the same house at the same
instant as the report, a weekday in November at 14:45. Components receive
data through props and hold no numbers of their own. The "Energia agora"
figures are the last sample of the 24 h series in `series.ts`. Device ids
follow `<type>_<location>_<nn>`, as in the report.

Interaction is local state only: the Alertas filters (Todos / Abertos /
Reconhecidos / Encerrados) filter the list and "Reconhecer" marks an open
alert as acknowledged until the page reloads. All other buttons are inert.
The first render is the scenario as specified, which is what the report
figures show.

## Report figures

`pnpm screens` (repository root) builds the export, serves it locally and
captures the four screens at 1024 px wide into
`relatorio/figures/fig05`–`fig08`. See `relatorio/scripts/screens.mjs`.
