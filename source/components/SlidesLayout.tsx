import { range } from 'ramda'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { IframeOptionsContext } from './utils/IframeOptionsProvider'

export default ({ children, length, active }) => {
	const { isIframe } = useContext(IframeOptionsContext)
	const slides = length && range(0, length)
	const { t } = useTranslation()

	return (
		<>
			{length && (
				<Ol
					title={t('Progression dans les diapo')}
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
								${i === active && 'background: var(--color)'}
							`}
						></li>
					))}
				</Ol>
			)}
			<Container isIframe={isIframe} slide={active + 1}>
				<MainContent>{children}</MainContent>
			</Container>
		</>
	)
}

const MainContent = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`

const Container = styled.div<{ isIframe?: boolean; slide: number }>`
	height: fit-content;
	${(props) => props.isIframe && 'height: 45rem !important;'}
	position: relative;
`

const Ol = styled.ol`
	@media (min-height: 800px) {
		display: flex;
	}

	display: none;
	padding: 1rem;
	list-style-type: none;
	justify-content: center;
	padding-bottom: 0 !important;
`
