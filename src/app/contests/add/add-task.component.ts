import { Component, OnInit, OnDestroy } from '@angular/core';
import { Contest, TaskListItem, User } from '@/_models';
import { ContestService } from '@/_services/contest.service';
import { ActivatedRoute } from '@angular/router';
import { TaskService, AuthenticationService } from '@/_services';
import { IDs }  from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';

@Component({
    selector: 'app-addTask',
    templateUrl: './add-task.component.html',
    styleUrls: ['./add-task.component.less']
})
export class AddTaskComponent implements OnInit, OnDestroy {
    private contest: Contest;
    private contestId: number;
    private tasks: TaskListItem[];
    private contestTasks: TaskListItem[];

    message = '';

    currentUser: User;

    constructor(private contestService: ContestService,
                private taskService: TaskService,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private wsservice: WebSocketService) { 
                    this.currentUser = this.authenticationService.currentUserValue;
                }

    ngOnInit() {
        this.contestId = this.route.snapshot.params.id;
        if (this.route.toString().includes('add')) {
            this.getContestTasks(this.contestId);
            // await this.resolveAfter(1000);
            // this.taskService.getTasks();
        }
    }

    getContestTasks(id) {
        this.contestService.getContestTasks(id);

        this.wsservice.on<any>(IDs.contests.task.list)
            .subscribe((msg) => {
                console.log('msg', msg);
                this.getTasks();
                if (!msg['code']) {
                    let contestTasks = msg;
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

    getTasks() {
        this.taskService.getTasks();

        this.wsservice.on<any>(IDs.task.list)
            .subscribe((msg) => {
                if (!msg['code']) {
                    let tasks = msg;
                    this.tasks = tasks.map(task => {
                        return new TaskListItem({
                            id: task.id,
                            name: task.name || "Нет названия"
                        });
                    });

                    if (!this.contestTasks) this.contestTasks = [];
                    this.tasks = this.tasks.filter(task => {
                        let contestTasksIds = this.contestTasks.map(task => {
                            return task.id;
                        });

                        return contestTasksIds.indexOf(task.id) <= -1;
                    });
                }
                else {
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    addTask(task) {
        let taskId = task.id;
        this.tasks.splice(this.tasks.indexOf(task), 1);
        this.contestService.addTask(taskId, this.contestId);

        this.wsservice.on<any>(IDs.contests.task.add)
            .subscribe((msg) => {
                if (!msg['code']) {
                    this.message = 'Задача добавлена';
                }
                else {
                    this.message = 'Ошибка при добавлении задачи';
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
