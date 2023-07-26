import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { date } from 'joi';

@Injectable()
export class NotificationsService {
  async notifyEmail({ email }: NotifyEmailDto) {
    console.log(email);
  }
}
