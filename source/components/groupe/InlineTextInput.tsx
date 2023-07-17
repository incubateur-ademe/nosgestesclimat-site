import { FocusEvent, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from './Button'

type Props = {
	name: string
	type?: string
	placeholder?: string
	defaultValue?: string
	label: string
	onClose: () => void
	onSubmit: (value: string) => Promise<any>
	isLoading?: boolean
}

export default function InlineTextInput({
	name,
	type = 'text',
	placeholder,
	defaultValue,
	label,
	onClose = () => {},
	onSubmit,
	isLoading,
	...props
}: Props) {
	const [error, setError] = useState('')

	const inputRef = useRef<HTMLInputElement>(null)

	const { t } = useTranslation()

	const handleSubmit = async () => {
		const inputValue = inputRef.current?.value

		if (!inputValue) {
			setError(t('Veuillez renseigner un nom.'))
			return
		}

		await onSubmit(inputValue)

		onClose()
	}

	return (
		<div
			className="flex flex-col"
			aria-live="polite"
			onBlurCapture={(event: FocusEvent) => {
				if (event?.relatedTarget?.id === 'inline-input-button') {
					return
				}
				onClose()
			}}
		>
			<label htmlFor={name}>
				<span
					className={`text-sm font-bold text-slate-900 ${
						error ? '!text-red-700' : ''
					}`}
				>
					{label}
				</span>
			</label>
			<div className="flex items-stretch">
				<input
					ref={inputRef}
					name={name}
					type={type}
					placeholder={placeholder}
					className={`flex-1 border-solid border-grey-200 rounded-s-md bg-grey-100 text-sm !p-4 max-w-[30rem] focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
						error ? 'ring-2 !ring-red-700 !bg-red-50 !border-red-200' : ''
					}`}
					aria-describedby={`error-${name}`}
					defaultValue={defaultValue}
					// We alert the user when focusing the button that
					// display the input
					// eslint-disable-next-line jsx-a11y/no-autofocus
					autoFocus
					disabled={isLoading}
					{...props}
				/>
				<Button
					className="rounded-s-none"
					id="inline-input-button"
					onClick={handleSubmit}
					aria-label={t('Ok, sauvegarder la modification')}
					disabled={isLoading}
					data-cypress-id="button-inline-input"
				>
					Ok
				</Button>
			</div>
		</div>
	)
}
