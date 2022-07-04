import { utils } from 'publicodes'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import tinygradient from 'tinygradient'
import Title from '../../components/Title'
import Meta from '../../components/utils/Meta'
import Action from './Action'
import ActionPlus from './ActionPlus'
import ActionsList from './ActionsList'
import ScoreBar from './ScoreBar'
import ListeActionPlus from './ListeActionPlus'

const { encodeRuleName, decodeRuleName } = utils

const gradient = tinygradient(['#0000ff', '#ff0000']),
	colors = gradient.rgb(20)

export default ({}) => {
	return (
		<>
			<Meta
				title="Passer à l'action"
				description="Découvrez les gestes qui vous permettent de réduire votre empreinte climat"
			/>
			<Title>Agir</Title>
			<ScoreBar actionMode />
			<Routes>
				<Route path="/actions/plus" element={<ListeActionPlus />} />
				<Route path="/actions/plus/:encodedName" element={<ActionPlus />} />
				<Route path="/actions/liste" element={<ActionsList display="list" />} />
				<Route path="/actions/:encodedName" element={<Action />} />

				<Route path="/actions" element={<ActionsList display="list" />} />
			</Routes>
		</>
	)
}
