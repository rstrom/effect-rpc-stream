import * as Http from "@effect/platform/HttpServer";
import { App } from "./server";

const server = Bun.serve({
  port: 3000,
  fetch(request) {
    const handler = App.pipe(Http.app.toWebHandler);
    const response = handler(request);
    return response;
  },
});
