import { Controller, Dependencies, Get, Post, Bind, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Dependencies(UserService)
@Controller('user')
export class UserController {
    constructor(UserService){
        this.userService = UserService;
    }

    // @Post('searchUser')
    // @Bind(Body())
    @Get('login/:email')
    @Bind(Param('email'))
    async login(email){
        //const {email} = data;
        try{
            const res = await this.userService.searchUser(email);
            if(res.statusCode == 404){
                return res;
            }
            const user = await this.userService.getUser(res.id);
            return user;
        }catch(e){
            return e;
        }
    }
}
