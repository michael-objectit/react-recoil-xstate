import useAuth from "../services/useAuth/useAuth";
import useUser from "../services/useUser/useUser";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function useDashboard() {
  const navigateTo = useNavigate();
  const { authState } = useAuth();
  const { email, tenants } = useUser();

  useEffect(() => {
    if (tenants?.length) {
      navigateTo("/dashboard/tenants");
    } else {
      navigateTo("/dashboard/tenant/new");
    }
  }, [navigateTo, tenants]);

  return {
    email,
    status: authState.value,
  };
}

export default function Dashboard() {
  const { email, status } = useDashboard();

  return (
    <div>
      <div>
        AuthMachine state: <b>{`${status}`}</b>
      </div>
      <div>
        <code>{`Email: ${email}`}</code>
      </div>
      <br />
      <Outlet />
    </div>
  );
}
