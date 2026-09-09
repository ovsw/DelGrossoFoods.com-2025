// Isolated Next fixture: imports production components without Sanity credentials.
// Run with PLAYWRIGHT_MODULE pointing to an installed Playwright package if it
// is not on the normal Node resolution path. No production GA events are sent.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import {
  mkdtemp,
  mkdir,
  readdir,
  writeFile,
  symlink,
  rm,
} from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = path.join(root, "apps/web-dgf");
const fixture = await mkdtemp(path.join(tmpdir(), "dg-consent-"));
const port = Number(process.env.CONSENT_TEST_PORT || 3197);
const localBase = `http://127.0.0.1:${port}`;
// Route only this origin to the local fixture. Chromium retains the HTTPS host
// and public-suffix cookie rules used by Vercel previews; no deployment occurs.
const base = process.env.CONSENT_TEST_ORIGIN || localBase;
const modulePath = (relative) => JSON.stringify(path.join(root, relative));
let server;
let browser;
let serverLog = "";
try {
  await mkdir(path.join(fixture, "node_modules"));
  for (const entry of await readdir(path.join(app, "node_modules"))) {
    if (entry.startsWith(".") || entry === "typescript") continue;
    await symlink(
      path.join(app, "node_modules", entry),
      path.join(fixture, "node_modules", entry),
    );
  }
  await symlink(
    path.join(root, "node_modules/typescript"),
    path.join(fixture, "node_modules/typescript"),
  );
  await mkdir(path.join(fixture, "app/next"), { recursive: true });
  await writeFile(
    path.join(fixture, "package.json"),
    JSON.stringify({
      private: true,
      dependencies: { next: "15.5.9", react: "19.2.3", "react-dom": "19.2.3" },
    }),
  );
  await writeFile(
    path.join(fixture, "next.config.js"),
    'module.exports = { transpilePackages: ["@workspace/ui"], devIndicators: false };',
  );
  await writeFile(
    path.join(fixture, "app/layout.tsx"),
    `
import { headers } from 'next/headers';
import { IubendaHead } from ${modulePath("packages/ui/src/components/iubenda-head")};
import { TrackingAnalytics } from ${modulePath("packages/ui/src/components/tracking-consent")};
import Script from 'next/script';
import Link from 'next/link';
export default async function Layout({children}) {
 const site = (await headers()).get('x-consent-test-site') === 'LFD' ? 'LFD' : 'DGF';
 const store = site === 'LFD' ? 'delgrossosauce' : 'delgrossofoods';
 const policy = site === 'LFD' ? '49130163' : '61608121';
 return <html lang="en"><IubendaHead site={site} gaId="G-CONSENTTEST" /><body>
 <TrackingAnalytics gaId="G-CONSENTTEST" />
 <Link href="/">Home</Link><Link href="/next">Next page</Link>
 <footer><a href={"https://www.iubenda.com/privacy-policy/" + policy + "/cookie-policy?an=no&s_ck=false&newmarkup=yes"} className="iubenda-cs-uspr-link">Notice at Collection</a><a href={"https://www.iubenda.com/privacy-policy/" + policy + "/legal#privacy_rights_under_us_state_laws"} className="iubenda-cs-preferences-link">Your Privacy Choices</a></footer>
 <a href={"https://" + store + ".foxycart.com/cart?cart=view"}>Cart</a>
 <Script src={"https://cdn.foxycart.com/" + store + "/loader.js"} strategy="beforeInteractive" />
 {children}</body></html>;
}`,
  );
  await writeFile(
    path.join(fixture, "app/page.tsx"),
    `
import { headers } from "next/headers";
import { RecipeVideoClient as DgfVideo } from ${modulePath("apps/web-dgf/src/components/page-sections/recipe-page/recipe-video/recipe-video-client")};
import { RecipeVideoClient as LfdVideo } from ${modulePath("apps/web-lfd/src/components/page-sections/recipe-page/recipe-video/recipe-video-client")};
export const metadata = { title: "Consent fixture" };
export default async function Page() { const RecipeVideoClient = (await headers()).get("x-consent-test-site") === "LFD" ? LfdVideo : DgfVideo; return <><h1>Consent test</h1><RecipeVideoClient playbackId="${process.env.CONSENT_TEST_PLAYBACK_ID || "JdxMkuGVPJiFekKvLQIBucZQH4bPngjLyz100McW4vXY"}" metaTitle="Consent test" /></>; }
`,
  );
  await writeFile(
    path.join(fixture, "app/next/page.tsx"),
    'export const metadata = {title: "Second route"}; export default function Page() {return <h1>Second route</h1>;}',
  );
  server = spawn(
    process.execPath,
    [
      path.join(app, "node_modules/next/dist/bin/next"),
      "dev",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    {
      cwd: fixture,
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  server.stdout.on("data", (d) => {
    serverLog += d;
  });
  server.stderr.on("data", (d) => {
    serverLog += d;
  });
  for (let attempt = 0; attempt < 90; attempt++) {
    if (server.exitCode !== null)
      throw new Error(`Next fixture exited: ${serverLog}`);
    try {
      const response = await fetch(localBase);
      if (response.ok) break;
    } catch {}
    if (attempt === 89)
      throw new Error(`Next fixture did not start: ${serverLog}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  const html = await (await fetch(localBase)).text();
  const scripts = [...html.matchAll(/<script\b([^>]*)>/g)].map((m) => m[1]);
  assert.match(
    scripts[0],
    /dg-iubenda-config/,
    `First emitted script: ${scripts[0]}`,
  );
  assert.match(scripts[1], /autoblocking\/4618045.js/);
  assert.match(scripts[2], /gpp\/stub.js/);
  assert.match(scripts[3], /iubenda_cs.js/);
  assert(!html.includes("googletagmanager.com/gtag/js"));
  console.log(
    "PASS Next emitted head: config → native autoblocker → GPP → async CMP → Next; no GA preload",
  );
  browser = await chromium.launch({ headless: true });
  const contexts = [];
  async function open({
    site = "DGF",
    storageState,
    gpc = false,
    failCmp = false,
  } = {}) {
    const context = await browser.newContext({
      storageState,
      extraHTTPHeaders: {
        "x-consent-test-site": site,
        ...(gpc ? { "Sec-GPC": "1" } : {}),
      },
    });
    contexts.push(context);
    if (base !== localBase) {
      await context.route(`${base}/**`, async (route) => {
        const url = new URL(route.request().url());
        const response = await route.fetch({
          url: `${localBase}${url.pathname}${url.search}`,
        });
        await route.fulfill({ response });
      });
    }
    if (gpc)
      await context.addInitScript(() =>
        Object.defineProperty(navigator, "globalPrivacyControl", {
          value: true,
        }),
      );
    const requests = [];
    context.on("request", (r) => requests.push(r.url()));
    // Exercise the real GA mount/Next loader, but never send test analytics.
    await context.route(
      /https:\/\/(?:www\.)?googletagmanager\.com\/gtag\/js/,
      (route) =>
        route.fulfill({
          contentType: "text/javascript",
          body: "window.__gaLoads=(window.__gaLoads||0)+1",
        }),
    );
    await context.route(/https:\/\/[^/]*google-analytics\.com\//, (route) =>
      route.fulfill({ status: 204, body: "" }),
    );
    if (failCmp)
      await context.route(/https:\/\/(?:cdn|cs)\.iubenda\.com\//, (route) =>
        route.abort(),
      );
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (message) => {
      if (
        message.type() === "error" &&
        /hydration|hydrated|react error/i.test(message.text())
      )
        errors.push(message.text());
    });
    await page.goto(base, { waitUntil: "domcontentloaded" });
    return { context, page, requests, errors };
  }
  const gaRequests = (requests) =>
    requests.filter((u) => u.includes("googletagmanager.com/gtag/js"));
  const muxDataRequests = (requests) =>
    requests.filter((u) =>
      /(?:litix\.io|mux\.com\/.*(?:analytics|beacon))/.test(u),
    );
  for (const site of ["DGF", "LFD"]) {
    const b = await open({ site });
    await b.page.waitForFunction(
      () => window.__dgTracking?.permission === "allowed",
      { timeout: 45000 },
    );
    await b.page.waitForFunction(() => window.__gaLoads === 1);
    assert.equal(await b.page.title(), "Consent fixture");

    await b.page.waitForFunction(() => !!window.FC, { timeout: 30000 });
    await b.page.locator("mux-player").waitFor();
    await b.page
      .getByRole("link", { name: "Your Privacy Choices", exact: true })
      .click();
    await b.page.locator("#iubenda-iframe").waitFor({ state: "visible" });
    await b.page
      .getByRole("button", { name: "Save and continue", exact: true })
      .waitFor();
    const switches = b.page.locator('#iubenda-iframe input[type="checkbox"]');
    assert.equal(await switches.count(), 3);
    for (const toggle of await switches.all())
      assert.equal(await toggle.isChecked(), true);
    assert.equal(
      await b.page.locator("footer .iubenda-cs-uspr-link").count(),
      1,
    );
    assert.equal(
      await b.page.locator("footer .iubenda-cs-preferences-link").count(),
      1,
    );
    assert.equal(
      await b.page.locator(".iub__us-widget").count(),
      0,
      "No duplicate auto widget outside the footer",
    );
    console.log(
      `PASS ${site}: real CMP default allows GA once; Foxy runtime and preferences dialog load`,
    );
    // Save through the same panel as visitors, not the low-level storage API.
    await b.page
      .getByRole("button", { name: "Save and continue", exact: true })
      .click();
    await b.page.locator("#iubenda-iframe").waitFor({ state: "hidden" });
    await b.page.getByRole("link", { name: "Next page", exact: true }).click();
    await b.page.getByRole("heading", { name: "Second route" }).waitFor();
    await b.page.waitForFunction(() => document.title === "Second route");
    assert.equal(await b.page.evaluate(() => window.__gaLoads), 1);
    assert.equal(gaRequests(b.requests).length, 1);
    await b.page.getByRole("link", { name: "Home", exact: true }).click();
    await b.page.locator("mux-player").waitFor();
    await b.page.locator("mux-player").evaluate((player) => player.play());
    await b.page.waitForFunction(
      () => document.querySelector("mux-player")?.currentTime > 0,
    );
    const acceptedState = await b.context.storageState();
    let navigations = 0;
    b.page.on("request", (request) => {
      if (
        request.isNavigationRequest() &&
        request.frame() === b.page.mainFrame()
      )
        navigations++;
    });
    await b.page
      .getByRole("link", { name: "Your Privacy Choices", exact: true })
      .click();
    await b.page
      .getByRole("button", { name: "Reject all", exact: true })
      .click();
    await b.page
      .getByRole("button", { name: "Save and continue", exact: true })
      .click();
    await b.page.waitForFunction(
      () => window.__dgTracking?.permission === "denied",
      { timeout: 45000 },
    );
    await b.page.waitForTimeout(2500);
    assert.equal(navigations, 1, "withdrawal must reload exactly once");
    assert.equal(await b.page.evaluate(() => window.__gaLoads || 0), 0);
    console.log(
      `PASS ${site}: client routing preserves single GA mount; withdrawal reloads once, no GA restart`,
    );
    const saved = await b.context.storageState();
    assert(
      saved.cookies.some((cookie) => cookie.name.startsWith("_iub")),
      "CMP must persist cookies",
    );
    const denied = await open({ site, storageState: saved });
    await denied.page.waitForFunction(
      () => window.__dgTracking?.permission === "denied",
    );
    await denied.page.locator("mux-player").waitFor();
    await denied.page
      .getByRole("link", { name: "Your Privacy Choices", exact: true })
      .click();
    await denied.page
      .getByRole("button", { name: "Save and continue", exact: true })
      .waitFor();
    for (const toggle of await denied.page
      .locator('#iubenda-iframe input[type="checkbox"]')
      .all())
      assert.equal(
        await toggle.isChecked(),
        false,
        "saved opt-out remains unchecked",
      );
    await denied.page
      .getByRole("button", { name: "Save and continue", exact: true })
      .click();
    await denied.page.locator("mux-player").waitFor();
    await denied.page.waitForTimeout(2500);
    assert.equal(gaRequests(denied.requests).length, 0);
    assert.equal(muxDataRequests(denied.requests).length, 0);
    assert.deepEqual(
      await denied.page.locator("mux-player").evaluate((p) => ({
        tracking: p.disableTracking,
        cookies: p.disableCookies,
      })),
      { tracking: true, cookies: true },
    );
    await denied.page.locator("mux-player").evaluate((p) => p.play());
    await denied.page.waitForFunction(
      () => document.querySelector("mux-player")?.currentTime > 0,
      { timeout: 30000 },
    );
    assert.equal(muxDataRequests(denied.requests).length, 0);
    await denied.page.waitForFunction(() => !!window.FC);
    console.log(
      `PASS ${site}: saved opt-out blocks GA/Mux Data; Mux playback advances with cookies/tracking disabled; Foxy remains loaded`,
    );
    const gpc = await open({ site, storageState: acceptedState, gpc: true });
    await gpc.page.waitForFunction(
      () => window.__dgTracking?.permission === "denied",
    );
    await gpc.page.waitForTimeout(2500);
    assert.equal(gaRequests(gpc.requests).length, 0);
    assert.equal(muxDataRequests(gpc.requests).length, 0);
    console.log(`PASS ${site}: GPC blocks GA and Mux Data`);
    for (const entry of [b, denied, gpc]) {
      const unexpected = entry.errors.filter((message) => {
        // The native autoblocker annotates SSR nodes before React starts. React
        // reports attribute-only differences in dev, without recovering/remounting.
        const vendorAttributesOnly =
          message.startsWith("A tree hydrated but some attributes") &&
          message
            .split("https://react.dev/link/hydration-mismatch")
            .pop()
            .split("\n")
            .filter((line) => /^-\s+/.test(line))
            .every((line) =>
              /^-\s+data-(?:cmp-ab|cmp-info|iub-enabled)=/.test(line),
            );
        return !vendorAttributesOnly;
      });
      assert.equal(unexpected.length, 0, JSON.stringify(unexpected));
      await entry.context.close();
    }
  }
  const failed = await open({ failCmp: true });
  await failed.page.waitForTimeout(2000);
  assert.equal(gaRequests(failed.requests).length, 0);
  assert.equal(muxDataRequests(failed.requests).length, 0);
  console.log("PASS blocked CMP: optional tracking stays off");
} catch (error) {
  if (browser)
    for (const context of browser.contexts())
      for (const page of context.pages()) {
        console.error(
          "Browser diagnostic",
          await page
            .evaluate(() => ({
              permission: window.__dgTracking,
              preferences: window._iub?.cs?.api?.getPreferences?.(),
              purposes: window._iub?.cs?.api?.getPurposesState?.(),
              ga: window.__gaLoads,
              foxy: !!window.FC,
              scripts: Array.from(document.scripts)
                .map((s) => s.src)
                .filter(Boolean),
            }))
            .catch(() => ({})),
        );
      }
  console.error(serverLog.slice(-6000));
  throw error;
} finally {
  await browser?.close();
  if (server) {
    server.kill("SIGTERM");
    await new Promise((resolve) => {
      server.once("exit", resolve);
      setTimeout(resolve, 3000);
    });
  }
  await rm(fixture, { recursive: true, force: true });
}
