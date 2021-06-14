import { Injectable } from '@angular/core';
import { AuthenticationService } from '@/_services';

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    message: string;

    interceptError(code) {
        switch (code) {
            case 3003:
                this.authenticationService.logout();
                location.reload(true);
                break;
            case 2003: 
                this.message = 'Недостаточно прав';
                return this.message;
            case 2005: 
                this.message = 'Данное имя/название уже существует';
                return this.message;
            case 2004: 
                this.message = 'Неверное имя пользователя или пароль';
                return this.message;
            default:
                this.message = 'Ошибка';
                return this.message;
        }
    }
}