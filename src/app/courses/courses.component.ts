import { Component, OnInit, OnDestroy } from '@angular/core';
import { first } from 'rxjs/operators';

import { Contest, User } from '@/_models';
import { AuthenticationService } from '@/_services';
import { ContestService } from '@/_services/contest.service';
import { ErrorInterceptor, IDs } from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';

@Component({ 
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.less'] 
})
export class CoursesComponent implements OnInit {
    currentUser: User;
    userId: number;

    private contests: Contest[];

    constructor(private authenticationService: AuthenticationService,
        private errorInterceptor: ErrorInterceptor,
        private wsservice: WebSocketService,) { 
            this.currentUser = this.authenticationService.currentUserValue;
            this.userId = this.currentUser.id;
        }

    ngOnInit() {
        
    }

    async getCourses() {
        console.log('get contests()');
        //var contests = await this.contestService.getContests();
        
        //console.log('contests', contests);
        // this.wsservice.on<any>(IDs.contests.getAll)
        //     .subscribe((msg) => {
        //         console.log('msg', msg);
        //         if (!msg['code']) {
        //             let contests = msg;
        //             console.log('contests msg', contests);
        //             this.contests = contests.map(contest => {
        //                 return new Contest({
        //                     id: contest.id,
        //                     name: contest.name || "Нет названия",
        //                     description: contest.description,
        //                     contestTasks: contest.tasks || []
        //                 });
        //             });
        //         }
        //         else {
        //             this.errorInterceptor.interceptError(msg['code']);
        //         }
        //     });
    }
}