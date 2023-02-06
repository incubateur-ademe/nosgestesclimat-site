import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import IllustratedMessage from '../../../components/ui/IllustratedMessage'

export default () => (
	<IllustratedMessage
		emoji="⚠️"
		message={
			<>
				<p>
					<Trans i18nKey="publicodes.conference.Survey.notCreatedWarning1">
						Attention, il n'existe aucun ce sondage à cette adresse. Pour lancer
						un sondage, l'organisateur doit d'abord le créer sur la page du{' '}
						<Link to="/groupe">mode groupe</Link>.
					</Trans>
				</p>
				<p>
					💡{' '}
					<Trans i18nKey="publicodes.conference.Survey.notCreatedWarning2">
						Peut-être avez-vous fait une faute de frappe dans l'adresse du
						sondage ? Pensez notamment à bien respecter les majuscules, à copier
						coller l'adresse exacte ou à utiliser le QR code.
					</Trans>
				</p>
			</>
		}
		backgroundcolor={'var(--lighterColor)'}
	/>
)
