import { getFlag, RegionCode } from './utils'

export default ({ code }: { code?: RegionCode }) => {
	if (!code) {
		return null
	}
	const flagSrc = getFlag(code)

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
