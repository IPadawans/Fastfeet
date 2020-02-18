import * as Yup from 'yup';
import { parseISO } from 'date-fns';

import File from '../models/File';
import Delivery from '../models/Delivery';

class DeliveryCheckoutController {
  async store(req, res) {
    const schema = Yup.object().shape({
      end_date: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { idDeliveryman, idDelivery } = req.params;

    const existentDelivey = await Delivery.findByPk(idDelivery);
    if (!existentDelivey) {
      return res
        .status(400)
        .json({ error: `Delivery from id ${idDelivery} do not exists` });
    }

    const { filename: path, originalname: name } = req.file;
    await File.create({
      name,
      path,
    });

    const { end_date } = req.body;
    const {
      id,
      recipient_id,
      product,
      start_date,
    } = await existentDelivey.update({
      start_date: parseISO(end_date),
    });

    return res.json({
      id,
      idDeliveryman,
      recipient_id,
      product,
      start_date,
      end_date,
    });
  }
}

export default new DeliveryCheckoutController();
