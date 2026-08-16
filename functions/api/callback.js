function getCookie(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  const part = cookie.split(";").map(x => x.trim()).find(x => x.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.slice(name.length + 1)) : null;
}

function responsePage(origin, status, payload) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>GitHub authorization</title></head>
<body>
<script>
(() => {
  const allowedOrigin = ${JSON.stringify(origin)};
  const finalMessage = ${JSON.stringify(message)};
  function receiveMessage(event) {
    if (event.origin !== allowedOrigin) return;
    window.opener.postMessage(finalMessage, allowedOrigin);
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  if (window.opener) window.opener.postMessage("authorizing:github", allowedOrigin);
})();
</script>
</body></html>`;
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const origin = url.origin;

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return new Response("GitHub OAuth secrets are not configured.", { status: 500 });
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = getCookie(request, "decap_oauth_state");

  if (!code || !state || !expectedState || state !== expectedState) {
    return new Response(responsePage(origin, "error", { message: "Invalid OAuth state." }), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=UTF-8", "Cache-Control": "no-store" }
    });
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "sergio-portfolio-decap-oauth"
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${origin}/api/callback`
    })
  });

  const result = await tokenResponse.json();
  if (!tokenResponse.ok || result.error || !result.access_token) {
    return new Response(responsePage(origin, "error", result), {
      status: 401,
      headers: { "Content-Type": "text/html; charset=UTF-8", "Cache-Control": "no-store" }
    });
  }

  return new Response(responsePage(origin, "success", {
    token: result.access_token,
    provider: "github"
  }), {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "no-store",
      "Set-Cookie": "decap_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
    }
  });
}
