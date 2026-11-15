# Projeto Integrador de Software IoT — Casa Monitorada

Atividade prática do Capítulo 5 da disciplina Análise de Dados de
Dispositivos IoT e de Sensores (1322010-2025.3-A, UFJF). Tema 3: automação
residencial e eficiência energética.

O projeto especifica a camada de software de um sistema IoT para uma casa
com geração solar: medição de energia e custo, acionamento automático de
cargas (bomba da piscina, lavadora, iluminação externa) com a sobra solar e
proteção contra sobrecarga, e segurança e saúde da casa (gás, CO₂, alarme,
qualidade do fornecimento de energia).

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `relatorio/` | Parte A: documento de especificação (Markdown → PDF/DOCX, ABNT); ver `relatorio/README.md` |
| `relatorio/diagramas/` | Diagramas Mermaid (arquitetura, sequência, arbitragem, navegação, estados, validação) |
| `prototype/` | Parte B: protótipo visual em Next.js com dados simulados; ver `prototype/README.md` |

## Requisitos

- Node.js ≥ 24 e [pnpm](https://pnpm.io/)
- Chromium ou Google Chrome (diagramas e capturas de tela)
- pandoc e LuaLaTeX, ou Podman/Docker (o build do relatório usa um contêiner
  quando não os encontra)

## Uso

```bash
pnpm install

pnpm dev                 # protótipo em http://localhost:3000
pnpm build:prototype     # exporta o protótipo estático para prototype/out/

pnpm diagrams            # relatorio/diagramas/*.mmd -> relatorio/figures/
pnpm screens             # capturas das telas do protótipo -> relatorio/figures/
make -C relatorio        # relatorio/build/relatorio.pdf e .docx
pnpm report              # tudo acima, em sequência
```

## Material da disciplina

O material didático (apostilas e enunciados) não faz parte do repositório; o
relatório o cita pelas referências bibliográficas.
