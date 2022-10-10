import { Context } from 'https://edge.netlify.com'

export default async (request: Request, context: Context) => {
	// Here's what's available on context.geo
	// context: {
	//   geo: {
	//     city?: string;
	//     country?: {
	//       code?: string;
	//       name?: string;
	//     },
	//     subdivision?: {
	//       code?: string;
	//       name?: string;
	//     },
	//   }
	// }

	return context.json({
		geo: context.geo,
		header: request.headers.get('x-nf-geo'),
	})

	// util for tests

	// return context.json({
	// 	geo: { country: { code: 'NL', name: 'Netherlands' } },
	// 	header: '{"country":{"code":"NL","name":"Netherlands"}',
	// })
	// return context.json({
	// 	geo: { country: { code: 'US', name: 'United States' } },
	// 	header: '{"country":{"code":"US","name":"United States"}}',
	// })
	// return context.json({
	// 	geo: { country: { code: 'MQ', name: 'Martinique' } },
	// 	header: '{"country":{"code":"MQ","name":"Martinique"}',
	// })
	// return context.json({
	// 	geo: { country: { code: 'GP', name: 'Guadeloupe' } },
	// 	header: '{"country":{"code":"GP","name":"Guadeloupe"}',
	// })
	// return context.json({
	// 	geo: { country: { code: 'BE', name: 'Belgium' } },
	// 	header: '{"country":{"code":"BE","name":"Belgium"}',
	// })
}
