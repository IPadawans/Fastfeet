import * as Yup from 'yup';
import { Op } from 'sequelize';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street_name: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      id,
      name,
      street_name,
      number,
      complement,
      state,
      city,
      cep,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street_name,
      number,
      complement,
      state,
      city,
      cep,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street_name: Yup.string(),
      number: Yup.string(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      cep: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const existentRecipient = await Recipient.findByPk(id);

    if (!existentRecipient) {
      return res
        .status(400)
        .json({ error: `Id ${id} do not belongs to any recipient` });
    }

    const {
      name: rec_name,
      street_name: rec_street_name,
      number: rec_number,
      complement: rec_complement,
      state: rec_state,
      city: rec_city,
      cep: rec_cep,
    } = await existentRecipient.update(req.body);

    return res.json({
      name: rec_name,
      street_name: rec_street_name,
      number: rec_number,
      complement: rec_complement,
      state: rec_state,
      city: rec_city,
      cep: rec_cep,
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

    const recipients = await Recipient.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      where,
    });

    const formattedRecipients = recipients.map(recipient => {
      return {
        id: recipient.id,
        name: recipient.name,
        street_name: recipient.street_name,
        number: recipient.number,
        complement: recipient.complement,
        state: recipient.state,
        city: recipient.city,
        cep: recipient.cep,
      };
    });

    return res.json(formattedRecipients);
  }
}

export default new RecipientController();
