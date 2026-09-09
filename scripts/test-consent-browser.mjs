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
const production = process.env.CONSENT_TEST_PRODUCTION === "1";
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
  await writeFile(
    path.join(fixture, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "ES2017",
        lib: ["dom", "dom.iterable", "esnext"],
        module: "esnext",
        moduleResolution: "bundler",
        jsx: "preserve",
        esModuleInterop: true,
        skipLibCheck: true,
        noEmit: true,
        plugins: [{ name: "next" }],
      },
      include: [
        "next-env.d.ts",
        "app/**/*.ts",
        "app/**/*.tsx",
        ".next/types/**/*.ts",
      ],
    }),
  );
  await writeFile(
    path.join(fixture, "postcss.config.js"),
    `module.exports = { plugins: { [${JSON.stringify(require.resolve("@tailwindcss/postcss", { paths: [path.join(root, "packages/ui")] }))}]: {} } };`,
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
import ${modulePath("packages/ui/src/styles/globals.css")};
import './fixture.css';
import { LegalFooter } from './legal-footer';
import { RefreshProbe } from './refresh-probe';
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
 <RefreshProbe /><TrackingAnalytics gaId="G-CONSENTTEST" />
 <Link href="/">Home</Link><Link href="/next">Next page</Link>
 <LegalFooter site={site} />
 <a href={"https://" + store + ".foxycart.com/cart?cart=view"}>Cart</a>
 <Script src={"https://cdn.foxycart.com/" + store + "/loader.js"} strategy="beforeInteractive" />
 {children}</body></html>;
}`,
  );
  await writeFile(
    path.join(fixture, "app/legal-footer.tsx"),
    `
