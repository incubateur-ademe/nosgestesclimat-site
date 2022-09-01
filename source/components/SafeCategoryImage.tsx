import { useState } from 'react'
import emoji from './emoji'

export default ({ element, whiteBackground = false }) => {
	const [fail, setFail] = useState(false)
	return (
		<span
			css={`
				${!whiteBackground &&
				`
				img {
				  filter: grayscale(1) invert(1) brightness(1.8);
				}

				`}

				display: flex;
				align-items: center;
				justify-content: center;
				img {
					width: 2.5rem;
					height: auto;
				}
			`}
		>
			{!fail ? (
				<img
					css={``}
					src={`/images/model/${element.dottedName}.svg`}
					onError={({ currentTarget }) => {
						currentTarget.onerror = null
						setFail(true)
					}}
				/>
			) : (
				emoji(element.rawNode?.icônes || element.icons || '')
			)}
		</span>
	)
}
