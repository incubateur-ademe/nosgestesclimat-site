import ChevronRight from '@/components/icons/ChevronRight'
import { Group } from '@/types/groups'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

type Props = {
	group: Group
	index: number
}

export default function GroupItem({ group }: Props) {
	return (
		<Link
			to={`/groupes/resultats?groupId=${group?._id}`}
			className="border-solid border-[1px] border-gray-200 bg-gray-100 no-underline rounded-sm px-5 py-2 decoration-auto mb-3"
		>
			<div className="flex items-center justify-between py-4">
				<div className="flex items-center w-full">
					<div className="flex-shrink-0 text-2xl">
						<span>{group?.emoji}</span>
					</div>
					<div className="ml-4">
						<div className="text-md font-bold text-gray-900">
							{group?.name ?? 'Nom du groupe'}
						</div>
						<div className="text-sm text-violet-900 flex gap-1 max-w-max">
							<span className="whitespace-nowrap">
								{group?.members?.length ?? 0} <Trans>participant</Trans>
								{group?.members?.length > 1 ? 's' : ''}
							</span>{' '}
							<span> - </span>{' '}
							<div className="text-ellipsis overflow-hidden whitespace-nowrap w-12 md:w-2/5">
								Roger, Adrien, Tugdual, Jean, Jeanne, Jean-Pierre, Jean-Paul,
								Sartre, rougel, Adrien, Tugdual, Jean, Jeanne, Jean-Pierre,
								Jean-Paul, Sartre, rougel
							</div>
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
