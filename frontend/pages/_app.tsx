// import React from 'react'
// import '@/styles/globals.css';
// import Head from 'next/head'
// import styles from '@/styles/Home.module.css'
// import type { AppProps } from 'next/app'

// export default function App({ Component, pageProps }: AppProps) {
//   return(
//     <React.Fragment>
//       <Head>
//         <title>Celo staking tutorial</title>
//         <meta name="description" content="generic staking dapp on Celo blockchain" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <main className={styles.main}>
//         <Component {...pageProps} />
//       </main>
//     </React.Fragment>
//   );
// }


import React from "react";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { WagmiProvider  } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/config";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
    const [isMounted, setIsMounted] = React.useState(false);
    
    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        isMounted? <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <Component {...pageProps} />
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider> : null
    );
}

export default App;
