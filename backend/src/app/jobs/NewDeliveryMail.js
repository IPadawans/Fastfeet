import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const { deliveryman, product, recipient } = data;
    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Nova entrega cadastrada',
      template: 'newdelivery',
      context: {
        deliveryman: deliveryman.name,
        product_name: product,
        recipient_name: recipient.name,
        recipient_street_name: recipient.street_name,
        recipient_number: recipient.number,
        recipient_complement: recipient.complement,
        recipient_state: recipient.state,
        recipient_city: recipient.city,
        recipient_cep: recipient.cep,
      },
    });
  }
}

export default new NewDeliveryMail();
