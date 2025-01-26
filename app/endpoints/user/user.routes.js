import { createJwtHandler, verifyJwtHandler } from "./user.handler.js";
import {
  Endpoint,
  EndpointAuthType,
  EndpointMethod,
} from "../../utils/Endpoint/endpoint.js";
import { authenticate } from "./user.middleware.js";

// Route to create JWT
const createJwtEndpoint = new Endpoint({
  path: "/createjwt",
  method: EndpointMethod.POST,
  handler: createJwtHandler, // Handler to create a JWT
  authType: EndpointAuthType.NONE, // No authentication needed
  middleware: [authenticate],
});

// Route to verify JWT
const verifyJwtEndpoint = new Endpoint({
  path: "/verifyjwt",
  method: EndpointMethod.GET,
  handler: verifyJwtHandler, // Handler to verify the JWT
  authType: EndpointAuthType.JWT, // JWT authentication required
});

export default [createJwtEndpoint, verifyJwtEndpoint];
