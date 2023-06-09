import { Link } from 'react-router-dom'

type Props = {
	href: string
	className?: string
	color?: 'primary' | 'secondary'
} & React.PropsWithChildren

const colorClassNames = {
	primary: 'border-0 text-white bg-violet-800 hover:bg-violet-900',
	secondary: 'border-2 !border-violet-800 text-violet-800 hover:bg-violet-100',
}

// Create a button component styled with tailwindcss
export default function ButtonLink({
	href,
	children,
	className,
	color = 'primary',
	...props
}: Props) {
	return (
		<Link
			to={href}
			className={`inline-flex items-center px-4 py-4 text-sm font-medium rounded-sm shadow-sm transition-colors border-solid ${colorClassNames[color]} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600 ${className}`}
			{...props}
		>
			{children}
		</Link>
	)
}
