import { range } from 'ramda'
import { useContext } from 'react'
import styled from 'styled-components'
import { IframeOptionsContext } from './utils/IframeOptionsProvider'

export default ({ children, length, active }) => {
	const { isIframe } = useContext(IframeOptionsContext)
	const slides = length && range(0, length)
	return (
		<Container isIframe={isIframe}>
			{length && (
				<ol
					title="Progression dans les diapo"
					role="progressbar"
					aria-valuenow={active + 1}
					aria-valuemin="1"
					aria-valuemax={slides.length}
				>
					{slides.map((_, i) => (
						<li
							key={i}
							aria-current={i === active ? 'step' : null}
							css={`
								height: 1rem;
								width: 1rem;
								background: lightgray;
								border-radius: 1rem;
								margin: 0.1rem;
								${i === active && `background: var(--color)`}
							`}
						></li>
					))}
				</ol>
			)}
			<MainContent>{children}</MainContent>
		</Container>
	)
}

const MainContent = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`

const Container = styled.div`
	height: 70vh;
	@media (max-width: 800px) {
		height: 95vh;
	}
	@media (min-aspect-ratio: 1280/700) {
		height: 95vh;
	}
	${(props) => props.isIframe && `height: 45rem !important;`}
	position: relative;
	> ol {
		@media (min-height: 800px) {
			display: flex;
		}

		margin-top: 1rem;
		display: none;
		list-style-type: none;
		justify-content: center;
	}
`
