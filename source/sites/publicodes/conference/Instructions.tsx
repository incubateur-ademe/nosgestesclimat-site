import Button from '@/components/groupe/Button'
import ButtonLink from '@/components/groupe/ButtonLink'
import { Trans } from 'react-i18next'

/* The conference mode can be used with two type of communication between users : P2P or database. The P2P mode was implemented first, then we decided that we needed a survey mode, with permanent data. But YJS is not yet designed plug and play for persistence, hence our survey mode will be implemented using Supabase/Postgre.
 *
 * However, the database mode for Conference could still be usefull for restricted networks (e.g. entreprise) where P2P is forbidden. We could then have a server handling the yjs-websocket server. It could crash without any persistence garantee : some users would have the backup anyway (rehydratation in case of server crash to be tested).
 *
 * */

export default () => {
	return (
		<div>
			<Trans>
				<p>
				Vous souhaitez réaliser une enquête sur le bilan carbone de votre organisation ? Un nouveau mode sondage est disponible. 
				</p>
			</Trans>
			<br/>
			<ButtonLink
				href='https://nosgestesclimat.fr/organisations?mtm_campaign=sondages.nosgestesclimat.fr'
			>
				✨ Accéder au nouveau mode organisation
			</ButtonLink>
		</div>
	)
}