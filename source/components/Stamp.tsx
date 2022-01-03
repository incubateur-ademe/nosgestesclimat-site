import styled from 'styled-components'

const Stamp = styled.div`
	position: absolute;
	font-size: 100%;
	display: inline-block;
	padding: 0.1rem 0.4rem;
	background: var(--color);
	color: white;
	border-radius: 1rem;
	top: -1.8rem;
	left: 1em;
	line-height: 1rem;

	::before {
		border: 12.5px solid transparent;
		border-top-color: transparent;
		border-top-style: solid;
		border-top-width: 12.5px;
		border-bottom-color: transparent;
		border-bottom-style: solid;
		border-bottom-width: 12.5px;
		border-top: 12.5px solid var(--color);
		border-top-width: 12.5px;
		border-bottom: 0;
		height: 0;
		width: 0;
		border-top-width: 25px;
		content: '';
		display: block;
		position: absolute;
		left: 3rem;
		bottom: -25px;
		transform-origin: center;
		transform: rotate(90deg) skew(-25deg) translateY(16.6666666667px);
	}

	${({ clickable }) => clickable && `cursor: pointer`}
`

export default Stamp
