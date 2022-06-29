import { Button, Container, Nav } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import useAuth from "../services/useAuth/useAuth";

export default function Header() {
  const { authState, sendToAuthMachine } = useAuth();

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>
          <img
            alt=""
            src="/favicon.ico"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          React + Xstate + Recoil Demo
        </Navbar.Brand>
        <Nav className="justify-content-end">
          {authState.hasTag("logout") && (
            <Button
              onClick={() => sendToAuthMachine("LOG_OUT")}
              disabled={!authState.can("LOG_OUT")}
            >
              Logout
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
