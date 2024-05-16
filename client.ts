import { HttpClient } from "@effect/platform";
import * as Http from "@effect/platform/HttpClient";
import { Resolver } from "@effect/rpc";
import { HttpResolver } from "@effect/rpc-http";
import { Console, Effect, Stream } from "effect";
import { Counts, type CountsRouter } from "./server";

const client = HttpResolver.make<CountsRouter>(
  HttpClient.client.fetchOk.pipe(
    Http.client.mapRequest(Http.request.prependUrl("http://localhost:3000/rpc"))
  )
).pipe(Resolver.toClient);

await client(new Counts()).pipe(
  Stream.runForEach((n) => Console.log(n)),
  Effect.zipLeft(Effect.never, { concurrent: true }),
  Effect.timeout("1 second"),
  Effect.runPromise
);
