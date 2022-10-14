import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import {
	getLangFromAbreviation,
	getLangInfos,
	Lang,
} from '../locales/translation'

export default function LangSwitcher() {
	const dispatch = useDispatch()
	const { i18n } = useTranslation()
	const currentLang = getLangFromAbreviation(i18n.language)
	const [searchParams, setSearchParams] = useSearchParams()
	const [isOpen, setIsOpen] = useState(false)

	return (
		<LangSwitcherContainer>
			{!isOpen && (
				<button
					className="ui__ text-button"
					onClick={(_) => setIsOpen(!isOpen)}
				>
					<svg
						css={`
							padding-top: 2px;
						`}
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						width="24px"
						viewBox="0 0 22 22"
						fill="#5758bb"
					>
						<path d="M0 0h24v24H0z" fill="none" />
						<path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
					</svg>
				</button>
			)}
			{isOpen && (
				<ColumnFlex>
					{Object.keys(Lang)
						.filter((l) => l !== Lang.Default)
						.map((l) => [Lang[l], getLangInfos(Lang[l])])
						.map(([lang, langInfos]) => {
							return (
								<div>
									<button
										className={
											lang === currentLang
												? 'ui__ text-button'
												: 'ui__ dashed-button'
										}
										onClick={() => {
											dispatch({
												type: 'SET_LANGUAGE',
												currentLang: lang,
											})
											searchParams.set('lang', langInfos.abrv)
											setSearchParams(searchParams)
											setIsOpen(!isOpen)
										}}
									>
										{langInfos.name}
									</button>
								</div>
							)
						})}
				</ColumnFlex>
			)}
		</LangSwitcherContainer>
	)
}

const ColumnFlex = styled.div`
	padding: 10px 50px;
	border: solid 1px;
	border-radius: 1rem;
	background-color: #f0f0f9;
	border-color: #5758bb;
	position: fixed;
	top: 10px;
	right: 10px;
	z-index: 10;
	@media (min-width: 800px) {
		position: relative;
		top: 0px;
		right: 0px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 5px;
	}
`

const LangSwitcherContainer = styled.div`
	position: fixed;
	top: 10px;
	right: 10px;
	z-index: 10;
	@media (min-width: 800px) {
		position: relative;
		top: 0px;
		right: 0px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 5px;
	}
`
