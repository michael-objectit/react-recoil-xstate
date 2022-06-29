import { createMachine } from "xstate";

type TenantsType = Record<string, any>[];

export interface TenantsContext {
  tenants: TenantsType;
}

export const TenantsState = {
  id: "TenantsMachine",
  exit: "clearTenants",
  initial: "init",
  context: {
    tenants: [] as TenantsType
  },
  states: {
    init: {
      always: {
        cond: "checkIfHasTenants",
        target: "fetchingTenants",
      },
    },
    loaded: {},
    fetchingTenants: {
      invoke: {
        src: "fetchTenants",
        id: "fetch-tenants",
        onDone: [
          {
            actions: "fetchedTenants",
            target: "loaded",
          },
        ],
        onError: [
          {
            target: "loaded",
          },
        ],
      },
    },
  },
};

export default createMachine<TenantsContext>(TenantsState);
