import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import {
	getLangInfos,
	getLangFromAbreviation,
} from '../../../locales/translation'
import Tile from '../utils/Tile'

const StyledTile = styled(Tile.Wrapper)`
	> div {
		width: 50%;
		/* @media screen and (max-width: ${1200}px) {
			width: 100%;
		} */
	}
`

const Number = styled.span`
	display: block;
	font-size: 6rem;
	font-weight: 800;
	line-height: 1;
	text-align: center;
	color: var(--color);
	transition: color 500ms ease-out;
`
const Label = styled.span`
	text-align: center;
	font-size: 1.25rem;
	font-weight: 700;
`
export default function KmFigures(props) {
	const userPercent = (props.kmhelp / props.simulationsfromhelp) * 100
	const ridesavg = props.ridesnumber / props.kmhelp
	const { t, i18n } = useTranslation()
	const currentLangInfos = getLangInfos(getLangFromAbreviation(i18n.language))

	return (
		<StyledTile>
			<Tile.Tile>
				<Tile.Content>
					<Number>
						{' '}
						{Math.round(userPercent).toLocaleString(
							currentLangInfos.abrvLocale
						)}
						%
					</Number>
					<Label>{t(`ont utilisé l'aide à la saisie des km`)}</Label>
				</Tile.Content>
			</Tile.Tile>
			<Tile.Tile>
				<Tile.Content>
					<Number>
						{Math.round(ridesavg).toLocaleString(currentLangInfos.abrvLocale)}
					</Number>
					<Label>{t(`trajets saisis en moyenne`)}</Label>
				</Tile.Content>
			</Tile.Tile>
		</StyledTile>
	)
}
