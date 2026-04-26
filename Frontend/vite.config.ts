import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite"; // <-- ADD THIS IMPORT
import http from "node:http";
import https from "node:https";
import type { IncomingMessage, ServerResponse } from "node:http";

const USERS_TABLE_PROXY_PATH = "/__internal/admin/users-table";
const USERS_TABLE_TARGET = new URL(
  "/Admin/Users-Table",
  process.env.VITE_API_BASE_URL || "http://localhost:5199",
);

const readRequestBody = (req: IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });

    req.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });

    req.on("error", reject);
  });

const sendJson = (
  res: ServerResponse,
  statusCode: number,
  payload: Record<string, unknown>,
) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

const proxyUsersTableRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  try {
    const rawBody = await readRequestBody(req);
    const requestBody = rawBody || "{}";

    try {
      JSON.parse(requestBody);
    } catch {
      sendJson(res, 400, {
        message: "Users-Table proxy received invalid JSON.",
      });
      return;
    }

    const transport = USERS_TABLE_TARGET.protocol === "https:" ? https : http;
    const proxyRequest = transport.request(
      {
        protocol: USERS_TABLE_TARGET.protocol,
        hostname: USERS_TABLE_TARGET.hostname,
        port: USERS_TABLE_TARGET.port,
        method: "GET",
        path: `${USERS_TABLE_TARGET.pathname}${USERS_TABLE_TARGET.search}`,
        headers: {
          Accept: req.headers.accept || "application/json",
          Authorization: req.headers.authorization || "",
          Cookie: req.headers.cookie || "",
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(requestBody),
        },
      },
      (proxyResponse) => {
        res.statusCode = proxyResponse.statusCode || 502;

        Object.entries(proxyResponse.headers).forEach(([headerName, headerValue]) => {
          if (headerValue !== undefined) {
            res.setHeader(headerName, headerValue);
          }
        });

        proxyResponse.pipe(res);
      },
    );

    proxyRequest.on("error", (error) => {
      if (!res.headersSent) {
        sendJson(res, 502, {
          message: "Failed to proxy Users-Table request.",
          errors: [error.message],
        });
      }
    });

    proxyRequest.write(requestBody);
    proxyRequest.end();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected proxy error.";

    if (!res.headersSent) {
      sendJson(res, 500, {
        message,
      });
    }
  }
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "users-table-dev-proxy",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url !== USERS_TABLE_PROXY_PATH || req.method !== "POST") {
            next();
            return;
          }

          await proxyUsersTableRequest(req, res);
        });
      },
    },
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      "vaul@1.1.2": "vaul",
      "sonner@2.0.3": "sonner",
      "recharts@2.15.2": "recharts",
      "react-resizable-panels@2.1.7": "react-resizable-panels",
      "react-hook-form@7.55.0": "react-hook-form",
      "react-day-picker@8.10.1": "react-day-picker",
      "next-themes@0.4.6": "next-themes",
      "lucide-react@0.487.0": "lucide-react",
      "input-otp@1.4.2": "input-otp",
      "embla-carousel-react@8.6.0": "embla-carousel-react",
      "cmdk@1.1.1": "cmdk",
      "class-variance-authority@0.7.1": "class-variance-authority",
      "@radix-ui/react-tooltip@1.1.8": "@radix-ui/react-tooltip",
      "@radix-ui/react-toggle@1.1.2": "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group@1.1.2": "@radix-ui/react-toggle-group",
      "@radix-ui/react-tabs@1.1.3": "@radix-ui/react-tabs",
      "@radix-ui/react-switch@1.1.3": "@radix-ui/react-switch",
      "@radix-ui/react-slot@1.1.2": "@radix-ui/react-slot",
      "@radix-ui/react-slider@1.2.3": "@radix-ui/react-slider",
      "@radix-ui/react-separator@1.1.2": "@radix-ui/react-separator",
      "@radix-ui/react-select@2.1.6": "@radix-ui/react-select",
      "@radix-ui/react-scroll-area@1.2.3": "@radix-ui/react-scroll-area",
      "@radix-ui/react-radio-group@1.2.3": "@radix-ui/react-radio-group",
      "@radix-ui/react-progress@1.1.2": "@radix-ui/react-progress",
      "@radix-ui/react-popover@1.1.6": "@radix-ui/react-popover",
      "@radix-ui/react-navigation-menu@1.2.5":
        "@radix-ui/react-navigation-menu",
      "@radix-ui/react-menubar@1.1.6": "@radix-ui/react-menubar",
      "@radix-ui/react-label@2.1.2": "@radix-ui/react-label",
      "@radix-ui/react-hover-card@1.1.6": "@radix-ui/react-hover-card",
      "@radix-ui/react-dropdown-menu@2.1.6": "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-dialog@1.1.6": "@radix-ui/react-dialog",
      "@radix-ui/react-context-menu@2.2.6": "@radix-ui/react-context-menu",
      "@radix-ui/react-collapsible@1.1.3": "@radix-ui/react-collapsible",
      "@radix-ui/react-checkbox@1.1.4": "@radix-ui/react-checkbox",
      "@radix-ui/react-avatar@1.1.3": "@radix-ui/react-avatar",
      "@radix-ui/react-aspect-ratio@1.1.2": "@radix-ui/react-aspect-ratio",
      "@radix-ui/react-alert-dialog@1.1.6": "@radix-ui/react-alert-dialog",
      "@radix-ui/react-accordion@1.2.3": "@radix-ui/react-accordion",
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    outDir: "build",
  },
  server: {
    port: 3000,
    open: true,
  },
});
