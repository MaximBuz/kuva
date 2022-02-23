import '../styles/globals.css'
import type { AppProps } from 'next/app'

/* REACT */
import { useState } from 'react'

/* REACT QUERY */
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from "react-query/devtools";

/* AUTH */
import { AuthProvider } from '../utils/auth'


function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
       <Hydrate state={pageProps.dehydratedState}>
        <AuthProvider>
         <Component {...pageProps} />
        </AuthProvider>
       </Hydrate>
       <ReactQueryDevtools initialIsOpen={false} position={"bottom-right"} />
     </QueryClientProvider>
  )
}

export default MyApp
