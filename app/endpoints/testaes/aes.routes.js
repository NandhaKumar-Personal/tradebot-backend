import { encryptHandler, decryptHandler } from "./aes.handler.js";
import {
  Endpoint,
  EndpointAuthType,
  EndpointMethod,
} from "../../utils/Endpoint/endpoint.js";

// Encrypt route
const encryptEndpoint = new Endpoint({
  path: "/aes/encrypt",
  method: EndpointMethod.POST,
  handler: encryptHandler,
  authType: EndpointAuthType.NONE,
});

// Decrypt route
const decryptEndpoint = new Endpoint({
  path: "/aes/decrypt",
  method: EndpointMethod.POST,
  handler: decryptHandler,
  authType: EndpointAuthType.NONE,
});

export default [encryptEndpoint, decryptEndpoint];
