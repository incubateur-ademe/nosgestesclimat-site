import supportedCountries from 'Components/localisation/supportedCountries.yaml'
import useLocalisation, {
	getFlagImgSrc,
} from 'Components/localisation/useLocalisation'
import emoji from 'react-easy-emoji'
import { useDispatch } from 'react-redux'
import { setLocalisation } from '../../actions/actions'
import { usePersistingState } from '../../components/utils/persistState'
import { capitalise0 } from '../../utils'
import IllustratedMessage from '../ui/IllustratedMessage'
import NewTabSvg from '../utils/NewTabSvg'

export default () => {
	const [chosenIp, chooseIp] = usePersistingState('IP', undefined)
	const localisation = useLocalisation(chosenIp)
	const dispatch = useDispatch()

	return (
		<div>
			<h2>{emoji('📍')} Pays de simulation</h2>
			{localisation != null ? (
				<p>
					Nous avons détecté que vous faites cette simulation depuis la{' '}
					<img
						src={getFlagImgSrc(localisation?.country.code)}
						aria-hidden="true"
						css={`
							height: 1rem;
							margin: 0 0.3rem;
							vertical-align: sub;
						`}
					/>
					{localisation.country_name}.
				</p>
			) : (
				<p>Nous n'avons pas pu détecter votre pays de simulation. </p>
			)}
			<details>
				<summary>Choisir un autre pays</summary>
				<ul>
					{supportedCountries.map(({ name, code, PR }) => (
						<li
							key={code}
							onClick={() =>
								dispatch(setLocalisation({ country: { name, code } }))
							}
						>
							<button>{capitalise0(name)}</button>
						</li>
					))}
				</ul>
				<IllustratedMessage
					emoji="🌐"
					message={
						<div>
							<p>
								Envie de contribuer à une version pour votre région ?{' '}
								<a
									target="_blank"
									href="https://github.com/datagir/nosgestesclimat/blob/master/INTERNATIONAL.md"
								>
									Suivez le guide !
									<NewTabSvg />
								</a>
							</p>
						</div>
					}
				/>
			</details>
		</div>
	)
}
