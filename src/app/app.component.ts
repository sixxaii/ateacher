import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User, AccessLevel } from './_models';

import { Observable } from 'rxjs';
import { WebSocketService } from './_services/websocket';

export interface IMessage {
    id: number;
    text: string;
}

@Component({ 
    selector: 'app', 
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent {
    currentUser: User;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private wsservice: WebSocketService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        this.wsservice.connect();
    }

    ngOnInit() {

    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    hasAccess(level) {
        if (!this.currentUser || this.currentUser.accessLevel < level) {
            return false;
        }
        return true;
    }
}