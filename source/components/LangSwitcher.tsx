import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { getLangInfos, Lang, LangInfos } from '../locales/translation'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

export default function LangSwitcher() {
	const dispatch = useDispatch()
	const currentLang = useSelector((state) => state.currentLang)
	const [_, setSearchParams] = useSearchParams()
	const { t } = useTranslation()

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
					.map((l) => [Lang[l], getLangInfos(Lang[l])])
					.map(([lang, langInfos]): [Lang, LangInfos] => {
						return (
							<div>
								<button
									className={
										lang === currentLang.currentLang
											? 'ui__ text-button'
											: 'ui__ dashed-button'
									}
									onClick={() => {
										dispatch({
											type: 'SET_LANGUAGE',
											currentLang: lang,
										})
										setSearchParams({ lang: langInfos.abrv })
									}}
								>
									{langInfos.name}
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
