import * as Yup from 'yup';
import { Op } from 'sequelize';

import File from '../models/File';
import DeliveryMan from '../models/DeliveryMan';

class DeliveryManController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      avatar_id: Yup.number(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email: req_email, avatar_id } = req.body;
    const existentDeliveryMan = await DeliveryMan.findOne({
      where: { email: req_email },
    });

    if (avatar_id) {
      const existent_avatar = await File.findByPk(avatar_id);
      if (!existent_avatar) {
        return res
          .status(400)
          .json({ error: `Avatar of id ${avatar_id} do not exists` });
      }
    }

    if (existentDeliveryMan) {
      return res.status(400).json({ error: 'Delivery man already exists' });
    }

    const { id, email, name } = await DeliveryMan.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      avatar_id: Yup.number(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const deliveryMan = await DeliveryMan.findByPk(id);

    if (!deliveryMan) {
      return res
        .status(400)
        .json({ error: `Delivery man with id ${id} do not exists` });
    }

    const { email } = req.body;
    if (email && email !== deliveryMan.email) {
      const deliveryManExistentWithNewEmail = await DeliveryMan.findOne({
        where: { email },
      });

      if (deliveryManExistentWithNewEmail) {
        return res
          .status(400)
          .json({ error: `User with email ${email} already exists` });
      }
    }
    const { name, email: deliveryManEmail } = await deliveryMan.update(
      req.body
    );
    return res.json({
      id,
      name,
      email: deliveryManEmail,
    });
  }

  async index(req, res) {
    const { page = 1, q } = req.query;

    let where = {};

    if (q) {
      where = {
        name: {
          [Op.iLike]: `%${q}%`,
        },
      };
    }

    const deliveryMans = await DeliveryMan.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      where,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });
    const formattedDeliveryMans = deliveryMans.map(deliveryMan => {
      return {
        id: deliveryMan.id,
        name: deliveryMan.name,
        email: deliveryMan.email,
        avatar: deliveryMan.avatar,
      };
    });

    return res.json(formattedDeliveryMans);
  }

  async show(req, res) {
    const { id } = req.params;
    const deliveryMan = await DeliveryMan.findByPk(id, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path'],
        },
      ],
    });

    if (!deliveryMan) {
      return res
        .status(400)
        .json({ error: `Delivery man with id ${id} does not exists` });
    }

    const { name, email, avatar } = deliveryMan;

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryMan = await DeliveryMan.findByPk(id);
    if (!deliveryMan) {
      return res
        .status(400)
        .json({ error: `Delivery man with id ${id} does not exists` });
    }

    await deliveryMan.destroy();

    return res.json({ ok: true });
  }
}

export default new DeliveryManController();
