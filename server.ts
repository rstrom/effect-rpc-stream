import * as Http from "@effect/platform/HttpServer";
import { Router, Rpc } from "@effect/rpc";
import { HttpRouter } from "@effect/rpc-http";
import * as S from "@effect/schema/Schema";
import { Console, Effect, Stream } from "effect";

export class Counts extends Rpc.StreamRequest<Counts>()(
  "Counts",
  S.Never,
  S.Number,
  {}
) {}

export type CountsRouter = typeof router;

const router = Router.make(
  Rpc.stream(Counts, () =>
    Stream.make(1, 2, 3, 4, 5).pipe(Stream.tap((_) => Effect.sleep(10)))
  )
);

const handler = Router.toHandler(router);

handler([
  {
    request: { _tag: "Counts" },
    traceId: "traceId",
    spanId: "spanId",
    sampled: true,
    headers: {},
  },
]).pipe(
  Stream.runForEach((n) => Console.log(n)),
  Effect.runFork
);

export const App = Http.router.empty.pipe(
  Http.router.post("/rpc", HttpRouter.toHttpApp(router))
);
