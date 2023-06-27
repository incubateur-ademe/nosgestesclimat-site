import { Route, Routes } from 'react-router-dom'
import { DataProvider } from './contexts/DataContext'
import InformationsGroupe from './InformationsGroupe'
import InvitezVosProches from './InvitezVosProches'
import VosInformations from './VosInformations'

export default function GroupeAmis() {
	return (
		<DataProvider>
			<div className="p-4 md:p-8">
				<Routes>
					<Route path="vos-informations" element={<VosInformations />} />
					<Route
						path="informations-de-groupe"
						element={<InformationsGroupe />}
					/>

					<Route path="inviter-vos-proches" element={<InvitezVosProches />} />
				</Routes>
			</div>
		</DataProvider>
	)
}
