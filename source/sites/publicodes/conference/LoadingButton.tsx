import { motion } from 'framer-motion'
import { useState } from 'react'
import { useHistory } from 'react-router'

export default ({ mode, URLPath }) => {
	const [clicked, setClicked] = useState(false)

	const history = useHistory()

	const actionImg = '/images/2714.svg'

	return (
		<button
			type="submit"
			className="ui__ button plain"
			onClick={() => {
				setClicked(true)

				setTimeout(() => history.push(URLPath), 2000)
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
			<span>{clicked ? 'Initialisation...' : "C'est parti ! "}</span>
		</button>
	)
}
