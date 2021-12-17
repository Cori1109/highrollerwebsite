import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import NavbarHeader from "./components/NavbarHeader";
import Minting from "./components/Minting";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function getLibrary(provider) {
  return new Web3(provider);
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
        <NavbarHeader></NavbarHeader>
        <Minting></Minting>
        <Contact></Contact>
        <Footer></Footer>
      </div>
    </Web3ReactProvider>
  );
}

export default App;
