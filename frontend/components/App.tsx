import React, { useMemo, Key } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme } from "@mui/material/styles";
import Footer from "../components/Footer";
import { notification } from "antd";
import { getAddresses } from "@/apis/getAddresses";
import { Address } from "./Address";
import { AppProps, FunctionName, MockProfile, NotificationProps, TransactionResultProps, transactionResult } from "../interfaces";
import { blue, purple } from "@mui/material/colors";
import sendtransaction from "@/apis";
import { ethers, BigNumber } from "ethers";
import { Spinner } from "./Spinner";
import Image from "next/image";
import { useAccount, useConfig } from "wagmi";

const theme = createTheme();

const boxStyle = {
  profile_style: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  span_style: {
    background: "rgba(0, 10, 10, 0.5)",
    border: "0.1em solid gray",
    flexGrow: 1
  },
  topButton: {
    color: 'whitesmoke',
    width: 'fit-content'
  }
}

function getTimeFromEpoch(onchainUnixTime:BigNumber) {
  const toNumber = onchainUnixTime? onchainUnixTime.toNumber() : 0;
  var newDate = new Date(toNumber * 1000);
  return `${newDate.toLocaleDateString("en-GB")} ${newDate.toLocaleTimeString("en-US")}`;
}

export default function App(props: AppProps) {
  const [functionName, setFunctionName] = React.useState<FunctionName>("deposit");
  const [amountToStake, setAmountToStake] = React.useState<number>(0);
  const [tokenRewardBalance, setReward] = React.useState<bigint>(0n);
  const [response, setResponse] = React.useState<any>(MockProfile);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { factoryAbi } = getAddresses();
  const { address: account } = useAccount();
  const config = useConfig();

  const handleAmountChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.preventDefault();
    setAmountToStake(Number(e.target.value));
  };

  const cancelLoading = () => setLoading(false);

  React.useEffect(() => {
    const controller = new AbortController();
    async function getTokenBalance() {
      if(account) {
        const res = await sendtransaction({account, functionName: "balanceOf", config, cancelLoading: cancelLoading});
        setReward(res.result!);
      }
    }

    getTokenBalance();
    return () => controller.abort();
  }, [response,account]);

  const handleContractFunction = (x: string) => setFunctionName(x);

  const displayContractFunctions = useMemo(() => {
    let filt: any;
    if (!factoryAbi) return [];
    filt = factoryAbi.filter(method => method["type"] === "function");
    return filt.filter((method: { name: string }) => method.name === "stake" || method.name === "unstake");
  }, [factoryAbi]);

  const displayedViewFunctions = useMemo(() => {
    let filt: any;
    if (!factoryAbi) return [];
    filt = factoryAbi.filter(method => method["type"] === "function");
    return filt.filter((method: { name: string }) => method.name === "getStakeProfile" || method.name === "withdraw");
  }, [factoryAbi]);

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
    let result: TransactionResultProps | null = transactionResult;
    setLoading(true);

    switch (functionName) {
      case "deposit":
        if (amountToStake === 0) {
          cancelLoading();
          return alert("Please enter amount of Celo to stake in wei");
        }
        const amtInBigNumber = BigNumber.from(amountToStake);
        const value = amtInBigNumber.toBigInt();
        if(account) {
          result = await sendtransaction({ value, functionName, cancelLoading, account, config});
        }
        break;

      case "checkout":
        if(account) {
          result = await sendtransaction({
            functionName,
            cancelLoading,
            config,
            account
          });
        }
        break;

      case "getProfile":
        if(account) {
          result = await sendtransaction({
            functionName,
              cancelLoading,
              config,
              account
          });
        }
        break;

      default:
        if(account) {
          result = await sendtransaction({
            functionName: "withdraw",
              cancelLoading,
              config,
              account
          });
        }
        break;
    }
    if(!result?.view) {
      openNotification({message: "Transaction completed with hash:", description: ""});
    } else {
      setResponse(result?.result);
    }
  };

  return (
    <React.Fragment>
      {/* <CssBaseline /> */}
      <Container maxWidth='md' component={'main'}>
        <AppBar position="static" sx={{background:'none'}}>
          <Toolbar sx={boxStyle.profile_style}>
            {/* <Box sx={boxStyle.profile_style}> */}
              <Button variant="outlined" style={boxStyle.topButton} startIcon='Vault Balance:' endIcon={`${response?.account ? ethers.utils.formatEther(response?.celoAmount?.toString()) : 0} ${' $Celo'}`} />
              <Button variant="outlined" style={boxStyle.topButton} startIcon='Staked time:' endIcon={getTimeFromEpoch(response?.depositTime)} />
              <Button variant="outlined" style={boxStyle.topButton} startIcon='RTK Reward:' endIcon={ethers.utils.formatEther(tokenRewardBalance.toString())} />
            {/* </Box> */}
          </Toolbar>
        </AppBar>
      </Container>
      <Container maxWidth='sm' component={'main'}>
        <Typography variant="h6" component="div" sx={{ display: 'flex', justifyContent: 'space-around', alignItems:'center'}}>
          <span style={{color: 'green'}}>Connected!:</span> <Address account={account} size={6} copyable={true} display />
        </Typography>
        <Box
          sx={{
            marginTop: 8,
            display: "grid",
            // flexDirection: "column",
            alignItems: "center"
          }}
        >
          <div className="marquee">
            <p className='inner' > Mininum staking : 0.1 $CELO </p>
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Avatar sx={{ m: 1,}}>
              <Image src='/celologopng.png' width={100} height={40} alt='celoLogo'/>
            </Avatar>
          </div>
          <Typography component="h1" variant="h5" sx={{display: 'flex',justifyContent: 'space-around'}}>
            <span style={{color: 'blue'}}>Stake $ Celo</span> <span style={{color: 'green'}}> Earn $RTK</span>
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div className="funcDiv">
                <Typography variant="h5">Transact</Typography>
                {displayContractFunctions.map((item: any, id: Key) => (
                  <Button
                    sx={{
                      "&:hover": {
                        color: "whitesmoke",
                        width: "fit-content",
                        border: `0.1em solid ${purple[900]}`
                      }
                    }}
                    onClick={() => handleContractFunction(item.name)}
                    key={id}
                    variant={"text"}
                  >
                    {item?.name}
                  </Button>
                ))}
              </div>
              <div className="funcDiv">
                <Typography variant="h5">Read</Typography>
                {displayedViewFunctions.map((item: any, id: Key) => (
                  <Button
                    sx={{
                      "&:hover": {
                        color: "whitesmoke",
                        width: "fit-content",
                        border: `0.1em solid ${purple[900]}`
                      }
                    }}
                    onClick={() => handleContractFunction(item?.name)}
                    key={id}
                    variant={"text"}
                  >
                    {item?.name}
                  </Button>
                ))}
              </div>
            </Box>
            {functionName === "deposit" && <TextField margin="normal" required fullWidth id="text" label="Amount to stake" name="amount" autoComplete="amount" type={"number"} autoFocus sx={{ border: `0.1em solid ${blue[900]}`, borderRadius: "5px" }} style={{ color: "whitesmoke" }} onChange={(e) => handleAmountChange(e)} />}
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
              { loading? <span>Trxn in Progress ... <Spinner color={"white"} /></span> : functionName }
            </Button>
          </Box>
        </Box>
      </Container>
      <Footer sx={{ mt: 8, mb: 4 }} />
    </React.Fragment>
  );
}
