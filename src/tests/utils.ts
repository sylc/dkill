/**
 * webserver.ts
 */
import { serve } from "https://deno.land/std@0.86.0/http/server.ts";

const server1 = serve({ hostname: "0.0.0.0", port: 8080 });
console.log(`HTTP webserver1 running on port :8080`, Deno.build.os);

const server2 = serve({ hostname: "0.0.0.0", port: 3000 });
console.log(`HTTP webserver1 running on port :3000`, Deno.build.os);

for await (const request of server1) {
  let bodyContent = "Your user-agent is:\n\n";
  bodyContent += request.headers.get("user-agent") || "Unknown";

  request.respond({ status: 200, body: bodyContent });
}

for await (const request of server2) {
  let bodyContent = "Your user-agent is:\n\n";
  bodyContent += request.headers.get("user-agent") || "Unknown";

  request.respond({ status: 200, body: bodyContent });
}

// deno run -A ./src/tests/utils.ts
