import { RefObject, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import styled from 'styled-components'
import { AmortissementObject } from './FieldTravelDuration'

interface Props {
	amortissementAvion: object
	setAmortissementAvion: (amortissementObject: AmortissementObject) => void
}

export default function Form({
	amortissementAvion,
	setAmortissementAvion,
}: Props) {
	const { t } = useTranslation()

	const formRef = useRef<HTMLFormElement>(null)

	const handleAddFormChange = (event) => {
		event.preventDefault()
		// we have to check the form validity if we want 'required' attribute to be taken into account with preventDefault function
		const formToCheck = formRef.current
		const inputs = Array.from(formToCheck?.querySelectorAll('input') || [])

		const allInputsAnswered = inputs.every(
			(input: HTMLInputElement) => input.value !== ''
		)

		if (!allInputsAnswered) {
			return null
		}

		const isValidForm = formToCheck && formToCheck.checkValidity()

		if (!isValidForm && formToCheck) {
			formToCheck.reportValidity()
			return null
		}

		const amortissementAvionValue = {}
		inputs.forEach((input: HTMLInputElement) => {
			amortissementAvionValue[input.name] = input.value
		})
		setAmortissementAvion(amortissementAvionValue)
	}

	const currentYearRef = useRef(new Date().getFullYear())

	// Get an array of the last 3 years
	const years = useRef(
		Array.from({ length: 3 }, (_, i) => currentYearRef.current - i)
	)

	const total = Object.entries(amortissementAvion).reduce(
		(sum, [key, value]) => sum + (parseFloat(value || '0') || 0),
		0
	)

	return (
		<form
			id="amortissementAvionForm"
			ref={formRef as unknown as RefObject<HTMLFormElement>}
			onSubmit={(e) => e.preventDefault()}
		>
			<h3
				css={`
					text-align: left;
					margin-top: 1rem;
					margin-bottom: 1.5rem;
				`}
			>
				{t('Vos trajets en avion sur les 3 dernières années')}
			</h3>
			<div
				css={`
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					flex-wrap: wrap;
					gap: 0.5rem;
					margin-top: 0.5rem;
					input,
					select {
						height: 2rem;
					}
				`}
			>
				{years.current.map((year) => (
					<div
						css={`
							display: flex;
							width: 100%;
							gap: 3rem;
							align-items: baseline;
						`}
						key={`input-amortissement-${year}`}
					>
						<label
							htmlFor={String(year)}
							css={`
								display: inline-block;
								cursor: pointer;
							`}
						>
							{t('Année {{year}} :', { year })}
						</label>
						<div
							css={`
								display: flex;
								gap: 0.5rem;
							`}
						>
							<WrappedInput
								css={`
									display: inline-block;
									@media (max-width: 600px) {
										max-width: 5rem !important;
									}
								`}
								className="ui__"
								inputMode="decimal"
								allowNegative={false}
								name={String(year)}
								id={String(year)}
								placeholder="0"
								onChange={handleAddFormChange}
								value={amortissementAvion[year] || ''}
								required
								decimalSeparator=","
							/>
							<InputSuffix id="unitéDistance">h (A/R)</InputSuffix>
						</div>
					</div>
				))}
			</div>

			<div
				css={`
					text-align: left;
					margin-top: 1.5rem;
					background: var(--lighterColor);
					padding: 0.75rem 0.5rem;
					border-radius: 0.5rem;
				`}
			>
				<p
					css={`
						font-weight: bold;
					`}
				>
					<span>Total :</span> <span>{total}</span>{' '}
					<InputSuffix id="unitéDistance">h</InputSuffix>
				</p>
				<p
					css={`
						font-weight: bold;
					`}
				>
					<span>Total par an :</span>{' '}
					<span>{total ? (total / 3).toFixed(1).replace('.', ',') : 0}</span>{' '}
					<InputSuffix id="unitéDistance">h</InputSuffix>
				</p>
			</div>
		</form>
	)
}

const WrappedInput = styled(NumberFormat)`
	position: relative;
	padding: 0.3rem !important;
	margin-bottom: 0rem !important;
`

const InputSuffix = styled.span`
	position: relative;
	padding: 0.2rem 0.5rem 0rem 0rem !important;
`
