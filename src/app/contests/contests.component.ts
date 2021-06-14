import { Component, OnInit, OnDestroy } from '@angular/core';
import { Contest, TaskListItem, User } from '@/_models';
import { ContestService } from '@/_services/contest.service';
import { Error } from '@/_models';
import { AuthenticationService } from '@/_services';
import { IDs, ErrorInterceptor } from '@/_helpers';

import { WebSocketService } from '@/_services/websocket';
import { map, tap, catchError, retry } from 'rxjs/operators';
import { IMessage } from '@/app.component';

@Component({
    selector: 'app-contests',
    templateUrl: './contests.component.html',
    styleUrls: ['./contests.component.less']
})
export class ContestsComponent implements OnInit, OnDestroy {
    public filter = {
        q: '',
        tags: undefined,
        page: undefined
    };
    private contests: Contest[];
    message = '';

    currentUser: User;

    constructor(private contestService: ContestService,
        private authenticationService: AuthenticationService,
        private errorInterceptor: ErrorInterceptor,
        private wsservice: WebSocketService) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.getContests();   
    }

    getContests() {
        console.log('get contests()');
        this.contestService.getContests().subscribe((list) => {
            this.contests = list;
        });
    }

    search() {
        this.contests.filter((val) => {
            return val.name.toLowerCase().indexOf(this.filter.q) > -1;
        });
    }

    removeContest(id) {
        console.log('remove call');
        this.contestService.removeContest(id);

        this.wsservice.on<any>(IDs.contests.remove)
            .subscribe((msg) => {
                console.log('msg', msg);
                if (!msg['code']) {
                    this.message = 'Соревнование удалено';
                    this.getContests();
                }
                else {
                    this.message = 'Ошибка удаления соревнования';
                    this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    hasAccess(level) {
        if (this.currentUser.accessLevel < level) {
            return false;
        }
        return true;
    }

    ngOnDestroy() {
        this.wsservice.close();
    }
}
