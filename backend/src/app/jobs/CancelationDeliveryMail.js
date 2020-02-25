import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'CancelationDeliveryMail';
  }

  async handle({ data }) {
    const {
      deliveryman,
      product,
      recipient,
      problem_description,
      cancelation_date,
    } = data;
    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Cancelamento de Entrega',
      template: 'cancelationdelivery',
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
        problem_description,
        cancelation_date,
      },
    });
  }
}

export default new NewDeliveryMail();
