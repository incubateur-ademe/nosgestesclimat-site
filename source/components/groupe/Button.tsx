type Props = {
	onClick: () => void
	className?: string
} & React.PropsWithChildren

export default function Button({
	onClick,
	children,
	className,
	...props
}: Props) {
	return (
		<button
			onClick={onClick}
			className={`inline-flex items-center px-8 py-4 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-primary hover:opacity-80 focus:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 transition-opacity transition-colors ${className}`}
			{...props}
		>
			{children}
		</button>
	)
}
