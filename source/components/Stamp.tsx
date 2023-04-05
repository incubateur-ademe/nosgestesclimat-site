import styled from 'styled-components'

const Stamp = styled.button`
	position: absolute;
	font-size: 100%;
	font-weight: bold;
	display: inline-block;
	padding: 0.3rem 0.2rem 0;
	text-transform: uppercase;
	font-family: 'Courier';
	mix-blend-mode: multiply;
	border: 3px solid var(--color);
	color: grey;
	mask-position: 13rem 6rem;
	transform: rotate(-10deg);
	border-radius: 4px;
	right: 2.5rem;
	line-height: 1rem;
	${({ clickable }) => clickable && `cursor: pointer`}

	@media (min-width: 600px) {
		right: 0%;
	}
`

export default Stamp
