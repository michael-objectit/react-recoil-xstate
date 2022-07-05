/* eslint-disable jest/valid-title */
import { screen, render } from "@testing-library/react";
import { assign, createMachine } from "xstate";
import { createModel } from "@xstate/test";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { TenantsState } from "../../../state-machines/tenants.machine";
import { addTests } from "../../../utils/testUtil";
import Tenants from "./Tenants";
import userState from "../../../states/user.state";

const userWithTenants = { email: "test", tenants: ["1"] };
const userWithoutTenant = { email: "test", tenants: [] };

const RecoilUserInit = ({ user }: any) => {
  const setUser = useSetRecoilState(userState);
  setUser(user);
  return null;
};
const tenants = [{ name: "Tenant 1" }];

describe("Tenants component", () => {
  describe("No tenants", () => {
    const tenantsMachine = createMachine<any>(
      addTests(TenantsState, {
        loaded: async () => {
          await screen.findAllByText("No tenants for this user.");
        },
        init: async () => {
          await screen.findAllByText("No tenants for this user.");
        },
        fetchingTenants: async () => {
          await screen.findAllByText("No tenants for this user.");
        },
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
    const testPlans = testModel.getSimplePathPlans();

    testPlans.forEach((plan) => {
      describe(plan.description, () => {
        plan.paths.forEach((path) => {
          it(path.description, async () => {
            await path.test(
              render(
                <RecoilRoot>
                  <RecoilUserInit user={userWithoutTenant} />
                  <Tenants />
                </RecoilRoot>
              )
            );
          });
        });
      });
    });
  });

  describe("With tenants", () => {
    const tenantsMachine = createMachine<any>(
      addTests(TenantsState, {
        loaded: async (_: any, { event: { type } }: any) => {
          await screen.findAllByText(
            type.includes("done.") ? "Tenant 1" : "No tenants for this user."
          );
        },
        init: async () => {
          await screen.findAllByText("No tenants for this user.");
        },
        fetchingTenants: async () => {
          await screen.findAllByText("No tenants for this user.");
        },
      }),
      {
        guards: {
          checkIfHasTenants: () => true,
        },
        services: {
          fetchTenants: async () =>
            await new Promise((resolve) => resolve(tenants)),
        },
        actions: {
          fetchedTenants: assign({
            tenants: () => tenants,
          }),
          clearTenants: assign({
            tenants: () => [],
          }),
        },
      }
    );
    const testModel = createModel(tenantsMachine);
    const testPlans = testModel.getSimplePathPlans();

    testPlans.forEach((plan) => {
      describe(plan.description, () => {
        plan.paths.forEach((path) => {
          it(path.description, async () => {
            await path.test(
              render(
                <RecoilRoot>
                  <RecoilUserInit user={userWithTenants} />
                  <Tenants />
                </RecoilRoot>
              )
            );
          });
        });
      });
    });
  });
});
