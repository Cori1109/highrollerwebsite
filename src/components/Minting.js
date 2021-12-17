import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Image, Row, Col, Form, Button } from "react-bootstrap";
import { ethers } from "ethers";
import web3 from "web3";
import ContractAbi from "../Abis/HighRollerNFT.json";
import { PRESALE_PRICE, PUBLICSALE_PRICE } from "../config";
require("dotenv").config();

export default function Minting() {
  const [cntMint, setCntMint] = useState(1);

  useEffect(() => {
    if (cntMint <= 1) setCntMint(1);
    else if (cntMint > 10) setCntMint(10);
  }, [cntMint]);

  const publicMint = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const HighRollerContract = new ethers.Contract(
      process.env.REACT_APP_NFT_ADDRESS,
      ContractAbi,
      provider.getSigner()
    );

    let pubsalePrice = PUBLICSALE_PRICE * cntMint;
    let price = ethers.utils.parseEther(pubsalePrice.toString());
    // const balances = await provider.getSigner().getBalance();

    // let compareResult = price - balances;
    // console.log("compareResult", compareResult);
    // if (compareResult > 0) {
    //   toast.error("Insufficient Funds!");
    //   return;
    // }

    try {
      await HighRollerContract.requestPublicSale(cntMint, { value: price })
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
    } catch (error) {
      console.log("public sale error", error);
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
            <div className="font-2">10 Max Per Wallet</div>
            <div className="ethereum-container">
              <Image src="ethereum.png" className="ethereum-logo" />
              <span className="font-3">0.03 ETH</span>
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
            <Button variant="success" className="btn-mint" onClick={publicMint}>
              MINT NOW
            </Button>
            <div className="font-4 margin-top-50">Sold Out</div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
