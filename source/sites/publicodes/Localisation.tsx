import { useState } from 'react'
import useLocalisation, { sampleIps } from '../../components/useLocalisation'
import emoji from 'react-easy-emoji'

export default () => {
	const [chosenIp, chooseIp] = useState()
	const localisation = useLocalisation(chosenIp)

	return (
		<div>
			<h2>{emoji('📍')} Pays de simulation</h2>
			{localisation != null ? (
				<p>
					Nous avons détecté que vous faites cette simulation depuis la{' '}
					<img
						src={localisation.country_flag}
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
					{Object.entries(sampleIps).map(([country, ip]) => (
						<li key={country} onClick={() => chooseIp(ip)}>
							<button>{country}</button>
						</li>
					))}
				</ul>
			</details>
		</div>
	)
}
