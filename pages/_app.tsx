import '../styles/globals.css'
import type { AppProps } from 'next/app'

/* REACT */
import { useState } from 'react'

/* REACT QUERY */
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'


function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
       <Hydrate state={pageProps.dehydratedState}>
         <Component {...pageProps} />
       </Hydrate>
     </QueryClientProvider>
  )
}

export default MyApp
