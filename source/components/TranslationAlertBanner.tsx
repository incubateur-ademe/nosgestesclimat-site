import { Trans } from 'react-i18next'
import styled from 'styled-components'
import animate from './ui/animate'

export default () => {
	return (
		<animate.appear>
			<AlertBanner>
				<p
					css={`
						margin: 0;
					`}
				>
					<Trans i18nKey={'components.TranslationAlertBanner.wikiLink'}>
						Cette page a <strong>été traduite de façons automatique</strong>. Si
						vous avez une suggestion,{' '}
						<a
							href="https://github.com/datagir/nosgestesclimat-site/wiki/Translation#correction"
							target="blank"
						>
							reportez vous au wiki
						</a>
						.
					</Trans>
				</p>
			</AlertBanner>
		</animate.appear>
	)
}

const AlertBanner = styled.div`
	background-color: #f1f1f9;
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	padding: 0.3rem 0.6rem;
	margin-bottom: 0.6rem;
	border-radius: 0.3rem;

	@media (min-width: 800px) {
		margin: 0;
	}
`
