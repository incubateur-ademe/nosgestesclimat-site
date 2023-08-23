export default function Container({
	children,
	className,
}: { className: string } & React.PropsWithChildren) {
	return <div className={`rounded-md ${className}`}>{children}</div>
}
