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
			className={`inline-flex items-center px-4 py-4 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-violet-800 hover:bg-violet-900 hover:!text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600 ${className}`}
			{...props}
		>
			{children}
		</Link>
	)
}
