export default () => (
	<div css="display: flex; align-items: center">
		<img
			src="/images/pompe-essence.svg"
			css="width: 3rem; margin-right: .4rem"
			alt="Icône représentant une pompe à pétrole"
		/>
		<div
			css="display: flex; flex-direction: column"
			title="200 litres de pétrole"
		>
			<div css="font-size: 120%; font-weight: bold">
				{Math.round(Math.random() * 20 + 10)} pleins
			</div>

			<div css="@media (max-width: 800px){display: none}">de pétrole</div>
		</div>
	</div>
)
