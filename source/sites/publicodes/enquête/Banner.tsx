import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default () => {
	const enquête = useSelector((state) => state.enquête)
	if (!enquête) return null
	const { userID } = enquête
	return (
		<Link to={`/enquête/${userID}`}>
			<div
				css={`
					width: 100vw;
					height: 1.8rem;
					text-align: center;
					background: yellow;
				`}
			>
				Vous participez à l'enquête avec l'id {userID}
			</div>
		</Link>
	)
}
