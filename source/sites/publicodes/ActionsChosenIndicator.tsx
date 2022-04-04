import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import animate from 'Components/ui/animate'

export default ({}) => {
	const actionChoices = useSelector((state) => state.actionChoices),
		count = Object.values(actionChoices).filter((a) => a === true).length
	if (count == 0) return null
	return (
		<div
			css={`
				color: white;
				text-align: center;
				border-radius: 0.3rem;
				background: #77b255;
				margin-right: 0.4rem;
				width: 1.3rem;
				height: 1.8rem;
				font-weight: bold;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				line-height: 0.85rem;
				display: inline-block;
				vertical-align: middle;
			`}
		>
			<animate.appear>
				<div>{count}</div>
				<div>&#10004;</div>
			</animate.appear>
		</div>
	)
}
