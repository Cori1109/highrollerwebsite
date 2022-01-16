import { Nav, Image } from "react-bootstrap";
import logo from "../logo.svg";

export default function Footer() {
  return (
    <div className="footer-section">
      <div className="Terms">
        <div>DAW Terms &amp; Conditions</div>
        <div>© 2021 High Rollers</div>
      </div>
      <div className="logo">
        <Nav.Link href="#">
          <Image src="logo_2.png" width={100} />
        </Nav.Link>
      </div>
      <div className="social">
        <Nav.Link
          href="https://discord.gg/b4Zfmk86ZS"
          className="social-logo-container"
        >
          <Image src="discord.png" className="social-logo" />
        </Nav.Link>
        <Nav.Link
          href="https://twitter.com/HighRollersccc"
          className="social-logo-container"
        >
          <Image src="twitter.png" className="social-logo" />
        </Nav.Link>
      </div>
    </div>
  );
}
