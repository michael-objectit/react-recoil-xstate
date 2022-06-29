import { Container, Stack } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { AuthMachineProvider } from "../services/useAuth/AuthMachineProvider";

export default function PageLayout() {
  return (
    <AuthMachineProvider>
      <Stack gap={3}>
        <Header />
        <Container>
          <Outlet />
        </Container>
      </Stack>
    </AuthMachineProvider>
  );
}
