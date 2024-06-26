/**
 * webserver.ts
 */
import { delay } from "../../deps_test.ts";

const rawPort: string | number = Deno.args[0] ?? 8080;
const port = Number(rawPort);

const handler = (request: Request): Response => {
  let body = "Your user-agent is:\n\n";
  body += request.headers.get("user-agent") || "Unknown";

  return new Response(body, { status: 200 });
};

console.log(`HTTP webserver running. Access it at: http://localhost:${port}/`);
delay(55000).then(() => {
  console.log("test server timed out");
  Deno.exit(5);
});

Deno.serve({ port }, handler);
