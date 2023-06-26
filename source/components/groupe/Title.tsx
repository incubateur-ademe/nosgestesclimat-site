import Separator from '../../pages/creer-groupe/components/Separator'

type Props = {
	title: string | JSX.Element
	subtitle?: string
}

export default function Title({ title, subtitle }: Props) {
	return (
		<div className="relative pb-5">
			<h1 className="font-bold text-2xl mb-1 text-title mt-0">{title}</h1>
			<p className="text-slate-500">{subtitle}</p>
			<Separator className="absolute bottom-0 left-0" />
		</div>
	)
}
