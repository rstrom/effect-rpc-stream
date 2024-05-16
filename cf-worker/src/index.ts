import { HttpClient } from '@effect/platform';
import * as Http from '@effect/platform/HttpClient';
import { Resolver, Router, Rpc } from '@effect/rpc';
import { HttpResolver } from '@effect/rpc-http';
import * as S from '@effect/schema/Schema';
import { Console, Effect, Stream } from 'effect';

const client = HttpResolver.make<Router.Router<Counts, never>>(
	HttpClient.client.fetchOk.pipe(Http.client.mapRequest(Http.request.prependUrl('http://localhost:3000/rpc')))
).pipe(Resolver.toClient);

class Counts extends Rpc.StreamRequest<Counts>()('Counts', S.Never, S.Number, {}) {}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		await client(new Counts()).pipe(
			Stream.runForEach((n) => Console.log(n)),
			Effect.zipLeft(Effect.never, { concurrent: true }),
			Effect.timeout('2 seconds'),
			Effect.runPromise
		);

		return new Response('Hello World!');
	},
};
