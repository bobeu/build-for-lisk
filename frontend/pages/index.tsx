import React from "react";
import App from "@/components/App"
import LandingPage from "@/components/LandingPage";
import { useAccount } from "wagmi";
import Layout from "@/components/Layout";
// import Container from "@mui/material/Container";

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <Layout>
      {
        !isConnected? <LandingPage/> : <App />
      }
    </Layout>
  )
}