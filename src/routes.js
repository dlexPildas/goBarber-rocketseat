import { Router } from "express";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";

import auth from "./middleware/authorization";

const routes = new Router();

routes.post("/user", UserController.store);
routes.put("/user", auth, UserController.update);
routes.post("/session", SessionController.store);

export default routes;
