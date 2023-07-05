type Props = {
	name: string
	label: string | React.ReactNode
	type?: string
	isInvalid?: boolean
	error?: string
	helperText?: string
	className?: string
	placeholder?: string
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	value?: string
}

export default function TextInputGroup({
	name,
	label,
	type = 'text',
	error,
	helperText,
	className,
	placeholder,
	onChange,
	value,
}: Props) {
	return (
		<div className={`flex flex-col ${className}`} aria-live="polite">
			<label htmlFor={name}>
				<span
					className={`text-sm font-bold text-slate-900 ${
						error ? '!text-red-700' : ''
					}`}
				>
					{label}
				</span>
			</label>
			{helperText && (
				<span className="text-xs text-slate-500 mt-1">{helperText}</span>
			)}
			<input
				name={name}
				type={type}
				placeholder={placeholder}
				className={`border-solid border-grey-200 rounded-sm bg-grey-100 text-sm !p-4 mt-3 max-w-[30rem] focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
					error ? 'ring-2 !ring-red-700 !bg-red-50 !border-red-200' : ''
				}`}
				onChange={onChange}
				aria-describedby={`error-${name}`}
				value={value}
			/>
			{error && (
				<span id={`error-${name}`} className="text-xs text-red-700 mt-2">
					{error}
				</span>
			)}
		</div>
	)
}
