import { formatValue } from 'publicodes'

export default function PercentageDiff({ variation }: { variation: number }) {
	return (
		<span
			className={`inline-block ml-3 ${
				Math.round(variation) === 0
					? ''
					: variation > 0
					? 'text-red-600'
					: 'text-green-700'
			} text-xs`}
		>
			<span>{Math.round(variation) === 0 ? '' : variation < 0 ? '' : '+'}</span>
			{Math.round(variation) === 0
				? '='
				: `${formatValue(variation, { precision: 0 })}%`}
		</span>
	)
}
