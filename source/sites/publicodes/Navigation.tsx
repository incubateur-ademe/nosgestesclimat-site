import SessionBar from 'Components/SessionBar'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { IframeOptionsContext } from '../../components/utils/IframeOptionsProvider'
import SkipLinks from './SkipLinks'

export default ({ isHomePage }) => {
	const pathname = decodeURIComponent(location.pathname)

	const { isIframe } = useContext(IframeOptionsContext)

	return (
		<>
			<SkipLinks />
			<nav
				id="mainNavigation"
				tabIndex="0"
				css={`
					display: flex;
					justify-content: center;
					margin: 0.6rem auto;

					outline: none !important;

					@media (min-width: 800px) {
						flex-shrink: 0;
						width: 12rem;
						height: 100vh;
						${isIframe && `height: 100% !important;`}
						overflow: auto;
						position: sticky;
						top: 0;
						flex-direction: column;
						justify-content: start;
						border-right: 1px solid #eee;
					}
					${isHomePage && `display: none`}
				`}
			>
				<Link
					to="/"
					css={`
						display: flex;
						align-items: center;
						justify-content: center;
						text-decoration: none;
						font-size: 170%;
						margin-bottom: 0;
						#blockLogo {
							display: none;
						}
						@media (min-width: 800px) {
							margin-bottom: 0.4rem;
							#inlineLogo {
								display: none;
							}
							justify-content: start;
							#blockLogo {
								margin: 1rem;
								display: block;
							}
						}
						${(pathname.includes('simulateur/') ||
							pathname.includes('actions/')) &&
						`
							@media (max-width: 800px){
					svg {width: 2.6rem !important}
					span {display:none}
					}

					`}
					`}
				>
					<img src="/images/petit-logo.png" />
				</Link>
				{pathname !== '/' && !pathname.includes('nouveautés') && <SessionBar />}
			</nav>
		</>
	)
}
