import NorthstarBanner from '@/components/Feedback/NorthstarBanner'
import Title from '@/components/groupe/Title'
import Meta from '@/components/utils/Meta'
import { Trans, useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import Action from './Action'
import ActionPlus from './ActionPlus'
import ActionsList from './ActionsList'
import ListeActionPlus from './ListeActionPlus'
import ScoreBar from './ScoreBar'

export default () => {
	const { t } = useTranslation()
	return (
		<>
			<Meta
				title={t("Passer à l'action")}
				description={t('meta.pages.actions.description')}
			/>

			<Title title={<Trans>Agir</Trans>} />
			<ScoreBar actionMode />
			<NorthstarBanner type="SET_RATING_ACTION" />
			<Routes>
				<Route path="plus" element={<ListeActionPlus />} />
				<Route path="plus/*" element={<ActionPlus />} />
				<Route path="liste" element={<ActionsList display="list" />} />
				<Route path="*" element={<Action />} />
				<Route path="/" element={<ActionsList display="list" />} />
			</Routes>
		</>
	)
}
