import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const appRequire = createRequire(
  new URL("../../../apps/web-dgf/package.json", import.meta.url),
);
function load(relative, dependencies = {}) {
  const filename = new URL(relative, import.meta.url);
  const code = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    require: (id) => dependencies[id] ?? appRequire(id),
  });
  return exports;
}
const lib = load("../src/lib/iubenda.ts");
function browser({
  uspr,
  gpc = false,
  hostname = "www.delgrossofoods.com",
} = {}) {
  let preferences = uspr ? { uspr } : {};
  let reloads = 0;
  const events = [];
  const microtasks = [];
  const timers = [];
  const window = {
    location: { hostname, reload: () => reloads++ },
    dispatchEvent: (event) => events.push(event.type),
  };
  vm.runInNewContext(lib.createIubendaBootstrap("DGF", "G-TEST"), {
    window,
    navigator: { globalPrivacyControl: gpc },
    Event,
    queueMicrotask: (fn) => microtasks.push(fn),
    setTimeout: (fn) => timers.push(fn),
  });
  window._iub.cs = { api: { getPurposesState: () => preferences.uspr } };
  return {
    window,
    events,
    callback: window._iub.csConfiguration.callback,
    permission: () => window.__dgTracking.permission,
    set: (uspr) => {
      preferences = { uspr };
    },
    flush: () => {
      while (microtasks.length) microtasks.shift()();
      while (timers.length) timers.shift()();
    },
    reloads: () => reloads,
  };
}
const allowed = { s: true, sh: true, adv: true };
test("startup is pending; US defaults allow only after CMP readiness, once", () => {
  const b = browser({ uspr: allowed });
  assert.equal(b.permission(), "pending");
  assert.equal(b.window["ga-disable-G-TEST"], true);
  b.callback.onReady();
  b.callback.onPreferenceExpressedOrNotNeeded();
  b.callback.onReady();
  assert.equal(b.permission(), "allowed");
  assert.equal(b.events.length, 1);
  assert.equal(b.reloads(), 0);
});
for (const purpose of ["s", "sh", "adv"]) {
  test(`saved ${purpose} opt-out prevents startup and never reloads`, () => {
    const b = browser({ uspr: { ...allowed, [purpose]: false } });
    b.callback.onReady();
    b.callback.onPreferenceExpressedOrNotNeeded();
    b.flush();
    assert.equal(b.permission(), "denied");
    assert.equal(b.window["ga-disable-G-TEST"], true);
    assert.equal(b.reloads(), 0);
  });
}
test("GPC overrides permissive saved preferences", () => {
  const b = browser({ uspr: allowed, gpc: true });
  b.callback.onReady();
  assert.equal(b.permission(), "denied");
});
test("missing state does not grant permission; startup failure denies", () => {
  const b = browser();
  b.callback.onReady();
  assert.equal(b.permission(), "pending");
  b.callback.onStartupFailed();
  assert.equal(b.permission(), "denied");
});
test("withdrawal disables GA immediately and reloads only after storage callback, once", () => {
  const b = browser({ uspr: allowed });
  b.callback.onReady();
  b.set({ ...allowed, adv: false });
  b.callback.onPreferenceChange();
  b.flush();
  assert.equal(b.permission(), "denied");
  assert.equal(b.reloads(), 0);
  assert.equal(b.window["ga-disable-G-TEST"], true);
  b.callback.onPreferenceExpressedOrNotNeeded();
  b.callback.onPreferenceExpressedOrNotNeeded();
  b.flush();
  assert.equal(b.reloads(), 1);
});
test("opting back in can mount without reload", () => {
  const b = browser({ uspr: { ...allowed, s: false } });
  b.callback.onReady();
  b.set(allowed);
  b.callback.onPreferenceExpressedOrNotNeeded();
  b.flush();
  assert.equal(b.permission(), "allowed");
  assert.equal(b.reloads(), 0);
});
test("both native head snippets retain config, autoblocker, GPP, async CMP order", () => {
  const { IubendaHead } = load("../src/components/iubenda-head.tsx", {
    "../lib/iubenda": lib,
  });
  const React = appRequire("react");
  const { renderToStaticMarkup } = appRequire("react-dom/server");
  for (const site of ["DGF", "LFD"]) {
    const html = renderToStaticMarkup(
      React.createElement(
        "html",
        null,
        React.createElement(IubendaHead, { site }),
        React.createElement("body", null),
      ),
    );
    const scripts = [...html.matchAll(/<script([^>]*)>/g)].map((m) => m[1]);
    assert.equal(scripts.length, 4);
    assert.match(scripts[0], /dg-iubenda-config/);
    assert.match(
      scripts[1],
      new RegExp(`autoblocking/${lib.iubendaSites[site].siteId}.js`),
    );
    assert.match(scripts[2], /gpp\/stub.js/);
    assert.match(scripts[3], /iubenda_cs.js/);
    assert.match(scripts[3], /async/);
    assert(!scripts[1].includes("async") && !scripts[1].includes("defer"));
    assert(html.includes(String(lib.iubendaSites[site].cookiePolicyId)));
  }
});

test("preview cookies are host-only without changing production domain settings", () => {
  assert.equal(
    browser({ hostname: "dgf-preview.vercel.app" }).window._iub.csConfiguration
      .localConsentDomainExact,
    true,
  );
  assert.equal(
    browser().window._iub.csConfiguration.localConsentDomainExact,
    undefined,
  );
  assert.equal(
    browser({ hostname: "vercel.app.example.com" }).window._iub.csConfiguration
      .localConsentDomainExact,
    undefined,
  );
});
