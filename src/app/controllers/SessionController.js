import jwt from "jsonwebtoken";
import * as Yup from "yup";

import User from "../models/User";

import authConfig from "../../config/auth";

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: "validation failure" });
    }

    const { email, password } = req.body;

    const userExist = await User.findOne({ where: { email } });

    if (!userExist) {
      return res.status(401).json({ error: "user not found" });
    }

    if (!(await userExist.checkPassword(password))) {
      return res.status(401).json({ error: "password does not match" });
    }

    const { id, name } = userExist;

    return res.json({
      id,
      name,
      email,
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    });
  }
}

export default new SessionController();
