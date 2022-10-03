import styled from 'styled-components'

const Section = styled.section`
	margin: 0 auto 1rem;
	font-family: 'Marianne', sans-serif;
`
Section.TopTitle = styled.h1`
	font-size: 5.5rem;
	text-align: center;
	margin-bottom: 3rem;
	font-family: 'Marianne', sans-serif;

	@media screen and (max-width: ${800}px) {
		font-size: 4rem;
	}
`
Section.Title = styled.h2`
	font-size: 2.5em;
	font-family: 'Marianne', sans-serif;
	margin-top: 1rem;
`

Section.Intro = styled.details`
	font-size: 1rem;
	line-height: 1.3rem;
	margin: 1rem 0 1rem 0;
	> summary {
		font-size: 1.3rem;
		margin-bottom: 0.5rem;
	}
`

Section.Sector = styled.span`
	color: red;
`

export default Section
