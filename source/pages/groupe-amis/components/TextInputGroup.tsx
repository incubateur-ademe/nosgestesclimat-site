type Props = {
	name: string
	label: string | React.ReactNode
	type?: string
	isInvalid?: boolean
	error?: string
	helperText?: string
	className?: string
	placeholder?: string
}

export default function TextInputGroup({
	name,
	label,
	type = 'text',
	error,
	helperText,
	className,
	placeholder,
}: Props) {
	return (
		<div className={`flex flex-col ${className}`}>
			<label htmlFor={name}>
				<span
					className={`text-sm font-bold text-slate-900 ${
						error ? 'text-red-700' : ''
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
				className={`border border-slate-200 rounded-sm px-3 py-2 mt-3 focus:ring-2 focus:ring-pink-700 focus:border-transparent ${
					error ? 'ring-2 ring-red-700 border-red-700' : ''
				}}`}
			/>
			{error && <span className="text-sm text-red-700 mt-1">{error}</span>}
		</div>
	)
}
