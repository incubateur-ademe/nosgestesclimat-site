import { useState } from 'react'

export default ({ element, whiteBackground = false }) => {
	const [fail, setFail] = useState(false)
	return (
		<span
			css={`
				${!whiteBackground &&
				`
				img {
				  filter: grayscale(1) invert(1) brightness(${fail ? '7' : '1.8'});
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
					src={`/images/model/${element.dottedName}.svg`}
					onError={({ currentTarget }) => {
						currentTarget.onerror = null
						setFail(true)
					}}
				/>
			) : (
				<img src={'/images/three-dots.svg'} />
			)}
		</span>
	)
}
