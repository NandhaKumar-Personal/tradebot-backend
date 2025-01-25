// utils/Endpoint.js
const express = require("express");
const { jwtAuth, staticAuth } = require("./middlewares/authMiddleware");

class Endpoint {
  constructor({ path, method, handler, authType = "NONE", validator = null }) {
    this.path = path;
    this.method = method.toLowerCase();
    this.handler = handler;
    this.authType = authType;
    this.validator = validator;
  }

  applyAuthMiddleware(authType, middlewares) {
    if (authType === "JWT") return jwtAuth;
    if (authType === "STATIC") return staticAuth;
    return (req, res, next) => next(); // No auth middleware
  }

  register(router, middlewares) {
    const authMiddleware = this.applyAuthMiddleware(this.authType, middlewares);
    const middlewaresToApply = [authMiddleware];

    if (this.validator) {
      middlewaresToApply.push(this.validator);
    }

    middlewaresToApply.push(this.handler);

    router[this.method](this.path, middlewaresToApply);
  }
}

module.exports = Endpoint;
