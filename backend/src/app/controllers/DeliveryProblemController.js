import * as Yup from 'yup';
import { format } from 'date-fns';

import Queue from '../../lib/Queue';
import CancelationDeliveryMail from '../jobs/CancelationDeliveryMail';

import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';
import Recipient from '../models/Recipient';

class DeliveryProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const deliveries = await DeliveryProblem.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['description'],
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: [
            'id',
            'recipient_id',
            'deliveryman_id',
            'signature_id',
            'product',
            'start_date',
            'end_date',
          ],
        },
      ],
    });

    const formattedDeliveryProblems = deliveries.map(deliveryProblem => {
      return {
        description: deliveryProblem.description,
        recipient_id: deliveryProblem.delivery.recipient_id,
        deliveryman_id: deliveryProblem.delivery.deliveryman_id,
        signature_id: deliveryProblem.delivery.signature_id,
        product: deliveryProblem.delivery.product,
        start_date: deliveryProblem.delivery.start_date,
        end_date: deliveryProblem.delivery.end_date,
      };
    });

    return res.json(formattedDeliveryProblems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { idDelivery } = req.params;

    const existentDelivery = await Delivery.findByPk(idDelivery);

    if (!existentDelivery) {
      return res
        .status(400)
        .json({ error: `Delivery of id ${idDelivery} do not exists` });
    }
    const { id, description } = await DeliveryProblem.create({
      delivery_id: idDelivery,
      ...req.body,
    });

    return res.json({
      id,
      description,
      delivery_id: idDelivery,
    });
  }

  async show(req, res) {
    const { idDelivery } = req.params;

    const delivery = await Delivery.findByPk(idDelivery, {
      include: [
        {
          model: DeliveryProblem,
          where: {
            delivery_id: idDelivery,
          },
        },
      ],
    });

    return res.json(delivery);
  }

  async delete(req, res) {
    const { idProblem } = req.params;

    const deliveryProblem = await DeliveryProblem.findByPk(idProblem);

    if (!deliveryProblem) {
      return res.status(400).json({
        error: `Delivery Problem of id ${deliveryProblem} do not exists`,
      });
    }

    const delivery = await Delivery.findByPk(deliveryProblem.delivery_id);
    if (delivery.canceled_at) {
      return res
        .status(400)
        .json({ error: `Delivery of id ${delivery.id} is already canceled` });
    }

    const canceledAt = new Date();
    const { id } = await delivery.update({
      canceled_at: canceledAt,
    });

    const deliveryman = await DeliveryMan.findByPk(delivery.deliveryman_id);
    const recipient = await Recipient.findByPk(delivery.recipient_id);

    await Queue.add(CancelationDeliveryMail.key, {
      deliveryman,
      product: delivery.product,
      recipient,
      problem_description: deliveryProblem.description,
      cancelation_date: format(canceledAt, 'dd/MM/yyyy hh:mm:ss'),
    });

    return res.json({
      id,
      canceled_At: canceledAt,
    });
  }
}

export default new DeliveryProblemController();
