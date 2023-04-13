import content from 'raw-loader!./texte.md'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import {
	resetIntroTutorial,
	resetSimulation,
	skipTutorial,
} from '../../../actions/actions'
import { Markdown } from '../../../components/utils/markdown'
import { rehydrateDetails } from '../fin'
import FriendlyObjectViewer from '../pages/FriendlyObjectViewer'
import ReturnToEnquêteButton from './ReturnToEnquêteButton'

export default () => {
	const dispatch = useDispatch()
	const enquête = useSelector((state) => state.enquête)
	const paramUserID = useParams().userID
	const [searchParams] = useSearchParams(),
		searchParamsObject = Object.fromEntries(searchParams)

	console.log('SP', searchParamsObject, searchParams)
	useEffect(() => {
		if (!enquête) {
			// TODO reset simulation, use the next PR to do so without erasing the old one
			const userID = paramUserID || uuidv4()
			dispatch({ type: 'SET_ENQUÊTE', userID, date: new Date().toString() })
			dispatch(resetSimulation())
			dispatch(skipTutorial('scoreAnimation', true))
			dispatch(skipTutorial('scoreExplanation', true))
			dispatch(resetIntroTutorial())
		}
	}, [])
	return (
		<div css="max-width: 750px">
			<Markdown>{content}</Markdown>
			<ReturnToEnquêteButton />

			<div>
				<Link to="/simulateur/bilan">
					<button className="ui__ button cta">Commencer le parcours</button>
				</Link>
			</div>
			{searchParamsObject['details'] && (
				<>
					<h2 css="background: yellow">Phase de dev du parcours enquête</h2>
					<FriendlyObjectViewer data={searchParamsObject} />
					<p>
						Pour décoder le paramètre "details", qui représente le score de
						simulation décliné sur chaque catégorie, il faut utiliser la
						fonction{' '}
						<a href="https://github.com/datagir/nosgestesclimat-site/blob/master/source/sites/publicodes/fin/index.tsx#L21">
							rehydrateDetails
						</a>
						. Voici le résultat. Chaque variable est définie dans la
						documentation intéractive du site, disponible{' '}
						<Link to="/documentation">ici</Link>, avec un moteur de recherche.
					</p>
					<FriendlyObjectViewer
						data={rehydrateDetails(searchParamsObject['details'])}
					/>
					<p>
						Les lettres correspondent à la première lettre des catégories
						listées{' '}
						<Link to="/documentation/bilan">
							ici sur la documentation de la variable bilan
						</Link>
					</p>
				</>
			)}
		</div>
	)
}
