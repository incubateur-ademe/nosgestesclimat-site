export default ({ children, background = false, footer = false }) => (
	<div
		css={`
			margin: 1rem 0;
			padding: 1rem 0;
			@media (max-width: 800px) {
				margin: 2rem 0;
				padding: 0.6rem 0;
			}
			width: 100%;
			h2 {
				font-size: 170%;
				max-width: 40rem;
				margin: 2rem auto 0;
			}
			> div {
				margin: 0 auto;
				padding: 0 1rem;
			}
			p {
				max-width: 40rem;
				margin: 1rem auto;
			}
			background: ${background ? 'var(--lightestColor)' : 'none'};
			${footer && 'margin-bottom: 0'}
		`}
	>
		<div>{children} </div>
	</div>
)
