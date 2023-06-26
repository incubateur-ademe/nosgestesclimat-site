import Button from '@/components/groupe/Button'
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
			<Button
				color="secondary"
				className="flex-shrink-0 !min-w-[8rem] px-4 py-2 text-sm rounded-s-none justify-center"
				onClick={() => {
					navigator.clipboard.writeText(textToCopy)
					setIsCopied(true)
					setTimeout(() => setIsCopied(false), 3000)
				}}
			>
				{isCopied ? <Trans>Copié !</Trans> : <Trans>Copier le lien</Trans>}
			</Button>
		</div>
	)
}
