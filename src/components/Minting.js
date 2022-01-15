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
  const [purchaseLimit, setPurchaseLimit] = useState("");
  const [currentStage, setCurrentStage] = useState("");
  const [currentSupply, setCurrentSupply] = useState(0);

  useEffect(() => {
    if (cntMint <= 1) setCntMint(1);
    else if (cntMint > 10) setCntMint(10);
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

    let pLimit =
      stVal === 0
        ? "8 Max Per Wallet for Gold Rollerlist members, 5 Max Per Wallet for Silver Rollerlist members"
        : "";

    setPurchaseLimit(pLimit);
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

  const handleMint = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const HighRollerContract = new ethers.Contract(
      process.env.REACT_APP_NFT_ADDRESS,
      ContractAbi,
      provider.getSigner()
    );

    let totalPrice = STAGE_PRICE[stageVal] * cntMint;
    let price = ethers.utils.parseEther(totalPrice.toString());

    try {
      if (stageVal === 0) {
        const account = window.ethereum.selectedAddress;
        const merkleObj = proofMerkle(account);
        console.log(merkleObj);
        const category = merkleObj.category;
        const proof = merkleObj.proof;

        if (category === 0) {
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
                toast.error("Transaction Error!");
              }
            });
        } else if (category === 1) {
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
                toast.error("Transaction Error!");
              }
            });
        } else {
          toast.error("Unknown Error!");
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
              toast.error("Transaction Error!");
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
        <Col sm={7}>
          <Image src="background.PNG" className="high-roller-image" />
        </Col>
        <Col xs={5} className="mint-column">
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
              <span className="font-3">{STAGE_PRICE[stageVal]} ETH</span>
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
