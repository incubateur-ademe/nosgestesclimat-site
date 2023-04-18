import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import IllustratedMessage from '../ui/IllustratedMessage'
import NewTabSvg from '../utils/NewTabSvg'
import RegionGrid from './RegionGrid'
import useOrderedSupportedRegions from './useOrderedSupportedRegions'

export default ({ open = false }) => {
	const dispatch = useDispatch()
	const currentLang = useSelector((state) => state.currentLang).toLowerCase()

	const orderedSupportedRegions = useOrderedSupportedRegions()
	const numberOfRegions = Object.entries(orderedSupportedRegions).length
	return (
		<>
			<details
				open={open}
				css={`
					summary {
						text-align: center;
						border-radius: 0.8rem;
						padding: 0.1rem 0.8rem;
						background: var(--lightestColor);
						width: auto;
					}
				`}
			>
				<summary>
					🗺️ <Trans>Choisir une autre région</Trans>
					&nbsp;
					<small title={`${numberOfRegions} régions`}>{numberOfRegions}</small>
				</summary>
				<RegionGrid />
				<IllustratedMessage
					emoji="🌐"
					message={
						<div>
							<p>
								<Trans>
									Envie de contribuer à une version pour votre région ?
								</Trans>{' '}
								<a
									target="_blank"
									href="https://github.com/datagir/nosgestesclimat/blob/master/INTERNATIONAL.md"
								>
									<Trans>Suivez le guide !</Trans>
									<NewTabSvg />
								</a>
							</p>
						</div>
					}
					inline={undefined}
					image={undefined}
					width={undefined}
					direction={undefined}
					backgroundcolor={undefined}
				/>
			</details>
		</>
	)
}
