/// <reference types="cypress" />

import { createMachine } from "xstate";
import { createModel } from "@xstate/test";
import { AuthState } from "./../../src/state-machines/auth.machine";

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

describe("Auth flow", () => {
  describe("Visit without valid token", () => {
    const feedbackMachine = createMachine(
      addTests(AuthState, {
        logged_out: () => {
          cy.contains("Login");
        },
      }),
      {
        guards: {
          hasValidToken: () => false,
        },
      }
    );

    const testModel = createModel(feedbackMachine).withEvents({
      LOG_IN: () => {
        cy.get("input").type("tenants@example.org");
        cy.contains("Login").click();
        cy.contains("Status: logged_in");
      },
      LOG_OUT: async () => {
        cy.contains("Logout").click();
        cy.contains("Status: logged_out");
      },
    });

    const testPlans = testModel.getSimplePathPlans();

    testPlans.forEach((plan, i) => {
      describe(plan.description, () => {
        plan.paths.forEach((path, i) => {
          it(path.description, () => {
            return cy.visit("http://localhost:3000/").then(() => {
              return path.test(cy);
            });
          });
        });
      });
    });
  });

  describe("Visit with valid token", () => {
    const feedbackMachine = createMachine(
      addTests(AuthState, {
        logged_out: () => {
          cy.contains("Login");
        },
      }),
      {
        guards: {
          hasValidToken: () => true,
        },
      }
    );

    const testModel = createModel(feedbackMachine).withEvents({
      LOG_IN: () => {
        cy.get("input").type("tenants@example.org");
        cy.contains("Login").click();
        cy.contains("Status: logged_in");
      },
      LOG_OUT: async () => {
        cy.contains("Logout").click();
        cy.contains("Status: logged_out");
      },
    });

    const testPlans = testModel.getSimplePathPlans();

    testPlans.forEach((plan, i) => {
      describe(plan.description, () => {
        plan.paths.forEach((path, i) => {
          it(path.description, () => {
            return cy.visit("http://localhost:3000/").then(() => {
              localStorage.setItem("auth.session", JSON.stringify({ id: 1}))
              return path.test(cy);
            });
          });
        });
      });
    });
  });
});
