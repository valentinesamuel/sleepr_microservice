import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DatabaseModule,
  LoggerModule,
  NOTIFICATIONS_SERVICE,
} from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule.forRoot({
      type: 'postgres',
      host: process.env.RESERVATIONS_DB_HOST, // Adjust environment variable names accordingly
      port: parseInt(process.env.RESERVATIONS_DB_PORT, 10),
      username: process.env.RESERVATIONS_DB_USERNAME,
      password: process.env.RESERVATIONS_DB_PASSWORD,
      database: process.env.RESERVATIONS_DB_DATABASE,
      autoLoadEntities: true,
    }),
    DatabaseModule.forFeature([]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
        NOTIFICATIONS_HOST: Joi.string().required(),
        NOTIFICATIONS_PORT: Joi.number().required(),
      }),
    }),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('NOTIFICATIONS_HOST'),
            port: configService.get('NOTIFICATIONS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
