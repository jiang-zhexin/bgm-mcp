import { Hono } from "hono";
import { cors } from "hono/cors";
import { StreamableHTTPTransport } from "@hono/mcp";
import { zValidator } from "@hono/zod-validator";
import { sign, jwt } from "hono/jwt";
import { jsxRenderer } from "hono/jsx-renderer";
import { Style } from "hono/css";

import { z } from "zod/v4";
import { env } from "cloudflare:workers";
import { v0_client, mcpServer } from "./mcp";
import { access_token_zod } from "./utils";
import {
  globalStyles,
  container,
  title,
  description,
  button,
  copyButton,
  details,
  tokenBox,
  tokenContainer,
} from "./css";

const app = new Hono();

app.use(
  cors({
    origin: "*",
    allowMethods: ["POST", "OPTIONS"],
  })
);

app.use(
  jsxRenderer(({ children }) => {
    return (
      <html lang="zh">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Bangumi MCP Server</title>
          <Style />
          <style>{globalStyles}</style>
        </head>
        <body>
          <div class={container}>{children}</div>
        </body>
      </html>
    );
  })
);

app.get("/", async (c) => {
  return c.render(
    <div>
      <h1 class={title}>Bangumi MCP Server</h1>
      <p class={description}>
        这是一个非官方的 Bangumi MCP 服务！它是对
        <a href="https://bangumi.github.io/api/" target="_blank">
          Bangumi API
        </a>
        的 MCP 封装。
        <br />
        Endpoint：
        <code>{new URL("/mcp", env.APP_URL).toString()}</code>
        <br />
        点击下方按钮开始授权，即可使 LLM 管理你的 Bangumi 信息。
      </p>
      <a href="/authorize" class={button}>
        开始授权
      </a>
    </div>
  );
});

app.get(
  "/token",
  zValidator("query", z.object({ code: z.string() })),
  async (c) => {
    const { code } = c.req.valid("query");
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: env.APP_ID,
      client_secret: env.APP_SECRET,
      code: code,
      redirect_uri: new URL("/token", env.APP_URL).toString(),
    });
    const resp = await fetch("https://bgm.tv/oauth/access_token", {
      method: "POST",
      body: body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    if (resp.status !== 200) {
      console.log(await resp.text());
      return c.newResponse(null, 403);
    }
    const { access_token, expires_in, user_id, ...result } =
      access_token_zod.parse(await resp.json());
    const now = (Date.now() / 1e3) | 0;
    const token = await sign(
      {
        exp: now + expires_in,
        iss: "bgm-mcp",
        acc: access_token,
      },
      env.JWT_SECRET
    );
    return c.render(
      <div class={tokenContainer}>
        <h2 class={title}>授权成功</h2>
        <p>你的 token 是：</p>
        <div class={tokenBox}>
          <code id="token-content">{token}</code>
          <button
            class={copyButton}
            onclick="navigator.clipboard.writeText(document.getElementById('token-content').textContent)"
          >
            复制
          </button>
        </div>
        <details class={details}>
          <summary>如何使用这个 token？</summary>
          <p>现在你可以像这样使用它</p>
          <pre>
            POST /mcp HTTP/1.1
            <br />
            Authorization: Bearer {token.slice(0, 10)}...
          </pre>
          <p>请注意这个 token 的有效期只有 7 天，过期后需要重新授权</p>
        </details>
      </div>
    );
  }
);

app.post(
  "/mcp",
  jwt({
    secret: env.JWT_SECRET,
    verification: { iss: "bgm-mcp" },
  }),
  async (c) => {
    const payload = c.get("jwtPayload");
    v0_client.use({
      onRequest: ({ request }) => {
        request.headers.set("Authorization", `Bearer ${payload.acc}`);
        return request;
      },
    });
    const transport = new StreamableHTTPTransport();
    await mcpServer.connect(transport);
    return transport.handleRequest(c);
  }
);

app.get("/authorize", async (c) => {
  const url = new URL("https://bgm.tv/oauth/authorize");
  url.searchParams.set("client_id", env.APP_ID);
  url.searchParams.set("response_type", "code");
  return c.redirect(url);
});

export default app;
