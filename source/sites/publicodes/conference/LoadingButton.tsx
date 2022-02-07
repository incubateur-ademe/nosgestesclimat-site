import { motion } from 'framer-motion'
import { useState } from 'react'
import { useHistory } from 'react-router'
import useDatabase, { surveysURL } from './useDatabase'

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const existsCode = '23505'
export default ({ mode, URLPath, room }) => {
	const [clicked, setClicked] = useState(false)
	const [text, setText] = useState(null)

	const history = useHistory()

	const actionImg = '/images/2714.svg'

	const database = useDatabase()

	const [survey, setSurvey] = useState(null)

	return (
		<div>
			<button
				type="submit"
				className="ui__ button plain"
				onClick={async () => {
					setClicked(true)

					if (mode === 'conférence') {
						return setTimeout(() => history.push(URLPath), 3000)
					}
					const request = await fetch(surveysURL, {
						method: 'POST',
						body: JSON.stringify({ room }),
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
					})
					if (!request.ok) {
						if (request.status === 409) {
							setText('Ce sondage existe déjà')
							return setTimeout(() => {
								history.push(URLPath)
							}, 3000)
						} else {
							throw Error('Erreur inconue.')
						}
					}

					const newSurvey = await request.json()
					setText('Sondage créé')

					return setTimeout(() => {
						history.push(URLPath)
					}, 3000)

					/*
					creation.then(({ data, error }) => {
						if (!error)
							return setTimeout(() => {
								history.push(URLPath)
							}, 2000)

						if (error && error.code === existsCode) {
							setText('Sondage éxistant')
							setTimeout(() => {
								history.push(URLPath)
							}, 3000)
						}
					})
					*/
				}}
				css={`
					display: flex !important;
					align-items: center;
				`}
			>
				{clicked && (
					<motion.img
						animate={{
							rotate: [0, 15, -15, 0],
							y: [0, 0, 0, -3, 8, 3],
							filter: ['grayscale(1)', 'grayscale(1)', 'grayscale(0)'],
						}}
						transition={{ duration: 2, delay: 0 }}
						css="width: 3rem; margin-right: .6rem"
						src={actionImg}
					/>
				)}
				<span>
					{text || (clicked ? 'Initialisation...' : "C'est parti ! ")}
				</span>
			</button>
		</div>
	)
}
