import { colorClassNames, sizeClassNames } from '@/components/groupe/Button'
import { Link } from 'react-router-dom'

type Props = {
	href: string
	className?: string
	color?: 'primary' | 'secondary'
	size?: 'sm' | 'md' | 'lg'
} & React.PropsWithChildren

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
			className={`inline-flex items-center ${sizeClassNames[size]} font-bold no-underline rounded-md shadow-sm transition-colors border-solid ${colorClassNames[color]} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600 disabled:opacity-50 ${className}`}
			{...props}
		>
			{children}
		</Link>
	)
}
