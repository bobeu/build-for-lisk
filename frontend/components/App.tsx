import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { notification } from "antd";
import { FunctionName, MockProfile, NotificationProps, Profile} from "../interfaces";
import sendtransaction from "@/apis";
import { ethers, BigNumber } from "ethers";
import { Spinner } from "./Spinner";
import { useAccount, useConfig } from "wagmi";
import { bn } from "@/utilities";
import Stack from "@mui/material/Stack";

function getTimeFromEpoch(onchainUnixTime:BigNumber) {
  const toNumber = onchainUnixTime? onchainUnixTime.toNumber() : 0;
  var newDate = new Date(toNumber * 1000);
  return `${newDate.toLocaleDateString("en-GB")} ${newDate.toLocaleTimeString("en-US")}`;
}

export default function App() {
  const [nameIndex, setNames] = React.useState<number>(0);
  const [amtToinvest, setAmtToInvest] = React.useState<number>(0);
  const [tokenRewardBalance, setReward] = React.useState<bigint>(0n);
  const [response, setResponse] = React.useState<Profile>(new MockProfile().profile);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [displayFunc, setDisplayFunc] = React.useState<boolean>(false);

  const { address: account } = useAccount();
  const config = useConfig();

  const handleContractDisplayClick = () => {
    setDisplayFunc(!displayFunc);
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.preventDefault();
    setAmtToInvest(Number(e.target.value));
  };

  const cancelLoading = () => setLoading(false);

  React.useEffect(() => {
    const controller = new AbortController();
    async function getTokenBalance() {
      if(account) {
        const res = await sendtransaction({account, functionName: "balanceOf", config, cancelLoading: cancelLoading});
        if(res.reward) setReward(res.reward);
      }
    }

    getTokenBalance();
    return () => controller.abort();
  }, [response, account]);

  const handleContractFunction = (arg: number) => {
    setNames(arg);
    setDisplayFunc(false);
  };

  const openNotification = (props: NotificationProps) => {
    const { message, description } = props;

    notification.open({
      placement: "bottomRight",
      message,
      description,
      onClick: () => {
        console.log("Notification Clicked!");
      }
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amtInBigNumber = bn(ethers.utils.parseEther(amtToinvest.toString()).toBigInt());
    if(FUNC_NAMES[nameIndex] == "deposit")  {
      if (amtToinvest === 0) {
        cancelLoading();
        return alert("Please enter amount of Eth to invest in wei");
      }
    }
    if(!account) return;
    setLoading(true);
    console.log("FUNC_NAMES[nameIndex]", FUNC_NAMES[nameIndex])
    const value = amtInBigNumber.toBigInt();
    const result = await sendtransaction({
      value, 
      functionName: FUNC_NAMES[nameIndex], 
      cancelLoading, 
      account, 
      config
     });
     console.log("Result", result);

    if(!result?.view) {
      openNotification({message: "Transaction completed with hash:", description: ""});
    } else {
      if(result.profile) {
        setResponse(result.profile);
      }
      if(result.reward) {
        console.log("Result", result.reward.toString());
        setReward(result.reward);
      }
    }
  };

  const sidebar_button_content = [
    {
      startIcon: "Locked", // Vault balance
      endIcon: `${response?.wallet ? ethers.utils.formatEther(response.ethAmount?.toString()) : 0} ${' $ETH'}`
    },
    {
      startIcon: "Locked Time", // Staked time
      endIcon: `${getTimeFromEpoch(bn(response?.depositTime))}`
    },
    {
      startIcon: "$ERN earned", // Vault balance
      endIcon: `${ethers.utils.formatEther(tokenRewardBalance.toString())}`
    },
  
  ]

  return (
    <React.Fragment>
      <Box className="w-full sm:h-[fit-content] sm:bg-black">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Stack className="w-full h-[500px] text-cyan-200 text-lg font-serif border-2 border-stone-700 rounded-xl p-4 space-y-4">
              {
                sidebar_button_content.map(({endIcon, startIcon}) => (
                  <button disabled className="w-full flex justify-between items-center rounded-lg p-4 bg-stone-900">
                    <h3>{startIcon}</h3>
                    <h3>{endIcon}</h3>
                  </button>
                ))
              }
              <Box className="space-y-2">
                <button onClick={handleContractDisplayClick} className="w-full border-2 border-stone-900 bg-stone-800 hover:bg-stone-700 p-4 rounded-lg font-semibold">Select actions</button>
                {
                  displayFunc && 
                    <div className={`w-full max-h-[190px] py-4 overflow-y-auto flex flex-col border-2 border-stone-900 rounded-lg space-y-2 p-4 bg-stone-800`}>
                      {
                        ACTIONS.map((item, i) => (
                          <button className="border-2 font-serif border-cyan-500 text-left hover:bg-stone-800 p-4 rounded-lg" onClick={() => handleContractFunction(i)} key={item}>{item}</button>
                        ))
                      }
                    </div>
                }
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack spacing={12} className="h-[500px] border-2 border-stone-700 rounded-xl p-4">
              <Stack spacing={6}>
                <div className="flex justify-between items-center text-3xl font-serif border-2 border-stone-700 rounded-xl p-4">
                  <h3>{`Invest $ETH`}</h3>
                  <h3>{`Earn $ERN`}</h3>
                </div>
                <div className="w-full flex justify-between items-center text-3xl font-serif border-2 border-stone-700 rounded-xl p-4">
                  <h3>{`Min. Investment`}</h3>
                  <h3>{`0.000001 $ETH`}</h3>
                </div>
              </Stack>
              <Stack className="place-items-center text-3xl font-serif " component="form" onSubmit={handleSubmit} noValidate>
                {FUNC_NAMES[nameIndex] === "deposit" && (
                  <input 
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => handleAmountChange(e)}
                    type="number"
                    id="Deposit"
                    placeholder="Amount you're willing to invest"
                    required
                    name="deposit"
                    className="w-full text-lg bg-transparent rounded-lg p-2 text-cyan-100"
                  />
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    height: '100px',
                    fontWeight: "bold",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  { loading? <div className="flex justify-between items-center"><h3>{`Trxn in Progress ... `}</h3><Spinner color={"white"} /></div> : ACTIONS[nameIndex] }
                  </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
}

const FUNC_NAMES : FunctionName[] = ["deposit", "checkout", "withdraw", "getProfile", "balanceOf"];
const ACTIONS: string[] = [
    "Lock Eth",
    "UnLock Eth",
    "Withdraw Eth",
    "Onchain profile",
    "Onchain balance",
];
