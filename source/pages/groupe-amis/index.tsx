import { Trans, useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import ButtonLink from './components/ButtonLink'
import Container from './components/Container'
import Title from './components/Title'

export default function GroupeAmis() {
	const { t } = useTranslation()
	return (
		<div className="p-4">
			<Routes>
				<Route
					path="/"
					element={
						<>
							<Title
								title={t("Groupe d'amis")}
								subtitle={t(
									'Comparez vos résultats avec votre famille ou un groupe d’amis'
								)}
							/>
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
						</>
					}
				/>
			</Routes>
		</div>
	)
}
