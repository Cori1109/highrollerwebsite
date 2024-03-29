import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Navbar, Nav, Container, Button, Image } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../utils/connector";
import logo from "../logo.svg";
require("dotenv").config();

export default function NavbarHeader() {
  const { chainId, active, activate, deactivate, account } = useWeb3React();
  const [isWrongNetwork, setIsWrongNetwork] = useState();

  useEffect(() => {
    if (active) {
      if (chainId !== parseInt(process.env.REACT_APP_CHAIN_ID)) {
        toast.error(
          "You are on wrong network. Please switch to Ethereum Mainnet to continue"
        );
        setIsWrongNetwork(true);
      } else {
        setIsWrongNetwork(false);
      }
    }
  }, [chainId]);

  async function connect(injected) {
    activate(injected);
  }

  async function disConnect(injected) {
    deactivate(injected);
  }

  const renderButton = (
    <>
      {active ? (
        <div className="connectedWallet">
          <div className="walletAddress">{account}</div>
          <div className="connectWallet" onClick={() => disConnect(injected)}>
            <img src="disconnect-button.png" alt="disconbtn" />
          </div>
        </div>
      ) : (
        <div className="connectWallet" onClick={() => connect(injected)}>
          <img src="connect-button.png" alt="conbtn" />
        </div>
      )}
    </>
  );

  return (
    <Navbar className="navbar-section">
      <Container className="full-width">
        <Navbar.Brand href="#">
          <Image src="logo_2.png" width={100} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <div id="basic-navbar-nav" className="nav-connect-bar">
          <div className="div-mint">
            <Button variant="link" className="btn-collection">
              View your collection
            </Button>
            <div className="btn-connect">{renderButton}</div>
          </div>
        </div>
      </Container>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "white",
              paddingLeft: 40,
              paddingRight: 40,
              fontWeight: 500,
            },
          },
          error: {
            style: {
              background: "white",
              color: "black",
              paddingLeft: 40,
              paddingRight: 40,
              fontWeight: 500,
            },
          },
        }}
      />
    </Navbar>
  );
}
