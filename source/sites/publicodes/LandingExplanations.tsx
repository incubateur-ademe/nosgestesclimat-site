import Markdown from 'markdown-to-jsx'
import landingMd from 'raw-loader!./landing.md'
import emoji from 'react-easy-emoji'
import avantages from './avantages.yaml'
import LandingContent from './LandingContent'

const fluidLayoutMinWidth = '1200px'

export default () => (
	<>
		<div
			css={`
				width: 100%;
				text-align: center;
				h2 {
					font-size: 170%;
				}

				p {
					max-width: 45rem;
					margin: 1rem auto;
				}
			`}
		>
			<LandingContent background>
				<Markdown>{landingMd}</Markdown>
			</LandingContent>
			<LandingContent>
				<h2>Ouvert, documenté et contributif</h2>
				<div
					css={`
						img {
							width: 2.6rem;
							height: auto;
							margin: 0.4rem;
						}
						display: flex;
						justify-content: center;
						align-items: center;
						flex-wrap: wrap;
						> div {
							width: 14rem;
							height: 14rem;
							justify-content: center;
						}
						@media (max-width: ${fluidLayoutMinWidth}) {
							flex-direction: column;
						}
					`}
				>
					{avantages.map((el) => (
						<div key={el.icon} className="ui__ card box">
							{emoji(el.illustration)}

							<div>
								<Markdown>{el.text}</Markdown>
							</div>
						</div>
					))}
				</div>
				<Markdown
					children={`
## Des questions ?

Retrouvez les réponses aux questions courantes sur notre page [FAQ](/contribuer).
					`}
				/>
			</LandingContent>
		</div>
	</>
)
