/**
 * OSDK client configuration - managed by Foundry Pilot.
 */

import { createClient, type Client } from "@osdk/client";
import { createPublicOauthClient, type PublicOauthClient } from "@osdk/oauth";

function getMetaTagContent(tagName: string): string {
  const elements = document.querySelectorAll(`meta[name="${tagName}"]`);
  const element = elements.item(elements.length - 1);
  const value = element ? element.getAttribute("content") : undefined;
  if (value == null || value === "") {
    throw new Error(`Meta tag ${tagName} not found or empty`);
  }
  if (value.match(/%.+%/)) {
    throw new Error(
      `Meta tag ${tagName} contains placeholder value. Please add ${value.replace(/%/g, "")} to your .env files`,
    );
  }

  return value;
}

function maybeGetMetaTagContent(tagName: string) {
  try {
    return getMetaTagContent(tagName);
  } catch {
    return undefined;
  }
}

const foundryUrl = getMetaTagContent("osdk-foundryUrl");
const clientId = getMetaTagContent("osdk-clientId");
const redirectUrl = getMetaTagContent("osdk-redirectUrl");
const ontologyRid = getMetaTagContent("osdk-ontologyRid");
const branchRid = maybeGetMetaTagContent("osdk-branchRid");
const scopes = [
  "api:use-ontologies-read",
  "api:use-ontologies-write",
  "api:use-mediasets-read",
  "api:use-mediasets-write",
  "api:use-admin-read",
  "api:use-aip-agents-read",
  "api:use-aip-agents-write",
];

const maybeGetTokenFromEnvVar = optionalMap(import.meta.env.VITE_FOUNDRY_AUTH_TOKEN, token => async () => token);
export const auth: PublicOauthClient = createPublicOauthClient(clientId, foundryUrl, redirectUrl, { scopes });

/**
 * Initialize the client to interact with the Ontology SDK
 */
const client: Client = createClient(
  foundryUrl,
  ontologyRid,
  maybeGetTokenFromEnvVar ?? (import.meta.env.PROD ? auth : async () => "myAccessToken"),
  {
    branch: branchRid,
  },
);

export default client;

function optionalMap<T, S>(value: T | undefined | null, mapFn: (t: T) => S): S | undefined {
  if (value != null) {
    return mapFn(value);
  }
  return undefined;
}
