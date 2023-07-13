import { PropsWithChildren } from 'react'

export default function Badge({
	children,
	className,
}: { className?: string } & PropsWithChildren) {
	return (
		<div
			className={`py-1 px-2 border-solid border-[1px] border-primaryBorder bg-primaryLight rounded-md text-primary text-sm ${className}`}
		>
			{children}
		</div>
	)
}
