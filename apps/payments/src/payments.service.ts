import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.confnigService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2022-11-15',
    },
  );
  constructor(private readonly confnigService: ConfigService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createCharge({ amount, card }: CreateChargeDto) {
    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   type: 'card',
    //   card,
    // });

    const paymentIntent = await this.stripe.paymentIntents.create({
      // payment_method: paymentMethod.id,
      // payment_method_types: ['card'],
      amount: amount * 100,
      confirm: true,
      payment_method: 'pm_card_visa',
      currency: 'ngn',
    });

    return paymentIntent;
  }
}
