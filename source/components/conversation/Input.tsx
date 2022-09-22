import { Evaluation, serializeUnit, Unit, formatValue } from 'publicodes'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import { currencyFormat, debounce } from '../../utils'
import AnimatedTargetValue from '../ui/AnimatedTargetValue'
import InputEstimation from './InputEstimation'
import InputSuggestions from './InputSuggestions'
import { InputCommonProps } from './RuleInput'

// TODO: fusionner Input.js et CurrencyInput.js
export default function Input({
	suggestions,
	onChange,
	onSubmit,
	id,
	value,
	missing,
	unit,
	autoFocus,
	inputEstimation,
	idDescription,
	showAnimation,
}: InputCommonProps & {
	onSubmit: (source: string) => void
	unit: Unit | undefined
	value: Evaluation<number>
	inputEstimation: Object | void
}) {
	const debouncedOnChange = useCallback(debounce(550, onChange), [])
	const { language } = useTranslation().i18n
	const unité = serializeUnit(unit)
	const { thousandSeparator, decimalSeparator } = currencyFormat(language)
	return (
		<>
			<div className="step input">
				<div>
					<InputSuggestions
						suggestions={suggestions}
						onFirstClick={(value) => {
							onChange(value)
						}}
						onSecondClick={() => onSubmit?.('suggestion')}
					/>
					<div css="display: flex; justify-content: flex-end; align-items: center">
						{showAnimation && <AnimatedTargetValue value={value} unit="km" />}
						<NumberFormat
							autoFocus={autoFocus}
							className="suffixed ui__"
							id={id}
							aria-describedby={idDescription}
							inputMode="decimal"
							thousandSeparator={thousandSeparator}
							decimalSeparator={decimalSeparator}
							allowNegative={false}
							// We don't want to call `onValueChange` in case this component is
							// re-render with a new "value" prop from the outside.
							onValueChange={({ floatValue }) => {
								debouncedOnChange(
									floatValue != undefined ? { valeur: floatValue, unité } : {}
								)
							}}
							autoComplete="off"
							{...(missing
								? {
										placeholder:
											value || value == 0
												? formatValue(value, { precision: 1 })
												: '',
								  }
								: { value: value ?? '' })}
						/>
						<label htmlFor={id}>
							<span className="suffix">&nbsp;{unité}</span>
						</label>
					</div>
				</div>
			</div>
			<div css="width: 100%">
				{inputEstimation && (
					<InputEstimation
						inputEstimation={inputEstimation}
						setFinalValue={(value) => {
							onChange(value)
						}}
					/>
				)}
			</div>
		</>
	)
}
