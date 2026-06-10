(function () {
  if (typeof window === "undefined") {
    return;
  }

  const query = new URLSearchParams(window.location.search);
  const queryOverride = String(query.get("apiBase") || "").trim();
  const savedOverride = String(window.localStorage.getItem("iceEducateApiBase") || "").trim();
  const configuredDefault = "https://iceducation-api-schuwaong.onrender.com";
  const apiBase = queryOverride || savedOverride || window.IC_EDUCATE_API_BASE || configuredDefault;

  window.IC_EDUCATE_API_BASE = apiBase.replace(/\/$/, "");
})();
