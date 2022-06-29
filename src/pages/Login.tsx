import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import useAuth from "../services/useAuth/useAuth";
import db from "../api/db.json";
import { Stack } from "react-bootstrap";

export default function Login() {
  const { authState, sendToAuthMachine } = useAuth();
  const [email, setEmail] = useState("");

  return (
    <div>
      <div>
        AuthMachine state: <b>{`${authState.value}`}</b>
      </div>
      <br />
      <Container>
        <Form.Group className="mb-3">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={({ target: { value } }) => setEmail(value)}
          />
        </Form.Group>
        <Button
          onClick={() =>
            sendToAuthMachine({
              type: "LOG_IN",
              email,
            })
          }
          disabled={!authState.can("LOG_IN")}
        >
          Login
        </Button>
      </Container>
      <br />
      <code>
        <b>Available users:</b>
        <Stack>
          {db.users.map(({ email }) => (
            <i>{email}</i>
          ))}
        </Stack>
      </code>
    </div>
  );
}
