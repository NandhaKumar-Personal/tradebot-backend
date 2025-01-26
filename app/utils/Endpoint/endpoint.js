import jwt from "jsonwebtoken";

export const EndpointMethod = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
  PATCH: "patch",
  OPTIONS: "options",
  HEAD: "head",
};

export const EndpointAuthType = {
  JWT: "jwt", // Requires JWT token
  NONE: "none", // No authentication required
  API_KEY: "api_key", // Requires API Key in headers
};

export class Endpoint {
  constructor({
    path,
    method,
    authType = EndpointAuthType.NONE,
    middleware = [],
    validator = null,
    handler,
    errorMiddleware = [],
  }) {
    this.path = path; // API path (e.g., "/login")
    this.method = method.toLowerCase(); // HTTP method (e.g., "get", "post")
    this.authType = authType; // Authentication type (JWT, API_KEY, or NONE)
    this.middleware = Array.isArray(middleware) ? middleware : [middleware]; // Additional middleware
    this.validator = validator ? [validator] : []; // Validation middleware
    this.handler = handler; // Route handler function
    this.errorMiddleware = Array.isArray(errorMiddleware)
      ? errorMiddleware
      : [errorMiddleware]; // Error-handling middleware
  }

  /**
   * Registers the endpoint with the provided router.
   */
  register(router) {
    if (!router[this.method]) {
      throw new Error(`Invalid HTTP method: ${this.method}`);
    }

    // Determine middlewares based on authType
    let authMiddleware = [];
    switch (this.authType) {
      case EndpointAuthType.JWT:
        authMiddleware = [Endpoint.jwtMiddleware];
        break;
      case EndpointAuthType.API_KEY:
        authMiddleware = [Endpoint.apiKeyMiddleware];
        break;
      case EndpointAuthType.NONE:
        authMiddleware = []; // No authentication required
        break;
      default:
        throw new Error(`Unsupported auth type: ${this.authType}`);
    }

    console.log(`Registering: ${this.method.toUpperCase()} ${this.path}`);

    // Register the route with the router
    router[this.method](
      this.path,
      ...authMiddleware, // Apply authentication middleware
      ...this.middleware, // Apply additional custom middleware
      ...this.validator, // Apply validation middleware
      async (req, res, next) => {
        try {
          await this.handler(req, res); // Execute the main handler
        } catch (error) {
          next(error); // Forward errors to the error middleware
        }
      },
      ...this.errorMiddleware // Apply error-handling middleware
    );
  }

  /**
   * Static utility: Middleware for JWT authentication.
   */
  static jwtMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("JWT Middleware triggered. Token:", token);

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.jwtDetails = decoded; // Attach decoded token details to the request object
      next(); // Proceed to the next middleware
    } catch (err) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid or expired token" });
    }
  }

  /**
   * Static utility: Middleware for API Key authentication.
   */
  static apiKeyMiddleware(req, res, next) {
    const apiKey = req.headers["x-api-key"];
    console.log("API Key Middleware triggered. Provided API Key:", apiKey);

    if (apiKey !== process.env.API_KEY) {
      return res.status(403).json({ error: "Forbidden: Invalid API Key" });
    }

    next(); // Proceed to the next middleware
  }

  /**
   * Static utility: Middleware for error handling.
   */
  static createErrorHandler() {
    return (err, req, res, next) => {
      console.error("Error:", err.message || "An unexpected error occurred.");
      res.status(500).json({ error: "Internal server error" });
    };
  }
}
