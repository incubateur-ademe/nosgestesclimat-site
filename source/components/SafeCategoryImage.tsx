import { useState } from 'react'
import emoji from './emoji'

export default ({ element, whiteBackground = false }) => {
	const [fail, setFail] = useState(false)
	return !fail ? (
		<img
			css={`
				${!whiteBackground &&
				`
				filter: grayscale(1) invert(1) brightness(1.8);
				`}
				width: 2.5rem;

				height: auto;
			`}
			src={`/images/model/${element.dottedName}.svg`}
			onError={({ currentTarget }) => {
				currentTarget.onerror = null
				setFail(true)
			}}
		/>
	) : (
		emoji(element.rawNode?.icônes || element.icons || '')
	)
}
