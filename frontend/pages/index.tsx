import React from "react";
import App from "@/components/App"
import LandingPage from "@/components/LandingPage";
import { useAccount } from "wagmi";
import Layout from "@/components/Layout";

const renderPage = (isConnected: boolean) => {
  return !isConnected? <LandingPage/> : <App />
}

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <Layout>
      {
        renderPage(isConnected)
      }
    </Layout>
  )
}