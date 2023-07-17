import { Link as RouterLink } from 'react-router-dom'

type Props = {
	href: string
	className?: string
} & React.PropsWithChildren

export default function Link({ children, href, className }: Props) {
	return (
		<RouterLink
			to={href}
			className={`text-violet-950 hover:!text-violet-900 transition-colors underline font-bold inline-block ${className}`}
		>
			{children}
		</RouterLink>
	)
}
