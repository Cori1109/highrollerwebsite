import { Button } from "react-bootstrap";

export default function Contact() {
  return (
    <div className="contact-section">
      <div className="contact-group">
        <Button variant="success" className="btn-in-contacts">
          TWITTER
        </Button>
        <Button variant="success" className="btn-in-contacts">
          DISCORD
        </Button>
        <Button variant="success" className="btn-in-contacts">
          OPENSEA
        </Button>
        <Button variant="success" className="btn-in-contacts">
          VERIFIED CONTRACT
        </Button>
      </div>
    </div>
  );
}
