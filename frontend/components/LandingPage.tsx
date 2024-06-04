import React, { useState} from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { injected } from "wagmi/connectors";
import { useAccount, useConnect } from "wagmi";

export default function LandingPage() {
  const { isConnected } = useAccount()
  const { connect } = useConnect();

  const handleConnect = () => {
    connect({ connector: injected({ target: "metaMask" }) });
  }

  return (
    <React.Fragment>
      <Container maxWidth='md'>
        <div>
          <Stack className="text-center text-yellow-700" >
            <h1 className="text-3xl md:text-7xl font-black">Generic Finance</h1>
            <h3>Improve your earnings through our generic yield strategies</h3>
          </Stack>
          <div >
           
          </div>
        </div>
      </Container>
    </React.Fragment>
  );
}