'use client';
import {usePathname} from 'next/navigation';
import {FooterShell} from ${modulePath("packages/ui/src/components/footer-shell")};
import {IubendaLegalLink} from ${modulePath("packages/ui/src/components/iubenda-legal-link")};
import {IubendaPrivacyControls} from ${modulePath("packages/ui/src/components/iubenda-privacy-controls")};
export function LegalFooter({site}) {
 const pathname = usePathname();
 const policy = site === 'LFD' ? '49130163' : '61608121';
 const links = [
  ['Privacy Policy', 'https://www.iubenda.com/privacy-policy/' + policy],
  ['Cookie Policy', 'https://www.iubenda.com/privacy-policy/' + policy + '/cookie-policy'],
  ['Terms and Conditions', 'https://www.iubenda.com/terms-and-conditions/' + policy]
 ];
 return <FooterShell brandBlock={<div style={{textAlign:'left'}}><p>Business address</p><IubendaPrivacyControls site={site}/></div>} contactBlock={<p>Business contact</p>} socialBlock={<p>Social links</p>}
 legalItems={links.map(([label, href]) => ({id:label, content:<IubendaLegalLink key={pathname+href} href={href}>{label}</IubendaLegalLink>}))} />;
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
  await writeFile(
    path.join(fixture, "app/fixture.css"),
    "body { background-color: rgb(12, 34, 56); }\n",
  );
  await writeFile(
    path.join(fixture, "app/refresh-probe.tsx"),
    `
'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
export function RefreshProbe() {
 const router = useRouter();
 useEffect(() => {document.documentElement.dataset.hydrated = 'true';}, []);
 return <button onClick={() => router.refresh()}>Refresh route</button>;
}`,
  );
  if (production) {
    const build = spawn(
      process.execPath,
      [path.join(app, "node_modules/next/dist/bin/next"), "build"],
      {
        cwd: fixture,
        env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    build.stdout.on("data", (d) => {
      serverLog += d;
    });
    build.stderr.on("data", (d) => {
      serverLog += d;
    });
    const code = await new Promise((resolve) => build.once("exit", resolve));
    assert.equal(code, 0, serverLog);
    console.log("PASS production fixture build");
  }
  server = spawn(
    process.execPath,
    [
      path.join(app, "node_modules/next/dist/bin/next"),
      production ? "start" : "dev",
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
    failEmbed = false,
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
    if (failEmbed)
      await context.route("https://cdn.iubenda.com/iubenda*.js", (route) => {
        if (route.request().url().includes("/cs/")) return route.continue();
        return route.abort();
      });
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
  async function checkLightbox(page, label) {
    const link = page.getByRole("link", { name: label, exact: true });
    await page.waitForFunction(
      (label) =>
        Array.from(document.querySelectorAll("a.iubenda-embed")).find(
          (a) => a.textContent === label,
        )?.onclick,
      label,
    );
    const before = page.url();
    await link.click();
    await page.locator("#iubenda-pp").waitFor({ state: "visible" });
    assert.equal(page.url(), before, "Lightbox must not navigate the page");
    const frame = page.locator("#iubenda-pp iframe");
    await frame.waitFor();
    assert.match(await frame.getAttribute("src"), /iubenda/);
    const content = await (await frame.elementHandle()).contentFrame();
    await content.waitForFunction(() => document.body?.innerText.length > 300);
    assert.match(
      await content.locator("body").innerText(),
      new RegExp(label, "i"),
    );
    await page
      .locator("#iubenda-pp")
      .getByRole("button", { name: "Close", exact: true })
      .click();
    await page.locator("#iubenda-pp").waitFor({ state: "detached" });
  }
  for (const site of ["DGF", "LFD"]) {
    const b = await open({ site });
    await b.page.waitForFunction(
      () => window.__dgTracking?.permission === "allowed",
      { timeout: 45000 },
    );
    await b.page.waitForFunction(() => window.__gaLoads === 1);
    await b.page.waitForFunction(
      () => document.documentElement.dataset.hydrated === "true",
    );
    async function assertHead(title) {
      assert.equal(await b.page.title(), title);
      assert.equal(
        await b.page.evaluate(
          () => getComputedStyle(document.body).backgroundColor,
        ),
        "rgb(12, 34, 56)",
      );
      assert(
        (await b.page
          .locator('head link[rel="stylesheet"], head style')
          .count()) > 0,
      );
    }
    await assertHead("Consent fixture");
    for (const width of [1440, 390, 320]) {
      await b.page.setViewportSize({ width, height: 900 });
      const group = b.page.getByRole("group", { name: "US privacy controls" });
      const box = await group.boundingBox();
      assert(
        box && box.x >= 0 && box.x + box.width <= width,
        "Privacy group fits viewport",
      );
      assert.equal(
        await group.evaluate((el) => getComputedStyle(el).backgroundColor),
        "rgb(255, 255, 255)",
      );
      assert.equal(await group.locator("img").count(), 1);
      assert.equal(
        await b.page.locator("footer ul .iubenda-cs-preferences-link").count(),
        0,
      );
      await b.page
        .locator("footer")
        .screenshot({ path: "/tmp/dg-legal-" + site + "-" + width + ".png" });
      if (width === 390) {
        await group
          .getByRole("link", { name: "Your Privacy Choices", exact: true })
          .click();
        await b.page
          .getByRole("button", { name: "Save and continue", exact: true })
          .click();
        await b.page.locator("#iubenda-iframe").waitFor({ state: "hidden" });
        assert.equal(await b.page.locator(".iub__us-widget").count(), 0);
      }
      await checkLightbox(b.page, "Privacy Policy");
      await assertHead("Consent fixture");
    }
    await b.page.setViewportSize({ width: 1440, height: 900 });
    await checkLightbox(b.page, "Cookie Policy");
    if (process.env.CONSENT_TEST_TERMS === "1")
      await checkLightbox(b.page, "Terms and Conditions");
    console.log(
      `PASS ${site}: desktop/mobile legal lightbox and privacy group; CSS/title retained`,
    );
    await b.page
      .getByRole("button", { name: "Refresh route", exact: true })
      .click();
    await b.page.waitForResponse(
      (response) =>
        response.url().startsWith(base) &&
        response.headers()["content-type"]?.includes("text/x-component"),
    );
    await b.page.waitForTimeout(500);
    await assertHead("Consent fixture");

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
    await assertHead("Second route");
    await checkLightbox(b.page, "Privacy Policy");
    await checkLightbox(b.page, "Cookie Policy");
    if (process.env.CONSENT_TEST_TERMS === "1")
      await checkLightbox(b.page, "Terms and Conditions");
    await assertHead("Second route");
    console.log(`PASS ${site}: replaced legal links work after client routing`);
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
        const marker = "https://react.dev/link/hydration-mismatch";
        const markerIndex = message.indexOf(marker);
        const diffLines =
          markerIndex === -1
            ? []
            : message
                .slice(markerIndex + marker.length)
                .split("\n")
                .filter((line) => /^-\s+/.test(line));
        const vendorAttributesOnly =
          message.startsWith("A tree hydrated but some attributes") &&
          markerIndex !== -1 &&
          diffLines.length > 0 &&
          diffLines.every((line) =>
            /^-\s+data-(?:cmp-ab|cmp-info|iub-enabled)=/.test(line),
          );
        return !vendorAttributesOnly;
      });
      assert.equal(unexpected.length, 0, JSON.stringify(unexpected));
      await entry.context.close();
    }
  }
  const fallback = await open({ failEmbed: true });
  await fallback.page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true",
  );
  for (const label of [
    "Privacy Policy",
    "Cookie Policy",
    "Terms and Conditions",
  ]) {
    const link = fallback.page.getByRole("link", { name: label, exact: true });
    const href = await link.getAttribute("href");
    assert.match(href, /^https:\/\/www\.iubenda\.com\//);
    await fallback.context.route(href, (route) =>
      route.fulfill({
        contentType: "text/html",
        body: "<h1>Direct legal fallback reached</h1>",
      }),
    );
    await link.click();
    await fallback.page
      .getByRole("heading", { name: "Direct legal fallback reached" })
      .waitFor();
    assert.equal(fallback.page.url(), href);
    await fallback.page.goto(base);
    await fallback.page.waitForFunction(
      () => document.documentElement.dataset.hydrated === "true",
    );
  }
  console.log(
    "PASS blocked embed: all three native links navigate to their hosted URLs",
  );
  await fallback.context.close();
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
