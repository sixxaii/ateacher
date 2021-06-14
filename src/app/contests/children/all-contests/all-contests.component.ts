import { Component, OnInit, OnDestroy } from '@angular/core';
import { first } from 'rxjs/operators';

import { Contest, User } from '@/_models';
import { AuthenticationService } from '@/_services';
import { ContestService } from '@/_services/contest.service';
import { ErrorInterceptor, IDs } from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';

@Component({ 
    templateUrl: './all-contests.component.html',
    styleUrls: ['./all-contests.component.less'] 
})
export class AllContestsComponent implements OnInit {
    currentUser: User;
    userId: number;

    private contests: Contest[];

    constructor(private contestService: ContestService,
        private authenticationService: AuthenticationService,
        private errorInterceptor: ErrorInterceptor,
        private wsservice: WebSocketService) { 
            this.currentUser = this.authenticationService.currentUserValue;
            console.log(this.currentUser);
            this.userId = this.currentUser.id;
        }

    ngOnInit() {
        this.getContests();
        console.log(this.contests);
    }

    getContests() {
        console.log('get contests()');
        this.contestService.getContests().subscribe((data) => {
            console.log('data', data);
            if (!data['code']) {
                this.contests = data;
            }
            else {
                this.errorInterceptor.interceptError(data['code']);
            }
        });
    }
}