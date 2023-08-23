import { Trans } from 'react-i18next'

export default function FeedbackBlock() {
	return (
		<div className="border-solid border-[1px] border-grey-200 rounded-md p-4 flex gap-3 items-top justify-between mt-4">
			<Flask />
			<div>
				<p className="mb-2">
					<Trans>
						Cette nouvelle fonctionnalité est en expérimentation ! Vous
						rencontrez un bug ou avez une idée d’amélioration ?
					</Trans>
				</p>
				<a
					className="font-bold"
					href="https://tally.so/r/meDdDJ"
					target="_blank"
				>
					<Trans>Donnez votre avis !</Trans>
				</a>
			</div>
		</div>
	)
}

const Flask = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className="flex-none mt-1"
	>
		<path
			d="M6.72601 0.75H17.226"
			stroke="#5758BB"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M15.726 8.25V0.75H8.226V8.25L1.489 18.615C1.19487 19.0675 1.02825 19.5909 1.0067 20.1302C0.985142 20.6694 1.10945 21.2045 1.36652 21.679C1.62359 22.1535 2.0039 22.5499 2.46737 22.8264C2.93085 23.1029 3.46032 23.2492 4 23.25H19.948C20.488 23.2499 21.018 23.1041 21.482 22.8279C21.9461 22.5517 22.327 22.1554 22.5845 21.6808C22.8421 21.2061 22.9667 20.6708 22.9453 20.1312C22.9239 19.5916 22.7573 19.0678 22.463 18.615L15.726 8.25Z"
			stroke="#5758BB"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M5.30099 12.75H18.651"
			stroke="#5758BB"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M14.226 17.25H17.226"
			stroke="#5758BB"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M15.726 15.75V18.75"
			stroke="#5758BB"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M15.726 3.75H12.726"
			stroke="#5758BB"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M15.726 6.75H12.726"
			stroke="#5758BB"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M6.72601 19.875C6.62656 19.875 6.53117 19.8355 6.46085 19.7652C6.39052 19.6948 6.35101 19.5995 6.35101 19.5C6.35101 19.4005 6.39052 19.3052 6.46085 19.2348C6.53117 19.1645 6.62656 19.125 6.72601 19.125"
			stroke="#5758BB"
			strokeWidth="1.5"
		/>
		<path
			d="M6.72601 19.875C6.82547 19.875 6.92085 19.8355 6.99118 19.7652C7.0615 19.6948 7.10101 19.5995 7.10101 19.5C7.10101 19.4005 7.0615 19.3052 6.99118 19.2348C6.92085 19.1645 6.82547 19.125 6.72601 19.125"
			stroke="#5758BB"
			strokeWidth="1.5"
		/>
		<path
			d="M9.72601 16.875C9.62656 16.875 9.53117 16.8355 9.46085 16.7652C9.39052 16.6948 9.35101 16.5995 9.35101 16.5C9.35101 16.4005 9.39052 16.3052 9.46085 16.2348C9.53117 16.1645 9.62656 16.125 9.72601 16.125"
			stroke="#5758BB"
			strokeWidth="1.5"
		/>
		<path
			d="M9.72601 16.875C9.82547 16.875 9.92085 16.8355 9.99118 16.7652C10.0615 16.6948 10.101 16.5995 10.101 16.5C10.101 16.4005 10.0615 16.3052 9.99118 16.2348C9.92085 16.1645 9.82547 16.125 9.72601 16.125"
			stroke="#5758BB"
			strokeWidth="1.5"
		/>
	</svg>
)
