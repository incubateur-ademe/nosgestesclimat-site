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

export default function Dashboard() {
	return (
		<QueryClientProvider client={queryClient}>
			<StatsContent />
		</QueryClientProvider>
	)
}
