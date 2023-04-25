import styled from 'styled-components'

export const LandingLayout = styled.div`
	margin: 0 auto;
	border-radius: 1rem;
	> div > a {
	}
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	min-height: 85vh;
	footer {
		margin-top: auto;
	}
`

export const fluidLayoutMinWidth = '1200px'

export const LandingHeaderWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
	margin-top: 3rem;
	padding: 0.6rem;
	gap: 1rem;
	h1 {
		margin-top: 0.3rem;
		font-size: 220%;
		line-height: 1.1em;
		font-weight: bold;

		color: var(--darkColor);
	}
	p {
		font-size: 110%;
	}
	@media (max-width: ${fluidLayoutMinWidth}) {
		margin-top: 2rem;
		text-align: center;
		h1 {
			font-size: 180%;
		}
	}
	@media (max-height: 600px) {
		/*target iPhone 5 SE and vertically short screens */
		h1 {
			font-size: 160%;
		}
		svg {
			max-width: 12rem !important;
		}
	}
`

export const HeaderCTAs = styled.div`
	margin: 1rem 0;
	> a {
		margin: 0.6rem 1rem 0.6rem 0 !important;
		display: inline-flex !important;
		align-items: center !important;
		> svg,
		img {
			margin-right: 0.4rem;
		}
	}
`

export const HeaderContent = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 36rem;
`
