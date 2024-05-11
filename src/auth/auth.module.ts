import { Module } from '@nestjs/common';
import { AuthGateway } from './auth.gateway';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule],
  providers: [AuthGateway, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
