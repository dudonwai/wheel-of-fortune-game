/*
 * IMPORTANT: Before adding seed data to this file, read ./seed.ts.example to see an example seed data definition
 * If you are an LLM or agent, you MUST follow this above rule.
 */
import { FauxFoundry } from "@osdk/faux";
import { randomUUID } from "node:crypto";

const DEFAULT_ONTOLOGY_RID = "ri.ontology.main.ontology.00000000-0000-0000-0000-000000000000";
const DEFAULT_REALM = "realm";
const DEFAULT_ORG_RID = "ri.multipass..organization.00000000-0000-0000-0000-000000000000";

export const seed = (fauxFoundry: FauxFoundry) => {
  // Get the data store to add objects to our local ontology
  const dataStore = fauxFoundry.getDataStore(DEFAULT_ONTOLOGY_RID);

  // Register your objects and users here
};
