import { useState } from 'react'
import emoji from 'Components/emoji'
import Engine from 'publicodes'
import { splitName } from 'Components/publicodesUtils'
import NumberFormat from 'react-number-format'
import { useSelector } from 'react-redux'
import { buildVariantTree } from 'Components/conversation/RuleInput'
import { useTranslation } from 'react-i18next'

export default ({
	threshold,
	setThreshold,
	setContextFilter,
	contextRules,
}) => {
	const [visible, setVisible] = useState(false)
	const survey = useSelector((state) => state.survey)
	const { t } = useTranslation()

	if (!visible)
		return (
			<div css="text-align: right; position: absolute;right: 0; button {font-size: 100%}">
				<button
					title={t('Ouvrir les options de tri')}
					onClick={() => setVisible(true)}
				>
					{emoji('⚙️')}
				</button>
			</div>
		)

	const surveyRule = survey['contextFile']
	const engine = contextRules && new Engine(contextRules)
	const rulesToFilter =
		contextRules && engine.evaluate(surveyRule).missingVariables

	return (
		<div
			css={`
				display: block;
				text-align: right;
				justify-content: center;
			`}
		>
			<div
				css={`
					margin-top: 1rem;
				`}
			>
				<small>
					<label>
						Exclure au-dessus de{' '}
						<NumberFormat
							css={`
								width: 2.5rem;
								height: 1.2rem;
								text-align: right;
								border: none;
								border-bottom: 1px dashed var(--color);
								font-size: 100%;
								color: inherit;
							`}
							onChange={(e) => setThreshold(e.target.value * 1000)}
							value={threshold / 1000}
							inputMode="decimal"
							allowNegative={false}
						/>{' '}
						tonnes.
					</label>
				</small>
				<button
					title={t('Fermer les options de tri')}
					onClick={() => setVisible(false)}
				>
					{emoji('❌')}
				</button>
			</div>
			{rulesToFilter && (
				<div
					css={`
						display: flex;
						justify-content: flex-end;
						align-items: center;
						width: 100%;
						margin: auto;
						margin-top: 0.5rem;
					`}
				>
					<small css="@media(max-width: 800px){display: none}">
						Filtrer par :
					</small>{' '}
					<small css="@media(min-width: 800px){display: none}">Par :</small>{' '}
					{Object.keys(rulesToFilter).map((rule) => {
						const choices = buildVariantTree(engine, rule)
						return (
							<div
								aria-labelledby={'id-filtre-' + choices.title}
								css={`
									max-width: 10rem;
									margin: 0 0.5rem 0 0.5rem;
								`}
							>
								<label title={choices.title}>
									<select
										name={choices.title}
										className="ui__"
										onChange={(e) => {
											setContextFilter((prevState) => ({
												...prevState,
												[splitName(rule)[1]]: e.target.value,
											}))
										}}
										css={`
											font-size: 80% !important;
											padding: 0.3rem 0.6rem !important;
										`}
									>
										<option value="">{choices.title}</option>
										{choices.children.map((node, index) => (
											<option
												key={node.dottedName + '-' + index}
												value={
													node.dottedName.split(node.dottedName + ' . ')[1]
												}
											>
												{node.title}
											</option>
										))}
									</select>
								</label>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}
