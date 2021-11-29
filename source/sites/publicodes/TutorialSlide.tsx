export default ({ children, last, skip }) => {
	return (
		<div
			className="ui__ card light colored content"
			css={`
				margin-top: 0.6rem;
				> svg,
				> img {
					margin: 0.4rem auto;
					display: block;
				}
				p > img,
				p > svg {
					vertical-align: middle;
				}
				h1 {
					margin-top: 1rem;
					font-size: 160%;
				}
			`}
		>
			{children}
			<div
				css={`
					display: flex;
					justify-content: center;
					margin: 2rem 0 0.6rem;
				`}
			>
				<button
					className={`ui__ ${!last ? 'dashed-button' : 'button'}`}
					onClick={() => skip('testIntro')}
				>
					{!last ? 'Passer le tutoriel' : "C'est parti !"}
				</button>
			</div>
		</div>
	)
}
