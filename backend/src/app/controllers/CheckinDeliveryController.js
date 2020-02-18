import * as Yup from 'yup';
import { Op } from 'sequelize';

import { startOfDay, endOfDay, parseISO } from 'date-fns';
import Delivery from '../models/Delivery';

class CheckinDeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { start_date } = req.body;
    const { idDeliveryman, idDelivery } = req.params;

    const existentDeliveriesForDeliveryMan = await Delivery.findAll({
      where: {
        deliveryman_id: idDeliveryman,
        start_date: {
          [Op.between]: [
            startOfDay(parseISO(start_date)),
            endOfDay(parseISO(start_date)),
          ],
        },
      },
    });

    if (existentDeliveriesForDeliveryMan.length >= 5) {
      return res
        .status(400)
        .json({ error: 'Maximum number of checkins for day exceeded' });
    }

    const existentDelivey = await Delivery.findByPk(idDelivery);

    if (!existentDelivey) {
      return res
        .status(400)
        .json({ error: `Delivery from id ${idDelivery} do not exists` });
    }

    const {
      id,
      deliveryman_id,
      recipient_id,
      product,
      end_date,
    } = await existentDelivey.update({
      start_date: parseISO(start_date),
    });

    return res.json({
      id,
      deliveryman_id,
      recipient_id,
      product,
      start_date,
      end_date,
    });
  }
}

export default new CheckinDeliveryController();
