import { Route, Routes } from 'react-router-dom'
import Title from '../../components/Title'
import Meta from '../../components/utils/Meta'
import Action from './Action'
import ActionPlus from './ActionPlus'
import ActionsList from './ActionsList'
import ScoreBar from './ScoreBar'
import ListeActionPlus from './ListeActionPlus'
import { Trans } from 'react-i18next'

export default ({ t }) => {
	return (
		<>
			<Meta
				title={t("Passer à l'action")}
				description={t('meta.pages.actions.description')}
			/>
			<Title>
				<Trans>Agir</Trans>
			</Title>
			<ScoreBar actionMode />
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
