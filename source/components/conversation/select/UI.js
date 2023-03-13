import styled from 'styled-components'

export const Mosaic = styled.ul`
	display: flex;
	flex-direction: column;
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
		width: 100%;
		min-height: initial;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0.3rem;
		margin: 0.3rem 0;
	}

	@media (min-width: 600px) {
		flex-direction: row;
		> li {
			width: 48%;
			padding: 0.6rem;
			margin: 0.3rem 0;
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

export function MosaicItemLabel({
	question,
	title,
	icônes,
	description,
	isNotActive,
}) {
	return (
		<div
			css={`
				display: flex;
				flex-direction: column;
				align-items: flex-start;
			`}
		>
			<MosaicLabel htmlFor={question.dottedName} isNotActive={isNotActive}>
				<span
					css={`
						font-size: 100%;
						margin-right: 0.3rem;
					`}
				>
					{icônes}
				</span>
				{title}
			</MosaicLabel>
			<p
				id={'description ' + title}
				css={`
					text-align: left !important;
				`}
			>
				{description && description.split('\n')[0]}
			</p>
		</div>
	)
}

export const mosaicLabelStyle = `
	text-align: left;
	line-height: 1.2rem;
	margin-top: 0.6rem;
	margin-bottom: 0.4rem;
	font-weight: bold;
`
const MosaicLabel = styled.label`
	${({ isNotActive }) => (isNotActive ? 'opacity: 0.75;' : '')}
	${mosaicLabelStyle}
`
