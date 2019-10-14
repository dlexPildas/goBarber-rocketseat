import jwt from "jsonwebtoken";

import authConfig from "../config/auth";

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const [, token] = authorization.split(" ");

  try {
    const decoded = await jwt.verify(token, authConfig.secret);
    req.userId = decoded.id;

    next();
  } catch (err) {
    return res.status(401).json({ error: "token doesn't valid" });
  }
};
