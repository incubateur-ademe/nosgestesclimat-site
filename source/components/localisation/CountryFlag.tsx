import { RegionCode, useFlag } from './utils'

export default ({ code }: { code?: RegionCode }) => {
	const flagSrc = useFlag(code)

	return (
		<img
			src={flagSrc}
			aria-hidden="true"
			css={`
				height: 1rem;
				margin: 0 0.3rem;
				vertical-align: sub;
			`}
		/>
	)
}
