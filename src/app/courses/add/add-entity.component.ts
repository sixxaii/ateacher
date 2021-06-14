import { Component, OnInit, OnDestroy } from '@angular/core';
import { Course, TaskListItem, User } from '@/_models';
import { CourseService } from '@/_services';
import { ActivatedRoute } from '@angular/router';
import { TaskService, AuthenticationService } from '@/_services';
import { IDs }  from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';

@Component({
    templateUrl: './add-entity.component.html',
    styleUrls: ['./add-entity.component.less']
})
export class AddEntityComponent implements OnInit, OnDestroy {
    private course: Course;
    private courseId: number;
    private themeId: number;
    private lessonId: number;
    private tasks: TaskListItem[];
    private courseTasks: TaskListItem[];

    message = '';

    currentUser: User;

    constructor(private courseService: CourseService,
                private taskService: TaskService,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private wsservice: WebSocketService) { 
                    this.currentUser = this.authenticationService.currentUserValue;
                }

    ngOnInit() {
        this.courseId = this.route.snapshot.params.id;
        this.themeId = this.route.snapshot.params.tid;
        this.lessonId = this.route.snapshot.params.lid;
        this.getTasks();
        // if (this.route.toString().includes('add')) {
        //     this.getTasks();
        //     // await this.resolveAfter(1000);
        //     // this.taskService.getTasks();
        // }
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
                }
                else {
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    addTask(task) {
        let taskId = task.id;
        this.tasks.splice(this.tasks.indexOf(task), 1);
        this.courseService.addEntity("task", taskId, this.themeId, this.lessonId);

        this.wsservice.on<any>(IDs.courses.addEntity)
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
