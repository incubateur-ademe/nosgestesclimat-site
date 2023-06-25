import { Link } from 'react-router-dom'

type Props = {
	href: string
	className?: string
	color?: 'primary' | 'secondary'
	size?: 'sm' | 'md' | 'lg'
} & React.PropsWithChildren

const colorClassNames = {
	primary:
		'border-0 transition-opacity text-white bg-primary hover:!opacity-80 hover:!text-white',
	secondary:
		'border-2 !border-primary text-primary bg-transparent hover:bg-violet-100',
}

const sizeClassNames = {
	sm: 'px-2 py-1 text-sm',
	md: 'px-4 py-4 text-md',
	lg: 'px-6 py-4 text-base',
}

// Create a button component styled with tailwindcss
export default function ButtonLink({
	href,
	children,
	className = '',
	color = 'primary',
	size = 'md',
	...props
}: Props) {
	return (
		<Link
			to={href}
			className={`inline-flex items-center ${sizeClassNames[size]} font-bold rounded-sm shadow-sm transition-colors border-solid ${colorClassNames[color]} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600 ${className}`}
			{...props}
		>
			{children}
		</Link>
	)
}
