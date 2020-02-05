import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      signature_id: Yup.number().required(),
      product: Yup.string().required(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery = await Delivery.create(req.body);
    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      signature_id: Yup.number(),
      product: Yup.string(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const existentDelivery = await Delivery.findByPk(id);
    if (!existentDelivery) {
      return res
        .status(400)
        .json({ error: `Delivery of id ${id} do not exists` });
    }

    const {
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    } = await existentDelivery.update(req.body);

    return res.json({
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    });
  }

  async index(req, res) {
    const deliveries = await Delivery.findAll({
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'street_name',
            'number',
            'complement',
            'state',
            'city',
            'cep',
          ],
        },
        {
          model: DeliveryMan,
          as: 'deliveryman',
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'name', 'path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    const formatedDeliveries = deliveries.map(delivery => {
      return {
        recipient: delivery.recipient,
        deliveryman: delivery.deliveryman,
        signature: delivery.signature,
        product: delivery.product,
        canceled_at: delivery.canceled_at,
        start_date: delivery.start_date,
        end_date: delivery.end_date,
      };
    });

    return res.json(formatedDeliveries);
  }

  async show(req, res) {
    const { id } = req.params;

    const existentDelivery = await Delivery.findByPk(id);
    if (!existentDelivery) {
      return res
        .status(400)
        .json({ error: `Delivery of id ${id} do not exists` });
    }

    const {
      recipient,
      deliveryman,
      signature,
      product,
      canceled_at,
      start_date,
      end_date,
    } = await Delivery.findByPk(id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'street_name',
            'number',
            'complement',
            'state',
            'city',
            'cep',
          ],
        },
        {
          model: DeliveryMan,
          as: 'deliveryman',
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'name', 'path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    return res.json({
      recipient,
      deliveryman,
      signature,
      product,
      canceled_at,
      start_date,
      end_date,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const existentDelivery = await Delivery.findByPk(id);
    if (!existentDelivery) {
      return res
        .status(400)
        .json({ error: `Delivery of id ${id} do not exists` });
    }

    await existentDelivery.destroy();

    return res.json({ message: `ok` });
  }
}

export default new DeliveryController();
