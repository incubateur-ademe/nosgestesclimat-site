import ButtonLink from '@/components/groupe/ButtonLink'
import Separator from '@/components/groupe/Separator'
import { Group } from '@/types/groups'
import { Trans } from 'react-i18next'
import GroupList from './GroupList'

export default function CreateOtherGroupsSection({
	groups,
}: {
	groups: Group[]
}) {
	return (
		<>
			<GroupList groups={groups} className="mt-8" />

			<Separator className="mb-4 mt-8" />

			<h3 className="text-md font-bold mb-1">
				<Trans>Créez un autre groupe</Trans>
			</h3>

			<p className="text-sm mb-6">
				Vous pouvez créer un nouveau groupe avec d’autres amis.
			</p>

			<ButtonLink
				href={'/groupes/creer'}
				color="secondary"
				data-cypress-id="button-create-other-group"
			>
				<Trans>Créer un autre groupe</Trans>
			</ButtonLink>
		</>
	)
}
