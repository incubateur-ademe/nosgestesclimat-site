import { RefObject, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import NumberFormat from 'react-number-format'
import styled from 'styled-components'

interface Props {
	amortissementValues: object[]
	setAmortissementValues: (value: object[]) => void
}

export default function KmForm({
	amortissementValues,
	setAmortissementValues,
}: Props) {
	const { t } = useTranslation()

	const [addFormData, setAddFormData] = useState(
		{} as {
			[key: string]: string | number | undefined
		}
	)

	const formRef = useRef<
		RefObject<HTMLFormElement> & {
			checkValidity: () => boolean
			reportValidity: () => boolean
		}
	>(null)

	const handleAddFormChange = (event) => {
		event.preventDefault()

		const fieldName = event.target.getAttribute('name')
		const fieldValue = event.target.value
		const newFormData = { ...addFormData }
		newFormData[fieldName] = fieldValue

		setAddFormData(newFormData)

		// we have to check the form validity if we want 'required' attribute to be taken into account with preventDefault function
		const formToCheck = formRef.current

		const isValidForm = formToCheck && formToCheck.checkValidity()

		if (!isValidForm && formToCheck) {
			formToCheck.reportValidity()
			return null
		}
		const inputs = formToCheck?.querySelectorAll('input')

		setAmortissementValues(
			inputs.map((input) => ({ [input.name]: input.value }))
		)
	}

	const currentYearRef = useRef(new Date().getFullYear())

	// Get an array of the last 3 years
	const years = Array.from({ length: 3 }, (_, i) => currentYearRef.current - i)

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
			<fieldset
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
				{years.map((year) => (
					<div
						css={`
							display: flex;
							width: 100%;
							gap: 3rem;
							align-items: baseline;
						`}
					>
						<label
							htmlFor={String(year)}
							css={`
								display: inline-block;
							`}
						>
							{t('Année {{year}}', { year })}
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
								placeholder="0"
								onChange={handleAddFormChange}
								required
							/>
							<InputSuffix id="unitéDistance">km (A/R)</InputSuffix>
						</div>
					</div>
				))}
			</fieldset>
			{/*
			<div
				css={`
					text-align: right;
				`}
			>
				<button
					form="kmForm"
					type="submit"
					className="ui__ plain small button"
					css="max-height: 2rem"
					onClick={(event) => {
						handleAddFormSubmit(event)
						tracker.push([
							'trackEvent',
							'Amortissement avion',
							'Ajout amortissement avion',
						])
					}}
				>
					<Trans>Ajouter</Trans>
				</button>
			</div>
			*/}
		</form>
	)
}

const InputWrapper = styled.span`
	display: flex;
	margin: 0rem 0.4rem 0.6rem 0rem;
	background-color: white;
	color: inherit;
	font-size: inherit;
	transition: border-color 0.1s;
	position: relative;
	font-family: inherit;
	height: 2.2rem;
	border: 1px solid var(--lighterTextColor);
	border-radius: 0.3rem;
	:focus-within {
		outline: 1px solid var(--color);
	}
`

const WrappedInput = styled(NumberFormat)`
	position: relative;
	padding: 0.3rem !important;
	margin-bottom: 0rem !important;
`

const InputSuffix = styled.span`
	position: relative;
	padding: 0.2rem 0.5rem 0rem 0rem !important;
`

const SelectWrapper = styled.span`
	display: flex;
	margin: 0rem 0.4rem 0.6rem 0rem;
	background-color: white;
	color: inherit;
	font-size: inherit;
	transition: border-color 0.1s;
	position: relative;
	font-family: inherit;
	height: 2.2rem;
	border: 1px solid var(--lighterTextColor);
	border-radius: 0.3rem;
	:focus-within {
		outline: 1px solid var(--color);
	}
`

const WrappedSelect = styled.select`
	appearance: none;
	padding-right: 1.5rem !important;
	background-image: url('/images/arrow.svg');
	background-repeat: no-repeat;
	background-position: calc(100% - 0.2rem) 0.55rem;
	background-size: 1rem;
`

const SelectSuffix = styled.span`
	position: relative;
	padding: 0.2rem 0.5rem 0rem 0.2rem;
`
