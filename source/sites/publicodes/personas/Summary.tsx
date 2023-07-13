import { Markdown } from '@/components/utils/markdown'
import { Trans } from 'react-i18next'
import { Persona } from '../Personas'

export default ({ persona }: { persona: Persona }) => {
	return (
		<div>
			<h2>
				<Trans>Description:</Trans>
			</h2>
			<Markdown children={persona?.description} />
		</div>
	)
}
