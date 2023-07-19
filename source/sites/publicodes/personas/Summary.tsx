import { Markdown } from '@/components/utils/markdown'
import { Persona } from '@/sites/publicodes/personas/personasUtils'
import { Trans } from 'react-i18next'

export default ({ persona }: { persona: Persona }) => {
	return persona.description !== undefined ? (
		<div>
			<h2>
				<Trans>Description</Trans>
				{':'}
			</h2>
			<Markdown>{persona.description}</Markdown>
		</div>
	) : null
}
