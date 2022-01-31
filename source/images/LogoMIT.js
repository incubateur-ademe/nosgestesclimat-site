import React from 'react'
import styled, { keyframes } from 'styled-components'

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	text-decoration: none;
`
const Svg = styled.svg`
	width: 1.8rem;
	height: auto;
	margin-right: 0.3rem;
`
const Title = styled.h1`
	margin: 0;
	font-size: 0.875rem;
	color: #ffffff;
`
const Path = styled.path`
	fill: ${(props) => (props.hover ? 'white' : 'var(--color)')};
`

const rotation = () => keyframes`
  50% { transform: rotate(0deg)}
  100% { transform: rotate(360deg)}
`

const Wheel = styled.g`
	${Wrapper} & {
		animation: ${rotation} 5s ease-in-out infinite;
	}
`
export default function LogoMIT({ hover }) {
	return (
		<Wrapper>
			<Svg
				width="56"
				height="56"
				viewBox="0 0 56 56"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Path
					hover={hover}
					fillRule="evenodd"
					clipRule="evenodd"
					d="M53.6667 2.33333H2.33333V53.6667H53.6667V2.33333ZM0 0V56H56V0H0Z"
					fill="#DE0244"
				/>

				<Path
					hover={hover}
					fillRule="evenodd"
					clipRule="evenodd"
					d="M2.10007 46C26.3454 46 46.0001 26.3453 46.0001 2.10001C46.0001 -22.1453 26.3454 -41.8 2.10007 -41.8C-22.1452 -41.8 -41.7999 -22.1453 -41.7999 2.10001C-41.7999 26.3453 -22.1452 46 2.10007 46ZM2.10007 56C31.8682 56 56.0001 31.8682 56.0001 2.10001C56.0001 -27.6681 31.8682 -51.8 2.10007 -51.8C-27.6681 -51.8 -51.7999 -27.6681 -51.7999 2.10001C-51.7999 31.8682 -27.6681 56 2.10007 56Z"
					fill="#DE0244"
				/>
				<Wheel>
					<Path
						hover={hover}
						d="M-45.4999 1.52588e-05H49.0001V3.50002H-45.4999V1.52588e-05Z"
						fill="#DE0244"
					/>
					<Path
						hover={hover}
						d="M-40.0447 23.8595L41.7947 -23.3905L43.5447 -20.3594L-38.2947 26.8906L-40.0447 23.8595Z"
						fill="#DE0244"
					/>
					<Path
						hover={hover}
						d="M-23.3904 41.7947L23.8596 -40.0447L26.8906 -38.2947L-20.3594 43.5447L-23.3904 41.7947Z"
						fill="#DE0244"
					/>
					<Path
						hover={hover}
						d="M8.39233e-05 49L8.01086e-05 -45.5H3.50008L3.50008 49H8.39233e-05Z"
						fill="#DE0244"
					/>
					<Path
						hover={hover}
						d="M23.8596 43.5447L-23.3904 -38.2947L-20.3594 -40.0447L26.8906 41.7947L23.8596 43.5447Z"
						fill="#DE0244"
					/>
					<Path
						hover={hover}
						d="M41.7948 26.8906L-40.0446 -20.3594L-38.2946 -23.3905L43.5448 23.8595L41.7948 26.8906Z"
						fill="#DE0244"
					/>
				</Wheel>
			</Svg>
		</Wrapper>
	)
}
