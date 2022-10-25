import { Trans } from 'react-i18next'
import styled from 'styled-components'
import animate from './ui/animate'

export default () => {
	return (
		<animate.appear>
			<AlertBanner>
				<p>
					⚠️{' '}
					<Trans i18nKey={'components.TranslationAlertBanner.alertMessage'}>
						<strong>
							Cette page a été traduite de façons automatique via DeepL.
						</strong>
					</Trans>{' '}
					⚠️
				</p>
				<p>
					<Trans i18nKey={'components.TranslationAlertBanner.wikiLink'}>
						Veuillez vous reporter au{' '}
						<a
							href="https://github.com/datagir/nosgestesclimat-site/wiki/Translation"
							target="blank"
						>
							wiki
						</a>{' '}
						si vous trouvez une erreur.
					</Trans>
				</p>
			</AlertBanner>
		</animate.appear>
	)
}

const AlertBanner = styled.div`
	background-color: #fff8d3;
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	padding: 10px;
	margin-bottom: 0.6rem;

	@media (min-width: 800px) {
		padding-bottom: 0rem;
	}
`
