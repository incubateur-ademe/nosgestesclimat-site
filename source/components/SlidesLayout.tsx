import { useContext } from 'react'
import styled from 'styled-components'
import { IframeOptionsContext } from './utils/IframeOptionsProvider'

export default ({ children }) => {
	const { isIframe } = useContext(IframeOptionsContext)
	return <Style isIframe={isIframe}>{children}</Style>
}

const Style = styled.div`
	height: 70vh;
	@media (max-width: 800px) {
		height: 95vh;
	}
	@media (min-aspect-ratio: 1280/700) {
		height: 95vh;
	}
	${(props) => props.isIframe && `height: 45rem !important;`}
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
`
