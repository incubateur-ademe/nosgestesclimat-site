import { Link } from 'react-router-dom'

type Props = {
	href: string
	className?: string
} & React.PropsWithChildren

// Create a button component styled with tailwindcss
export default function ButtonLink({
	href,
	children,
	className,
	...props
}: Props) {
	return (
		<Link
			to={href}
			className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
			{...props}
		>
			{children}
		</Link>
	)
}
