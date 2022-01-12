import { motion } from 'framer-motion'
import { useState } from 'react'
import { useHistory } from 'react-router'
import useDatabase from './useDatabase'

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const existsCode = '23505'
export default ({ mode, URLPath, room }) => {
	const [clicked, setClicked] = useState(false)
	const [text, setText] = useState(null)

	const history = useHistory()

	const actionImg = '/images/2714.svg'

	const database = useDatabase()

	return (
		<button
			type="submit"
			className="ui__ button plain"
			onClick={async () => {
				setClicked(true)

				if (mode === 'conférence') {
					return setTimeout(() => history.push(URLPath), 2000)
				}
				const creation = database.from('sondages').insert([{ name: room }])

				creation.then(
					({ error }) =>
						error?.code === existsCode && setText('Sondage éxistant')
				)

				Promise.all([creation, wait(3000)]).then(([a, b]) => {
					if (!a.error || a.error.code === existsCode) history.push(URLPath)
				})
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
			<span>{text || (clicked ? 'Initialisation...' : "C'est parti ! ")}</span>
		</button>
	)
}
