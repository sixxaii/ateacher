import { Component, OnInit, OnDestroy } from '@angular/core';
import { Contest, TaskListItem, User } from '@/_models';
import { ContestService } from '@/_services/contest.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@/_services';
import { IDs }  from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';

@Component({
    selector: 'app-contest',
    templateUrl: './contest.component.html',
    styleUrls: ['./contest.component.less']
})
export class ContestComponent implements OnInit, OnDestroy {
    private contest: Contest;
    private contestId: number;

    contestTasks: TaskListItem[];
    message = '';

    currentUser: User;

    constructor(private contestService: ContestService,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private wsservice: WebSocketService) { 
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.contestId = this.route.snapshot.params.id;

        this.getContest(this.contestId);
        this.getContestTasks(this.contestId);
    }

    getContest(id) {
        this.contestService.getContest(id);

        this.wsservice.on<any>(IDs.contests.get)
            .subscribe((msg) => {
                console.log('msg', msg);
                if (!msg['code']) {
                    let contest = msg;
                    this.contest = new Contest({
                        id: contest.id,
                        name: contest.name || "Нет названия", 
                        description: contest.description,
                        contestTasks: contest.tasks || [],
                        duration: contest.duration
                    });
                }
                else {
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    getContestTasks(id) {
        this.contestService.getContestTasks(id);

        this.wsservice.on<any>(IDs.contests.task.list)
            .subscribe((msg) => {
                console.log('msg', msg);
                if (!msg['code']) {
                    let contestTasks = msg;
                    console.log('contestTasks', contestTasks);
                    this.contestTasks = contestTasks.map((task) => {
                        return new TaskListItem({
                            id: task.id,
                            name: task.name || "Нет названия", 
                        });
                    });
                }
                else {
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    removeTask(task) {
        let taskId = task.id;
        this.contestTasks.splice(this.contestTasks.indexOf(task), 1);
        this.contestService.removeTask(taskId, this.contestId);

        this.wsservice.on<any>(IDs.contests.task.remove)
            .subscribe((msg) => {
                console.log('msg', msg);
                if (!msg['code']) {
                    this.message = 'Задача удалена';
                }
                else {
                    this.message = 'Ошибка при удалении задачи';
                    //this.errorInterceptor.interceptError(msg['code']);
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
