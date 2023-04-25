import { RefObject, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import styled from 'styled-components'
import { formatFloat } from '../../utils/formatFloat'
import { AmortissementObject } from './FieldTravelDuration'

interface Props {
	dottedName: string
	amortissementAvion: object
	setAmortissementAvion: (amortissementObject: AmortissementObject) => void
}

const getDuration = (dottedName) => {
	switch (dottedName) {
		case 'transport . avion . court courrier . heures de vol':
			return 'de moins de 2h'
		case 'transport . avion . moyen courrier . heures de vol':
			return 'entre 2h et 6h'
		case 'transport . avion . long courrier . heures de vol':
			return 'de plus de 6h'
	}
}

export default function Form({
	dottedName,
	amortissementAvion,
	setAmortissementAvion,
}: Props) {
	const [localAmortissementAvion, setLocalAmortissementAvion] = useState({})

	useEffect(() => {
		if (!localAmortissementAvion && amortissementAvion) {
			setLocalAmortissementAvion(amortissementAvion)
		}
	}, [])
	const { t } = useTranslation()

	const formRef = useRef<HTMLFormElement>(null)

	const handleAddFormChange = (event) => {
		event.preventDefault()
		// we have to check the form validity if we want 'required' attribute to be taken into account with preventDefault function
		const formToCheck = formRef.current
		const inputs = Array.from(formToCheck?.querySelectorAll('input') || [])

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

	// Get an array of the last 3 years
	const years = useRef(
		Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i)
	)

	const total = Object.entries(amortissementAvion).reduce(
		(sum, [key, value]) =>
			sum + (parseFloat(value.replace(',', '.') || '0') || 0),
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
					margin-bottom: 0.25rem;
				`}
			>
				{t('Vos trajets en avion sur les 3 dernières années')}
			</h3>
			<p
				css={`
					text-align: left;
					margin-bottom: 1.5rem;
					color: #908e8e;
					font-size: 1rem;
				`}
			>
				{t('Trajets {{duration}}', { duration: getDuration(dottedName) })}
			</p>
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
							{year} :
						</label>
						<div
							css={`
								display: flex;
								gap: 0.5rem;
							`}
						>
							<WrappedInput
								className="ui__"
								inputMode="decimal"
								allowNegative={false}
								name={String(year)}
								id={String(year)}
								placeholder="0"
								onChange={handleAddFormChange}
								value={amortissementAvion[year] || ''}
								decimalSeparator=","
								allowLeadingZeros={false}
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
					<span>Total :</span> <span>{formatFloat({ number: total })}</span>{' '}
					<InputSuffix id="unitéDistance">h</InputSuffix>
				</p>
				<p
					css={`
						font-weight: bold;
					`}
				>
					<span>Total par an :</span>{' '}
					<span>{formatFloat({ number: total / 3 })}</span>{' '}
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
	display: inline-block;
	max-width: 5rem !important;
`

const InputSuffix = styled.span`
	position: relative;
	padding: 0.2rem 0.5rem 0rem 0rem !important;
	white-space: nowrap;
`
