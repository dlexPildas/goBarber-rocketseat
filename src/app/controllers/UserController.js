import * as Yup from "yup";
import User from "../models/User";

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: "Someone data doesn't valid" });
    }

    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(401).json({ error: "User already exist" });
    }

    const { id, email, password_hash } = await User.create(req.body);

    return res.json({
      id,
      email,
      password_hash
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      password: Yup.string().min(6)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: "Validation failure" });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExist = await User.findOne({ where: { email } });

      if (userExist) {
        return res.status(401).json({ error: "User already exist" });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "Passoword does not match" });
    }

    const { id, name, password_hash } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      password_hash
    });
  }
}

export default new UserController();