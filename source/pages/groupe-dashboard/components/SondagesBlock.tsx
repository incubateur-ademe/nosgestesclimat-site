import Separator from '@/components/groupe/Separator'
import { Link } from 'react-router-dom'

export default function SondagesBlock() {
	return (
		<div>
			<Separator className="mb-4 mt-8" />
			<h3 className="text-md font-bold mb-1">
				Entreprises, collectivités, écoles
			</h3>
			<p>
				Les <strong>sondages</strong> et <strong>conférences</strong> vous
				permettent de comparer votre empreinte en direct ou en groupes de plus
				de 20 personnes
			</p>
			<Link className="font-bold" to="/groupe">
				Commencer
			</Link>
		</div>
	)
}
