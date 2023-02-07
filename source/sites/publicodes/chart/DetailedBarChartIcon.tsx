export default () => (
	<ul
		aria-hidden="true"
		css={`
			margin-top: 1.3rem;
			width: 3.5rem;
			list-style-type: none;
			li {
				height: 0.4rem;
				margin: 0.2rem 0;
				background: var(--lighterColor);
			}
		`}
	>
		{[10, 6, 3].map((score) => (
			<li
				css={`
					width: ${score * 10}%;
				`}
			></li>
		))}
	</ul>
)
