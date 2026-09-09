export type TrackingPermission = "pending" | "allowed" | "denied";

export const iubendaSites = {
  DGF: { siteId: 4618045, cookiePolicyId: 61608121 },
  LFD: { siteId: 4618044, cookiePolicyId: 49130163 },
} as const;

// This runs natively before the autoblocker and Next bootstrap, not in an effect.
// USPR booleans are permissions (true = permitted), not opt-out booleans.
// See Iubenda core-en.js: USPurposes defaults, checkPurposes and GPC handling.
export function createIubendaBootstrap(
  site: keyof typeof iubendaSites,
  gaId?: string,
): string {
  const config = {
    ...iubendaSites[site],
    lang: "en",
    storage: { useSiteId: true },
  };
  return `
(function () {
  var gaId = ${JSON.stringify(gaId ?? "").replace(/</g, "\\u003c")};
  var state = window.__dgTracking = { permission: "pending" };
  var reloadPending = false;
  var reloading = false;
  function update(permission) {
    var previous = state.permission;
    if (gaId) window["ga-disable-" + gaId] = permission !== "allowed";
    if (previous === permission) return;
    state.permission = permission;
    if (previous === "allowed" && permission !== "allowed") reloadPending = true;
    window.dispatchEvent(new Event("dg:tracking-change"));
  }
  function read() {
    if (navigator.globalPrivacyControl === true) return "denied";
    var api = window._iub && window._iub.cs && window._iub.cs.api;
    if (!api || typeof api.getPurposesState !== "function") return "pending";
    // getPreferences() can be empty on a first US visit. The current purpose
    // state includes the CMP-resolved US defaults as well as saved choices.
    var uspr = api.getPurposesState();
    if (!uspr) return "pending";
    var purposes = ["s", "sh", "adv"];
    if (purposes.some(function (key) { return uspr[key] === false; })) return "denied";
    return purposes.every(function (key) { return uspr[key] === true; }) ? "allowed" : "pending";
  }
  function refresh() {
    try { update(read()); } catch (_) { update("denied"); }
  }
  function saved() {
    refresh();
    if (reloadPending && !reloading) {
      reloading = true;
      // Preference callbacks run after Iubenda stores the choice. A new document
      // removes GA timers/listeners and any already-running Mux Data instance.
      setTimeout(function () { window.location.reload(); }, 0);
    }
  }
  window._iub = window._iub || [];
  window._iub.csConfiguration = ${JSON.stringify(config)};
  // vercel.app is a public suffix; consent cookies must stay on this preview.
  if (window.location.hostname.endsWith(".vercel.app")) {
    window._iub.csConfiguration.localConsentDomainExact = true;
  }
  window._iub.csConfiguration.callback = {
    onReady: refresh,
    onPreferenceExpressedOrNotNeeded: saved,
    onPreferenceChange: function () { queueMicrotask(refresh); },
    onStartupFailed: function () { update("denied"); },
    onFatalError: function () { update("denied"); }
  };
  if (gaId) window["ga-disable-" + gaId] = true;
})();`;
}
