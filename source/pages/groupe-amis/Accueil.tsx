import { AppState } from '@/reducers/rootReducer'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Title from '../../components/groupe/Title'
import ButtonLink from './components/ButtonLink'
import Container from './components/Container'
import GroupList from './components/GroupList'
import Separator from './components/Separator'

export default function Accueil() {
	const { t } = useTranslation()
	const groups = useSelector((state: AppState) => state.groups)

	return (
		<>
			<Title
				title={t("Groupe d'amis")}
				subtitle={t(
					'Comparez vos résultats avec votre famille ou un groupe d’amis'
				)}
			/>

			{groups && groups.length === 0 && (
				<Container className="mt-7 bg-gray-100 p-4">
					<h2 className="text-md font-medium mb-2">
						<Trans>Créez votre premier groupe</Trans>
					</h2>
					<p className="text-sm mb-6">
						Invitez vos proches pour comparer vos résultats. Ça prend{' '}
						<strong className="text-red-600">1 minute</strong> !
					</p>
					<ButtonLink href={'vos-informations'}>
						<Trans>Commencer</Trans>
					</ButtonLink>
				</Container>
			)}

			{groups && groups.length > 0 && (
				<>
					<GroupList groups={groups} className="mt-8" />
					<Separator className="mb-4 mt-8" />
					<h3 className="text-md font-bold mb-1">
						<Trans>Créez un autre groupe</Trans>
					</h3>
					<p className="text-sm mb-6">
						Vous pouvez créer un nouveau groupe avec d’autres amis.
					</p>
					<ButtonLink href={'vos-informations'} color="secondary">
						<Trans>Créer un autre groupe</Trans>
					</ButtonLink>
				</>
			)}
		</>
	)
}
