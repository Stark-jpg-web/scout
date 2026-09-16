import { QueryClient,QueryCache  } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error(`[API Error in ${query.queryKey.join('/')}]:`, error.message)

      if (error?.status) {
        const messageByStatus = {
          401: ' authorization failed. Check your API Read Access Token.',
          404: 'The requested  resource was not found.',
          429: ' rate limit reached. Please try again shortly.',
        }
        const message = messageByStatus[error.status] ?? 'Unknown API error.'
        console.warn(message)
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
