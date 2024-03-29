/**
 * webserver.ts
 */
import { delay, serve } from "../../deps_test.ts";

const rawPort: string | number = Deno.args[0] ?? 8080;
const port = Number(rawPort);

const handler = (request: Request): Response => {
  let body = "Your user-agent is:\n\n";
  body += request.headers.get("user-agent") || "Unknown";

  return new Response(body, { status: 200 });
};

console.log(`HTTP webserver running. Access it at: http://localhost:${port}/`);
delay(25000).then(() => {
  Deno.exit(5);
});

await serve(handler, { port });
