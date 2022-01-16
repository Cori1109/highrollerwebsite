import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Image, Row, Col, Form, Button } from "react-bootstrap";
import { ethers } from "ethers";
import web3 from "web3";
import ContractAbi from "../Abis/HighRollerNFT.json";
import { STAGE_PRICE, MAX_ELEMENTS } from "../config";
import { proofMerkle } from "../merkle/proofMerkle";
require("dotenv").config();

export default function Minting() {
  const [cntMint, setCntMint] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [stageVal, setStageVal] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const [currentSupply, setCurrentSupply] = useState(0);
  const [category, setCategory] = useState(0);

  useEffect(() => {
    if (cntMint <= 1) setCntMint(1);
    else if (cntMint > 10) setCntMint(10);

    const account = window.ethereum.selectedAddress;
    const merkleObj = proofMerkle(account);
    const _category = merkleObj.category;
    setCategory(_category);
  }, [cntMint]);

  useEffect(() => {
    getStage();
  });

  const getStage = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const HighRollerContract = new ethers.Contract(
      process.env.REACT_APP_NFT_ADDRESS,
      ContractAbi,
      provider.getSigner()
    );

    let pauseVal = await HighRollerContract.MINTING_PAUSED();

    let stVal = web3.utils.toDecimal(await HighRollerContract.CURRENT_STAGE());
    let totalSupply = web3.utils.toDecimal(
      await HighRollerContract.totalSupply()
    );
    setCurrentSupply(totalSupply);

    setStageVal(stVal);
    if (!pauseVal) {
      if (stageVal === 0) setCurrentStage("Current Stage is Pre Sale");
      if (stageVal === 1) setCurrentStage("Current Stage is Public Sale");
      setIsPaused(false);
    } else {
      setCurrentStage("Minting is paused!");
      setIsPaused(true);
    }
    if (totalSupply === MAX_ELEMENTS) {
      setCurrentStage("Sold Out");
      setIsPaused(true);
    }
  };

  const getReadableErrorMsg = (error) => {
    console.log("================");
    console.log(error);
    let readableErrorMsg = "Transaction Error";

    if (error.message.indexOf("Address does not exist in list") > 0) {
      readableErrorMsg = "You are not in the respective whitelist";
    } else if (error.message.indexOf("All tokens have been minted") > 0) {
      readableErrorMsg = "All tokens have been minted";
    } else if (error.message.indexOf("Purchase would exceed max supply") > 0) {
      readableErrorMsg = "Please choose less amount. Not enough tokens left";
    } else if (error.message.indexOf("Minting is not active") > 0) {
      readableErrorMsg = "Minting is not active. It will be resumed soon";
    } else if (error.message.indexOf("All tokens have been minted") > 0) {
      readableErrorMsg = "All tokens have been sold out";
    } else if (error.message.indexOf("Purchase exceeds max allowed") > 0) {
      if (category === 0)
        readableErrorMsg = "You are not allowed to mint more than 8 NFTs";
      else readableErrorMsg = "You are not allowed to mint more than 5 NFTs";
    } else if (error.message.indexOf("ETH amount is not sufficient") > 0) {
      readableErrorMsg = "You don't have enough money";
    } else if (error.message.indexOf("ETH amount is not sufficient") > 0) {
      readableErrorMsg = "You don't have enough money";
    }

    return readableErrorMsg;
  };

  const handleMint = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const HighRollerContract = new ethers.Contract(
      process.env.REACT_APP_NFT_ADDRESS,
      ContractAbi,
      provider.getSigner()
    );

    let totalPrice =
      (stageVal === 0
        ? category === 0
          ? STAGE_PRICE[0]
          : STAGE_PRICE[1]
        : STAGE_PRICE[2]) * cntMint;
    let price = ethers.utils.parseEther(totalPrice.toString());

    try {
      if (stageVal === 0) {
        const account = window.ethereum.selectedAddress;
        const merkleObj = proofMerkle(account);
        console.log(merkleObj);
        const _category = merkleObj.category;
        setCategory(_category);
        const proof = merkleObj.proof;

        if (_category === 0) {
          await HighRollerContract.friendSale(proof, cntMint, { value: price })
            .then((tx) => {
              return tx.wait().then(
                (receipt) => {
                  // This is entered if the transaction receipt indicates success
                  console.log("receipt", receipt);
                  toast.success("Your mint was Successful!");
                  return true;
                },
                (error) => {
                  console.log("error", error);
                  toast.error("Your mint was Failed!");
                }
              );
            })
            .catch((error) => {
              console.log(error);
              if (error.message.indexOf("signature") > 0) {
                toast.error("You canceled transaction!");
              } else {
                toast.error(getReadableErrorMsg(error));
              }
            });
        } else if (_category === 1) {
          await HighRollerContract.discordSale(proof, cntMint, { value: price })
            .then((tx) => {
              return tx.wait().then(
                (receipt) => {
                  // This is entered if the transaction receipt indicates success
                  console.log("receipt", receipt);
                  toast.success("Your mint was Successful!");
                  return true;
                },
                (error) => {
                  console.log("error", error);
                  toast.error("Your mint was Failed!");
                }
              );
            })
            .catch((error) => {
              console.log(error);
              if (error.message.indexOf("signature") > 0) {
                toast.error("You canceled transaction!");
              } else {
                toast.error(getReadableErrorMsg(error));
              }
            });
        } else {
          toast.error("You are not in the WhiteList!");
        }
      } else if (stageVal === 1) {
        await HighRollerContract.publicMint(cntMint, { value: price })
          .then((tx) => {
            return tx.wait().then(
              (receipt) => {
                // This is entered if the transaction receipt indicates success
                console.log("receipt", receipt);
                toast.success("PublicSale Success!");
                return true;
              },
              (error) => {
                console.log("error", error);
                toast.error("PublicSale Fail!");
              }
            );
          })
          .catch((error) => {
            console.log(error);
            if (error.message.indexOf("signature")) {
              toast.error("You canceled transaction!");
            } else {
              toast.error(getReadableErrorMsg(error));
            }
          });
      }
    } catch (error) {
      console.log("Minting error", error);
    }
  };

  return (
    <div>
      <Row className="mint-section">
        <Col sm={6}>
          <Image src="background.PNG" className="high-roller-image" />
        </Col>
        <Col xs={6} className="mint-column">
          <div>
            <div className="font-1">We Are Launching High Rollers</div>
            {/* <div className="font-2">{purchaseLimit}</div> */}
            <div className="font-2">
              {stageVal === 0
                ? "8 Max Per Wallet for Gold Rollerlist members"
                : ""}
            </div>
            <div className="font-2">
              {stageVal === 0
                ? "5 Max Per Wallet for Silver Rollerlist members"
                : ""}
            </div>
            <div className="ethereum-container">
              <Image src="ethereum.png" className="ethereum-logo" />
              <span className="font-3">
                {stageVal === 0
                  ? category === 0
                    ? STAGE_PRICE[0]
                    : STAGE_PRICE[1]
                  : STAGE_PRICE[2]}{" "}
                ETH
              </span>
            </div>
            <div className="mint-controller-group">
              <Button
                className="mint-control"
                onClick={(e) => {
                  setCntMint((prevCntMint) => prevCntMint - 1);
                }}
              >
                -
              </Button>
              <Form.Control
                className="mint-input"
                name="mintNumber"
                value={cntMint}
              />
              <Button
                className="mint-control"
                onClick={(e) => {
                  setCntMint((prevCntMint) => prevCntMint + 1);
                }}
              >
                +
              </Button>
            </div>
            <div className="font-2 margin-bottom-40">
              {currentSupply} / 7777
            </div>
            {isPaused ? (
              <div disabled>
                <Image src="mint-now-button.png" />
              </div>
            ) : (
              <div className="div-mint">
                <div className="btn-mint" onClick={handleMint}>
                  <Image src="mint-now-button.png" />
                </div>
              </div>
            )}
            <div className="font-4 margin-top-50">{currentStage}</div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
