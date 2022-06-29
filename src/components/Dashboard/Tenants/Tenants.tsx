import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useMachine } from "@xstate/react";
import { assign } from "xstate";
import { apiService } from "../../../api/api";
import userState from "../../../states/user.state";
import tenantsMachine from "../../../state-machines/tenants.machine";

type TenantsType = Record<string, any>[];

function useTenants() {
  const { tenants: tenantIds } = useRecoilValue(userState);
  const [tenants, setTenants] = useState([] as TenantsType);

  useEffect(() => {
    if (tenantIds) {
      const fetchTenants = async function fetchTenants() {
        const url = tenantIds.map((tenantId) => `id=${tenantId}`).join("&");
        const _tenants = await apiService(`/tenants?${url}`);
        setTenants(_tenants);
      };
      fetchTenants();
    } else {
      setTenants([]);
    }
  }, [tenantIds]);

  return tenants || [];
}

function useTenantsMachine() {
  const { tenants: tenantIds } = useRecoilValue(userState);
  const [tenantsState] = useMachine(tenantsMachine, {
    guards: {
      checkIfHasTenants: () => tenantIds?.length > 0,
    },
    services: {
      fetchTenants: async () => {
        const url = tenantIds.map((tenantId) => `id=${tenantId}`).join("&");
        return await apiService(`/tenants?${url}`);
      },
    },
    actions: {
      fetchedTenants: assign({
        tenants: (_, event) => event.data,
      }),
      clearTenants: assign({ tenants: [] }),
    }
  });

  return tenantsState.context.tenants || [];
}

export default function Tenants() {
  // const tenants = useTenants();
  const tenants = useTenantsMachine();

  return (
    <div>
      <b>Tenants:</b>
      {tenants.map((tenant) => (
        <div key={tenant.id}>
          <code>{tenant.name}</code>
        </div>
      ))}
      {tenants.length === 0 && (
        <div>
          <code>No tenants for this user.</code>
        </div>
      )}
    </div>
  );
}
