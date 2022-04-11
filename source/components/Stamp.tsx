import styled from 'styled-components'

const Stamp = styled.div`
	position: absolute;
	font-size: 100%;
	display: inline-block;
	padding: 0.2rem 0.4rem;
	background: var(--color);
	color: white;
	border-radius: 1rem;
	top: -1.8rem;
	left: 1em;
	line-height: 1rem;

	${({ clickable }) => clickable && `cursor: pointer`}
`

export default Stamp
