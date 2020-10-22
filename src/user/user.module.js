import { Module, Global } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Global()
@Module({
  providers: [UserService],
  exports: [UserService],
  imports: [],
  controllers: [UserController]
})
export class UserModule {}
