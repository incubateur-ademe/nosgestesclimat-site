import { useState } from 'react'
import useLocalisation, { sampleIps } from '../../components/useLocalisation'

export default () => {
	const [chosenIp, chooseIp] = useState()
	const localisation = useLocalisation(chosenIp)

	return (
		<div>
			<h1>Pays de simulation</h1>
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
			<p>Choisir un autre pays</p>
			<ul>
				{Object.entries(sampleIps).map(([country, ip]) => (
					<li key={country} onClick={() => chooseIp(ip)}>
						{country}
					</li>
				))}
			</ul>
		</div>
	)
}
