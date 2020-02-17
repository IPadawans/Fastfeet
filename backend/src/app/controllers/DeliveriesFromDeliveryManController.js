import { Op } from 'sequelize';

import DeliveryMan from '../models/DeliveryMan';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveriesFromDeliveryManController {
  async store(req, res) {
    const { id } = req.params;
    const deliveryman = await DeliveryMan.findByPk(id);

    if (!deliveryman) {
      return res
        .status(400)
        .json({ error: `Deliveryman of id ${id} do not exists` });
    }

    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        end_date: {
          [Op.ne]: null,
        },
      },
      limit: 20,
      offset: (page - 1) * 20,
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
}

export default new DeliveriesFromDeliveryManController();
