import { useState } from 'react'
import { Trans } from 'react-i18next'

type Props = {
	textToCopy: string
	className?: string
}

export default function CopyInput({ textToCopy, className = '' }: Props) {
	const [isCopied, setIsCopied] = useState(false)

	return (
		<div className={`flex ${className}`}>
			<input
				type="text"
				className="border flex-1 block w-full min-w-0 rounded-none rounded-l-md sm:text-sm border-gray-300 border-r-0 py-3 px-4"
				value={textToCopy}
				readOnly
			/>
			<button
				type="button"
				className="flex-shrink-0 !min-w-[8rem] px-4 py-2 text-sm font-medium text-violet-700 border-solid border-violet-700 bg-transparent hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600 rounded-e-sm"
				onClick={() => {
					navigator.clipboard.writeText(textToCopy)
					setIsCopied(true)
					setTimeout(() => setIsCopied(false), 3000)
				}}
			>
				{isCopied ? <Trans>Copié !</Trans> : <Trans>Copier le lien</Trans>}
			</button>
		</div>
	)
}
