import { Nav, Image } from "react-bootstrap";

export default function Contact() {
  return (
    <div className="contact-section">
      <div className="contact-group">
        <Nav.Link href="https://twitter.com/HighRollersccc">
          <Image src="twitter-button.png" />
        </Nav.Link>
        <Nav.Link href="https://discord.gg/b4Zfmk86ZS">
          <Image src="discord-button.png" />
        </Nav.Link>
        <Nav.Link href="#">
          <Image src="opensea-button.png" />
        </Nav.Link>
        <Nav.Link href="#">
          <Image src="verified-contract-button.png" />
        </Nav.Link>
      </div>
    </div>
  );
}
