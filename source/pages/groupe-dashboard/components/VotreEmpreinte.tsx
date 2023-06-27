import ChevronRight from '@/components/icons/ChevronRight'
import { ResultsObject } from '@/types/groups'
import { Trans, useTranslation } from 'react-i18next'

const EMOJI_TEXT_MAP: {
	[key in keyof Partial<ResultsObject>]: {
		emoji: string
		text: string
	}
} = {
	transports: {
		emoji: '🚗',
		text: 'Transports',
	},
	alimentation: {
		emoji: '🍽',
		text: 'Alimentation',
	},
	logement: {
		emoji: '🏠',
		text: 'Logement',
	},
	divers: {
		emoji: '📦',
		text: 'Divers',
	},
	'services sociétaux': {
		emoji: '🏥',
		text: 'Services publics',
	},
}

export default function VotreEmpreinte({
	results,
}: {
	results?: ResultsObject
}) {
	const { t } = useTranslation()
	return (
		<>
			<h2 className="text-[17px] mb-1 mt-0">
				<Trans>Votre empreinte</Trans>
			</h2>
			<p className="text-gray-500">
				<Trans>Par rapport à la moyenne du groupe.</Trans>
			</p>
			<ul className="mt-6 pl-0 mb-16">
				{Object.entries(results || {}).reduce((acc, [key, value]) => {
					if (!EMOJI_TEXT_MAP?.[key]) return acc
					return [
						...acc,
						<li
							key={`cat-${key}`}
							className="flex items-center justify-between py-4 border-solid border-0 border-b-[1px] last:border-b-0 border-gray-200"
						>
							<div className="flex items-center">
								<div className="flex-shrink-0 text-2xl">
									<span>{EMOJI_TEXT_MAP[key].emoji}</span>
								</div>
								<div className="ml-4">
									<div className="text-md font-bold text-gray-900">
										{EMOJI_TEXT_MAP[key].text}
									</div>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="text-sm text-primary bg-primaryLight border-solid border-[1px] border-primaryBorder rounded-[5px] p-1">
									{value} {t('t')}
								</div>
								<div className="flex-shrink-0">
									<span className="text-sm text-gray-500">
										<ChevronRight />
									</span>
								</div>
							</div>
						</li>,
					]
				}, [] as JSX.Element[])}
			</ul>
		</>
	)
}
