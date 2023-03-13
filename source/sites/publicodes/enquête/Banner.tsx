import { useSelector } from 'react-redux'

export default () => {
	const enquête = useSelector((state) => state.enquête)
	if (!enquête) return null
	const { userID } = enquête
	return (
		<div
			css={`
				width: 100vw;
				height: 1.6rem;
				text-align: center;
				background: yellow;
			`}
		>
			Vous participez à l'enquête avec l'id {userID}
		</div>
	)
}
