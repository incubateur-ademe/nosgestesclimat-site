import { useState } from 'react'
import useLocalisation, {
	getFlagImgSrc,
	supportedCountries,
} from '../../components/useLocalisation'
import emoji from 'react-easy-emoji'
import { capitalise0 } from '../../utils'
import { usePersistingState } from '../../components/utils/persistState'
import { setLocalisation } from '../../actions/actions'
import { useDispatch } from 'react-redux'

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
							vertical-align: middle;
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
			</details>
		</div>
	)
}
