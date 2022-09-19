import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { getLangInfos, Lang, LangInfos } from '../locales/translation'

export default function LangSwitcher() {
	const { t, i18n } = useTranslation()

	const currentLang = i18n.language

	return (
		<details
			css={`
				display: flex;
			`}
		>
			<summary>
				{t('Changer de langue')} {emoji('🌐')}
			</summary>
			<ColumnFlex>
				{Object.keys(Lang)
					.filter((l) => l !== Lang.Default)
					.map((l) => getLangInfos(Lang[l]))
					.map((info: LangInfos) => {
						return (
							<div>
								<button
									className={
										info.abrv === currentLang
											? 'ui__ text-button'
											: 'ui__ dashed-button'
									}
									onClick={() => i18n.changeLanguage(info.abrv)}
								>
									{info.name}
								</button>
							</div>
						)
					})}
			</ColumnFlex>
		</details>
	)
}

const ColumnFlex = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`
// const LangButton = styled.button`
// 	color: var(--darkColor);
// 	font-style: semi-bold;
// `
//
// const SelectedLangButton = styled.button`
// 	color: var(--darkColor);
// 	font-style: semi-bold;
// `
