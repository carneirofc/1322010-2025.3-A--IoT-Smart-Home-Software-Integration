// @ts-check
/**
 * Capture the prototype screens (prototype/, Next.js static export) as report
 * figures.
 *
 * Builds the export, serves prototype/out/ on a free local port, renders each
 * route at a 1024 px wide desktop viewport, device scale 2, cropped to the
 * content height, and writes it to relatorio/figures/ under the figure name
 * the report uses. Runs on the host with the system Chromium (set
 * PUPPETEER_EXECUTABLE_PATH to override the lookup).
 *
 *   pnpm screens              # build, then capture
 *   pnpm screens --no-build   # capture the existing prototype/out/
 */
import { execFileSync } from "node:child_process";
import { createReadStream, existsSync, rmSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = join(ROOT, "prototype", "out");
const FIGURES_DIR = join(ROOT, "relatorio", "figures");
const VIEWPORT_WIDTH = 1024;
const MAX_HEIGHT = 1100; // content taller than this prints too small on A4

/** @type {ReadonlyArray<{ route: string; figure: string }>} */
const SCREENS = [
  { route: "/", figure: "fig05-tela-visao-geral" },
  { route: "/cargas/", figure: "fig06-tela-cargas" },
  { route: "/seguranca/", figure: "fig07-tela-seguranca" },
  { route: "/alertas/", figure: "fig08-tela-alertas" },
];

/** @type {Readonly<Record<string, string>>} */
const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

/** @returns {string} */
function findBrowser() {
  const fromEnv = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (fromEnv) return fromEnv;
  for (const name of ["chromium", "chromium-browser", "google-chrome-stable", "google-chrome"]) {
    try {
      return execFileSync("sh", ["-c", `command -v ${name}`], { encoding: "utf8" }).trim();
    } catch {
      // try the next candidate
    }
  }
  throw new Error("no Chromium/Chrome found; set PUPPETEER_EXECUTABLE_PATH");
}

/**
 * Maps a request path to a file in the export ("/cargas/" -> cargas/index.html).
 * @param {string} url
 * @returns {string | undefined}
 */
function resolveFile(url) {
  const path = decodeURIComponent(new URL(url, "http://localhost").pathname);
  const file = resolve(OUT_DIR, `.${path.endsWith("/") ? `${path}index.html` : path}`);
  if (file !== OUT_DIR && !file.startsWith(OUT_DIR + sep)) return undefined;
  for (const candidate of [file, `${file}.html`]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return undefined;
}

/** Tiny static file server for the export, on a free port. */
async function serveExport() {
  const server = createServer((req, res) => {
    const file = resolveFile(req.url ?? "/");
    if (!file) {
      res.writeHead(404, { "content-type": "text/plain" }).end("not found");
      return;
    }
    res.writeHead(200, {
      "content-type": CONTENT_TYPES[extname(file)] ?? "application/octet-stream",
    });
    createReadStream(file).pipe(res);
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", () => done(undefined)));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("server has no port");
  return { server, origin: `http://127.0.0.1:${address.port}` };
}

if (!process.argv.includes("--no-build")) {
  execFileSync("pnpm", ["--filter", "prototype", "build"], { cwd: ROOT, stdio: "inherit" });
}
if (!existsSync(join(OUT_DIR, "index.html"))) {
  console.error(`error: ${OUT_DIR} has no export; run pnpm build:prototype`);
  process.exit(1);
}

const { server, origin } = await serveExport();
const browser = await puppeteer.launch({
  executablePath: findBrowser(),
  args: ["--no-sandbox", "--hide-scrollbars"],
});
try {
  const tab = await browser.newPage();
  // A small initial height lets fullPage crop the capture to the content.
  await tab.setViewport({ width: VIEWPORT_WIDTH, height: 400, deviceScaleFactor: 2 });
  for (const { route, figure } of SCREENS) {
    await tab.goto(`${origin}${route}`, { waitUntil: "networkidle0" });
    const height = await tab.evaluate(() => document.documentElement.scrollHeight);
    const out = join(FIGURES_DIR, `${figure}.png`);
    // A vector PDF next to the PNG would win in the LaTeX build; the screens
    // replace the old Mermaid wireframes, so drop any stale one.
    rmSync(join(FIGURES_DIR, `${figure}.pdf`), { force: true });
    await tab.screenshot({ path: /** @type {`${string}.png`} */ (out), fullPage: true });
    const warn = height > MAX_HEIGHT ? `  WARN taller than ${MAX_HEIGHT}px` : "";
    console.log(`ok ${route} -> figures/${figure}.png (${VIEWPORT_WIDTH}x${height})${warn}`);
  }
} finally {
  await browser.close();
  server.close();
}
