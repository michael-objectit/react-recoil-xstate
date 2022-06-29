import { useState } from "react";
import { Container, Form } from "react-bootstrap";

function useTenantForm() {
  const [form, setForm] = useState({});

  function onChange({
    target: {
      event: { name, value },
    },
  }: any) {
    const _form = { ...form, [name]: value };
    setForm(_form);
  }

  return {
    form,
    onChange,
  };
}

export default function TenantForm() {
  const { onChange } = useTenantForm();

  return (
    <div>
      <div>
        <b>Tenant Form:</b>
      </div>
      <Container>
        <Form.Group className="mb-3">
          <Form.Label>Name:</Form.Label>
          <Form.Control
            name="name"
            type="text"
            placeholder="Enter name"
            onChange={onChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Address:</Form.Label>
          <Form.Control
            name="address"
            type="address"
            placeholder="Enter address"
            onChange={onChange}
          />
        </Form.Group>
      </Container>
    </div>
  );
}
