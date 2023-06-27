import styled from 'styled-components'

const MosaicStamp = styled.div`
	font-size: 75%;
	font-weight: bold;
	display: inline-block;
	padding: 0.2rem 0.2rem 0;
	text-transform: uppercase;
	text-align: center;
	font-family: 'Courier';
	mix-blend-mode: multiply;
	mask-position: 13rem 6rem;
	transform: rotate(-10deg);
	border-radius: 4px;
	line-height: 1rem;
	z-index: 0;
	max-width: 8rem;
	border: 3px solid var(--darkColor);
	color: var(--darkColor);
	cursor: not-allowed !important;
`

export default MosaicStamp
