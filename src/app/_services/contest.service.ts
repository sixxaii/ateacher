import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { User, Contest } from '../_models';
import { IDs }  from '@/_helpers';
import { WebSocketService } from './websocket';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ContestService {
    currentUser: User;
    contests;

    constructor(private authenticationService: AuthenticationService,
                private wsservice: WebSocketService) 
    { 
        this.currentUser = this.authenticationService.currentUserValue;
        console.log('contest');
    }

    getContests() {
        console.log(this.currentUser);
        let id = IDs.contests.getAll;
        let body = { 
            "method": "contests.getAvailable",
            "params": {
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);

        return this.wsservice.on<any>(IDs.contests.getAll).pipe(
            map(msg => {
                console.log('msg', msg);
                if (!msg['code']) {
                    console.log('contests msg', msg);
                    this.contests = msg.map(contest => {
                        return new Contest({
                            id: contest.id,
                            name: contest.name || "Нет названия",
                            description: contest.description,
                            contestTasks: contest.tasks || []
                        });
                    });
                }
              
                return this.contests; 
           }));
    }

    getContest(contestId: number)  {
        let id = IDs.contests.get;
        let body = { 
            "method": "contest.get",
            "params": {
                "cid": +contestId,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    getContestResults(contestId: number) {
        let id = IDs.contests.results;
        let body = { 
            "method": "contest.standings",
            "params": {
                "cid": +contestId,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    createContest(contestInfo) {
        let id = IDs.contests.create;
        let body = { 
            "method": "contest.create",
            "params": {
                "name": contestInfo.name,
                "description": contestInfo.description,
                "duration": contestInfo.duration,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    removeContest(сid) {
        let id = IDs.contests.remove;
        let body = { 
            "method": "contest.remove",
            "params": {
                "cid": сid,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    getContestTasks(contestId: number) {
        let id = IDs.contests.task.list;
        let body = { 
            "method": "contest.tasks",
            "params": {
                "cid": +contestId,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    addTask(taskId, contestId) {
        let id = IDs.contests.task.add;
        let body = { 
            "method": "contest.addTask",
            "params": {
                "cid": +contestId,
                "tid": +taskId,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    removeTask(taskId, contestId) {
        let id = IDs.contests.task.remove;
        let body = { 
            "method": "contest.removeTask",
            "params": {
                "cid": +contestId,
                "tid": +taskId,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }
}
