const GAS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwtjBQDtZ_z7XjR1NPLeGYMPKzbHSYr0qxvCsPIL0wwoa8br_MkDzRbrV9WlnkPSuM2/exec";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://hubspot-form.pages.dev",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequest(context) {
  const { request } = context;
  const { method } = request;

  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  const bodyText = await request.text();

  const gasRes = await fetch(GAS_ENDPOINT, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: method === "GET" ? undefined : bodyText,
  });

  const resText = await gasRes.text();
  const headers = new Headers(CORS_HEADERS);
  headers.set(
    "Content-Type",
    gasRes.headers.get("Content-Type") || "application/json"
  );

  return new Response(resText, {
    status: gasRes.status,
    headers,
  });
}
