import { QueryClient, QueryClientProvider } from 'react-query'

import StatsContent from '@/components/stats/StatsContent'
import { ScrollToTop } from '@/components/utils/Scroll'

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
			<ScrollToTop />
			<StatsContent />
		</QueryClientProvider>
	)
}
