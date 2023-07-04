import ChevronRight from '@/components/icons/ChevronRight'
import { Group } from '@/types/groups'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

type Props = {
	group: Group
	index: number
}

// Create an array of 10 insects emojis
const EMOJIS = [
	'🐝',
	'🐞',
	'🦋',
	'🐛',
	'🐜',
	'🐌',
	'🐢',
	'🐍',
	'🦎',
	'🦖',
	'🦕',
	'🐙',
	'🦑',
	'🦀',
	'🐡',
	'🐠',
	'🐟',
	'🐬',
	'🐳',
	'🐋',
]

export default function GroupItem({ group, index }: Props) {
	return (
		<Link
			to={`/groupe/${group?._id}`}
			className="border-solid border-[1px] border-gray-200 bg-gray-100 no-underline rounded-sm px-5 py-2 decoration-auto mb-3"
		>
			<div className="flex items-center justify-between py-4">
				<div className="flex items-center">
					<div className="flex-shrink-0 text-2xl">
						<span>{EMOJIS[index]}</span>
					</div>
					<div className="ml-4">
						<div className="text-md font-bold text-gray-900">
							{group?.name ?? 'Nom du groupe'}
						</div>
						<div className="text-sm text-violet-900">
							{group?.members?.length ?? 0} <Trans>participant</Trans>
							{group?.members?.length > 1 ? 's' : ''}
						</div>
					</div>
				</div>
				<div className="flex items-center">
					<div className="flex-shrink-0">
						<ChevronRight />
					</div>
				</div>
			</div>
		</Link>
	)
}
