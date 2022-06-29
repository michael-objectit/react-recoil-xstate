/// <reference types="cypress" />

import { RecoilRoot, useSetRecoilState } from "recoil";
import { assign, createMachine } from "xstate";
import { createModel } from "@xstate/test";
import Tenants from "../../src/components/Dashboard/Tenants/Tenants";
import userState from "../../src/states/user.state";
import { TenantsState } from "../../src/state-machines/tenants.machine";

const userWithTenants = { email: "test", tenants: ["1"] };
const userWithoutTenant = { email: "test" };

function addTests(state: any, tests: any) {
  return {
    ...state,
    states: Object.entries(state.states).reduce((s, [stateKey, stateValue]) => {
      return {
        ...s,
        [stateKey]: {
          ...(stateValue as any),
          meta: {
            ...(stateValue as any).meta,
            test: tests[stateKey],
          },
        },
      };
    }, {}),
  };
}

const RecoilUserInit = ({ user }) => {
  const setUser = useSetRecoilState(userState);
  setUser(user);
  return null;
};

const asyncTest = async (testCallback: () => void) =>
  await new Promise((resolve) => {
    resolve(testCallback());
  });

describe("Tenants component", () => {
  const tenants = [{ name: "Tenant 1" }];

  describe("Without tenants", () => {
    const tenantsMachine = createMachine(
      addTests(TenantsState, {
        loaded: async (_, { event: { type } }) =>
          asyncTest(() => {
            cy.contains(
              type.includes("done.") ? "Tenant 1" : "No tenants for this user."
            );
          }),
        init: async () =>
          asyncTest(() => {
            cy.contains("No tenants for this user.");
          }),
        fetchingTenants: async () =>
          asyncTest(() => {
            cy.contains("No tenants for this user.");
          }),
      }),
      {
        guards: {
          checkIfHasTenants: () => false,
        },
        services: {
          fetchTenants: async () => await new Promise((resolve) => resolve([])),
        },
        actions: {
          fetchedTenants: assign({
            tenants: () => [],
          }),
          clearTenants: assign({
            tenants: () => [],
          }),
        },
      }
    );
    const testModel = createModel(tenantsMachine);
    const testPlans = testModel.getShortestPathPlans();

    testPlans.forEach((plan) => {
      describe(plan.description, () => {
        beforeEach(() => {
          cy.mount(
            <RecoilRoot>
              <RecoilUserInit user={userWithoutTenant} />
              <Tenants />
            </RecoilRoot>
          );
          cy.wait(100);
        });

        plan.paths.forEach((path) => {
          it(path.description, async () => {
            await path.test(null);
          });
        });
      });
    });
  });

  describe("With tenants", () => {
    const tenantsMachine = createMachine(
      addTests(TenantsState, {
        loaded: async (_, { event: { type } }) =>
          asyncTest(() => {
            cy.contains(
              type.includes("done.") ? "Tenant 1" : "No tenants for this user."
            );
          }),
      }),
      {
        guards: {
          checkIfHasTenants: () => true,
        },
        actions: {
          fetchedTenants: assign({
            tenants: () => {
              return tenants;
            },
          }),
        },
      }
    );
    const testModel = createModel(tenantsMachine);
    const testPlans = testModel.getShortestPathPlans();

    testPlans.forEach((plan) => {
      describe(plan.description, () => {
        beforeEach(() => {
          cy.mount(
            <RecoilRoot>
              <RecoilUserInit user={userWithTenants} />
              <Tenants />
            </RecoilRoot>
          );
          cy.wait(100);
        });

        plan.paths.forEach((path) => {
          it(path.description, async () => {
            await path.test(null);
          });
        });
      });
    });
  });
});
