import { Module, Global } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  providers: [UserService],
  exports: [UserService],
  imports: [AuthModule],
  controllers: [UserController]
})
export class UserModule {}
