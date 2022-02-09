import React from 'react'
import styled from 'styled-components'
import { QueryClient, QueryClientProvider } from 'react-query'

import StatsContent from 'Components/stats/StatsContent'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			refetchOnWindowFocus: false,
			refetchInterval: false,
		},
	},
})

const Title = styled.h1`
	font-size: 5rem;
	text-align: center;
	margin-bottom: 3rem;
`
const PageWrapper = styled.div`
	/* margin-right: 0;
	width: 100%; */
	/* max-width: calc(100%-12rem); */
	/* @media screen and (min-width: ${800}px) and (max-width: ${1200}px) {
		width: calc(100% - 12rem);
	} */
`
export default function Dashboard(props) {
	return (
		<QueryClientProvider client={queryClient}>
			<PageWrapper>
				<Title>Statistiques</Title>
				<StatsContent />
			</PageWrapper>
		</QueryClientProvider>
	)
}
