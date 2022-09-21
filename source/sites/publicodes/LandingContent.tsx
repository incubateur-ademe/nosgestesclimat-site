export default ({ children, background = false, footer = false }) => (
	<div
		css={`
			margin: 4rem 0;
			padding: 2rem 0;
			@media (max-width: 800px) {
				margin: 2rem 0;
				padding: 0.6rem 0;
			}
			width: 100%;
			background: ${background ? `var(--lightestColor)` : `none`};
			${footer && `margin-bottom: 0`}
		`}
	>
		<div className="ui__ container">{children} </div>
	</div>
)
