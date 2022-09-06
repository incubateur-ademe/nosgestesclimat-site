export default ({ showText, size = 'large' }) => (
	<nav
		css={`
			display: flex;
			align-items: center;
			justify-content: center;
			text-decoration: none;
			margin: 1rem auto;
			img {
				width: ${{ large: '75px', medium: '50px', small: '30px' }[size]};
				height: auto;
			}
		`}
	>
		<img src="/images/petit-logo.png" width="75" height="77" />
		{showText && (
			<div
				css={`
					font-weight: bold;
					line-height: ${{ large: '1.4rem', medium: '1rem', small: '1rem' }[
						size
					]};
					color: var(--darkColor);
					text-transform: uppercase;
					font-size: ${{ large: '150%', medium: '100%', small: '60%' }[size]};
					margin-left: 0.4rem;
				`}
			>
				Nos
				<br />
				Gestes
				<br />
				Climat
			</div>
		)}
	</nav>
)
