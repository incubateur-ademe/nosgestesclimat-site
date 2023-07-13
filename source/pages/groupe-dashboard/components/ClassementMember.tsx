import Badge from './Badge'

export default function ClassementMember({
	rank,
	name,
	quantity,
	isTopThree,
	isCurrentMember,
}: {
	rank: JSX.Element | string
	name: string
	quantity: JSX.Element | string
	isTopThree?: boolean
	isCurrentMember?: boolean
}) {
	return (
		<li className="flex justify-between items-center">
			<div className="mb-0 flex items-center">
				<span className={`mr-2 ${isTopThree ? 'text-2xl' : 'text-lg ml-1'}`}>
					{rank}
				</span>
				{name}
				{isCurrentMember && (
					<Badge className="!text-pink-500 !border-pink-100 !bg-pink-200 inline !text-xs rounded-sm ml-2">
						Vous
					</Badge>
				)}
			</div>
			<div>{quantity}</div>
		</li>
	)
}
