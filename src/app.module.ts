import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OtpService } from './otp.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [OtpService],
})
export class AppModule {}
