import { ButtonSize } from '@/types/values'
import { MouseEventHandler } from 'react'

type Props = {
	onClick: MouseEventHandler<HTMLButtonElement>
	className?: string
	size?: ButtonSize
	color?: 'primary' | 'secondary'
	type?: 'button' | 'submit' | 'reset'
	disabled?: boolean
	id?: string
} & React.PropsWithChildren

export const colorClassNames = {
	primary:
		'border-0 transition-colors text-white bg-primary hover:bg-primaryDark hover:!text-white',
	secondary:
		'border-solid border-2 !border-primary text-primary bg-transparent hover:bg-primaryLight',
}

export const sizeClassNames = {
	sm: 'px-2 py-1 text-sm',
	md: 'px-4 py-4 text-md',
	lg: 'px-8 py-4 text-base',
}

export default function Button({
	onClick,
	children,
	className,
	size = 'md',
	color = 'primary',
	type,
	disabled,
	id,
	...props
}: Props) {
	return (
		<button
			onClick={disabled ? () => {} : onClick}
			type={type}
			aria-disabled={disabled}
			id={id}
			className={`inline-flex items-center ${sizeClassNames[size]} border border-transparent text-sm font-medium no-underline rounded-md shadow-sm ${colorClassNames[color]} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary aria-disabled:opacity-50 transition-colors ${className}`}
			{...props}
		>
			{children}
		</button>
	)
}
