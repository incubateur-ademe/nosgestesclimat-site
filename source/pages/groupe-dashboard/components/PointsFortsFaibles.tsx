import { formatValue } from 'publicodes'
import { Trans } from 'react-i18next'
import Badge from './Badge'

const ListItem = ({ icon, title, value, variation }) => (
	<li className="flex justify-between items-center p-3 bg-[#F8F8F7] rounded-md mb-3 last:mb-0 text-sm">
		<p className="mb-0 flex items-center">
			<span className="inline-block mr-3 text-lg">{icon}</span>
			{title}
			<span
				className={`inline-block ml-3 ${
					variation > 0 ? 'text-red-600' : 'text-green-700'
				} text-xs`}
			>
				<span>{variation > 0 ? '+' : ''}</span>
				{formatValue(variation as number, { precision: 0 })}%
			</span>
		</p>

		<Badge>
			<strong>{formatValue(value as number, { precision: 0 })}</strong> kg
		</Badge>
	</li>
)
export default function PointsFortsFaibles({ pointsForts, pointsFaibles }) {
	return (
		<div>
			<h2 className="text-[17px] mt-0">
				<Trans>Vos points forts</Trans>
			</h2>
			<ul className="pl-0">
				{pointsForts.map((point, index) => {
					const { icon, title, value, variation } = point.resultObject
					return (
						<ListItem
							icon={icon}
							title={title}
							value={value}
							variation={variation}
							key={`points-forts-${index}`}
						/>
					)
				})}
			</ul>

			<h2 className=" text-[17px]">
				<Trans>Vos points faibles</Trans>
			</h2>
			<ul className="pl-0">
				{pointsFaibles.map((point, index) => {
					const { icon, title, value, variation } = point.resultObject
					return (
						<ListItem
							icon={icon}
							title={title}
							value={value}
							variation={variation}
							key={`points-faibles-${index}`}
						/>
					)
				})}
			</ul>
		</div>
	)
}
