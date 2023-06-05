import { Route, Routes } from 'react-router-dom'
import VosInformations from './VosInformations'

export default function GroupeAmis() {
	return (
		<div className="p-4">
			<Routes>
				{/*<Route path="/" element={<Commencer />} />*/}
				<Route path="/" element={<VosInformations />} />
			</Routes>
		</div>
	)
}
