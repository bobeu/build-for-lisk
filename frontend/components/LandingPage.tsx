import React, { useState} from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { injected } from "wagmi/connectors";
import { useAccount, useConnect } from "wagmi";
import Image from "next/image";

export default function LandingPage() {
  const [path, setPath] = React.useState<number>(0);
  const { isConnected } = useAccount()
  const { connect } = useConnect();

  React.useEffect(() => {
    setTimeout(() => {
      setPath((p) => p === 2? 0 : p + 1);
    }, 3000);
  });

  return (
    <React.Fragment>
      <Container maxWidth='md'>
        <div className="space-y-8 p-4">
          <Stack className="text-center text-cyan-500 text-xl space-y-10 font-semibold" >
            <h1 className="text-3xl md:text-[100px] font-black">Generic Finance</h1>
            <h3 className="text-cyan-200">{IMAGE_ITEMS[path].text}</h3> 
          </Stack>
          <div className="flex flex-col justify-center items-center border-2 border-stone-900 rounded-xl pt-6 px-4">
            <Image 
              src={IMAGE_ITEMS[path].path}
              alt={IMAGE_ITEMS[path].alt}
              width={400}
              height={400}
            />
          </div>
        </div>
      </Container>
    </React.Fragment>
  );
}

const IMAGE_ITEMS = [
  {
    path: "/investor.svg",
    alt: "investor",
    text: "Maximize your investment through our autonomous yield farming"
  },
  {
    path: "/growInvestment.svg",
    alt: "growInvestment",
    text: "Grow your wealth through our generic yield strategies"
  },
  {
    path: "/successfactor.svg",
    alt: "successfactor",
    text: "Watch while it grows"
  },
]