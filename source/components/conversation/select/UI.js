import styled from 'styled-components'

export const Mosaic = styled.ul`
	display: flex;
	justify-content: space-evenly;
	flex-wrap: wrap;
	padding: 0;
	p {
		text-align: center;
	}

	> li > div > img {
		margin-right: 0.4rem !important;
		font-size: 130% !important;
	}

	> li {
		width: 14rem;
		min-height: 10rem;
		margin: 1rem 0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 1rem;
	}

	@media (max-width: 800px) {
		display: flex;
		flex-direction: column;
		> li {
			width: 100%;
			display: flex;
			flex-direction: row;
			min-height: initial;
			padding: 0.6rem;
			margin: 0.6rem 0;
		}
		figure {
			order: -1;
			margin: 0;
			font-size: 160%;
		}
	}

	> li h4 {
		text-align: center;
		line-height: 1.2rem;
	}
	> li p {
		font-style: italic;
		font-size: 85%;
		line-height: 1.2rem;
	}
`
