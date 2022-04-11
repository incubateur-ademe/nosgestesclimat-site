import styled from 'styled-components'

const Stamp = styled.div`
	position: absolute;
	font-size: 100%;
	display: inline-block;
	padding: 0.2rem 0.4rem;
	color: white;
	border-radius: 1rem;
	right: 1.5rem;
	top: -2em;
	line-height: 1rem;
	display: flex;
	align-items: center;
	justify-content: center;

	${({ clickable }) => clickable && `cursor: pointer`}
`

export default Stamp
