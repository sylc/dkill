/**
 * webserver.ts
 */
import { serve } from "https://deno.land/std@0.86.0/http/server.ts";

const server = serve({ hostname: "0.0.0.0", port: 8080 });
console.log(`HTTP webserver running on port :8080`, Deno.build.os);

for await (const request of server) {
  let bodyContent = "Your user-agent is:\n\n";
  bodyContent += request.headers.get("user-agent") || "Unknown";

  request.respond({ status: 200, body: bodyContent });
}

// deno -A ./src/tests/utils
