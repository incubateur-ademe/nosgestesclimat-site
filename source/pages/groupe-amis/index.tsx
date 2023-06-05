import { Route, Routes } from 'react-router-dom'
import Commencer from './Commencer'
import InformationsGroupe from './InformationsGroupe'
import InvitezVosProches from './InvitezVosProches'
import VosInformations from './VosInformations'

export default function GroupeAmis() {
	return (
		<div className="p-4">
			<Routes>
				<Route path="vos-informations" element={<VosInformations />} />
				<Route path="informations-de-groupe" element={<InformationsGroupe />} />

				<Route path="inviter-vos-proches" element={<InvitezVosProches />} />

				<Route index element={<Commencer />} />
			</Routes>
		</div>
	)
}
