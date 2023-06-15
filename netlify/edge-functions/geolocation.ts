/* eslint-disable @typescript-eslint/require-await */
import type { Config, Context } from 'https://edge.netlify.com/'

// deno-lint-ignore require-await
export default async (request: Request, context: Context) => {
	return context.json({
		geo: context.geo,
		header: request.headers.get('x-nf-geo'),
	})
}

export const config: Config = {
	path: '/geolocation',
}
