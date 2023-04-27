import {ApiProperty} from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({
        default: 'test@test.ru',
    })
    email: string;

    @ApiProperty({
        default: '123',
    })
    password: string;
}
