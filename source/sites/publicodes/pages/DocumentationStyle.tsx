import styled from 'styled-components'

export default styled.div`
	padding: 0 0.6rem;
	#documentation-rule-root > p:first-of-type {
		display: inline-block;
		background: var(--lighterColor);
		padding: 0.4rem 0.6rem 0.2rem;
	}
	header {
		color: var(--textColor);
		small {
			color: inherit;
		}
		a {
			color: var(--textColor);
		}
		a:hover {
			background: var(--darkerColor) !important;
			color: white !important;
		}
		h1 {
			color: inherit;
			margin-top: 0.6rem;
			margin-bottom: 0.6rem;
			a {
				text-decoration: none;
			}
		}
		background: linear-gradient(60deg, var(--darkColor) 0%, var(--color) 100%);
		padding: 0.6rem 1rem;
		box-shadow: 0 1px 3px rgba(var(--rgbColor), 0.12),
			0 1px 2px rgba(var(--rgbColor), 0.24);
		border-radius: 0.4rem;
	}
	button {
		color: inherit;
	}
	span {
		background: inherit;
	}
	small {
		background: none !important;
	}
	li {
		&.active .content {
			background-color: transparent !important;
			a:hover {
				color: white !important;
			}
		}
	}
	#documentation-rule-root > article {
		max-width: 800px;
	}
`
