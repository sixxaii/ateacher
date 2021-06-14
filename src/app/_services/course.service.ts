import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { User, Course } from '../_models';
import { IDs }  from '@/_helpers';
import { WebSocketService } from './websocket';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CourseService {
    currentUser: User;
    courses;

    constructor(private authenticationService: AuthenticationService,
                private wsservice: WebSocketService) 
    { 
        this.currentUser = this.authenticationService.currentUserValue;
        console.log('contest');
    }

    getCourses() {
        console.log(this.currentUser);
        let id = IDs.courses.getAll;
        let body = { 
            "method": "courses.list",
            "params": {
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    getUserCourses() {
        let id = IDs.courses.started;
        let body = { 
            "method": "courses.started",
            "params": {
                "access_token": this.currentUser.token,
                "username": this.currentUser.username
            }
        };

        this.wsservice.send(id, body);
    }

    getCourse(courseId: number)  {
        let id = IDs.courses.get;
        let body = { 
            "method": "course.get",
            "params": {
                "id": +courseId,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    createCourse(courseInfo) {
        let id = IDs.courses.create;
        let body = { 
            "method": "course.create",
            "params": {
                "name": courseInfo.name,
                "description": courseInfo.description,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    removeCourse(сid) {
        let id = IDs.courses.remove;
        let body = { 
            "method": "course.remove",
            "params": {
                "cid": сid,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    // getContestTasks(contestId: number) {
    //     let id = IDs.contests.task.list;
    //     let body = { 
    //         "method": "contest.tasks",
    //         "params": {
    //             "cid": +contestId,
    //             "access_token": this.currentUser.token
    //         }
    //     };

    //     this.wsservice.send(id, body);
    // }

    addTheme(courseId, themeName) {
        console.log('add theme', themeName);
        let id = IDs.courses.addTheme;
        let body = { 
            "method": "course.addTheme",
            "params": {
                "cid": +courseId,
                "name": themeName,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    removeTheme(courseId, themeId) {
        let id = IDs.courses.removeTheme;
        let body = { 
            "method": "course.removeTheme",
            "params": {
                "cid": +courseId,
                "tid": +themeId,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    addLesson(themeId, lessonName) {
        console.log('add lesson', lessonName);
        let id = IDs.courses.addLesson;
        let body = { 
            "method": "course.addBlock",
            "params": {
                "tid": +themeId,
                "name": lessonName,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    removeLesson(themeId, lessonId) {
        let id = IDs.courses.removeTheme;
        let body = { 
            "method": "course.removeBlock",
            "params": {
                "tid": +themeId,
                "bid": +lessonId,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    removeEntity(themeId, lessonId, entityId) {
        let id = IDs.courses.removeEntity;
        let body = { 
            "method": "course.removeEntity",
            "params": {
                "tid": +themeId,
                "bid": +lessonId,
                "eid": +entityId,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    addEntity(type, taskId, themeId, lessonId) {
        console.log('addentity', type, taskId, themeId, lessonId);
        let id = IDs.courses.addEntity;
        let body = { 
            "method": "course.addEntity",
            "params": {
                "tid": +themeId,
                "bid": +lessonId,
                "task_id": +taskId,
                "type": type,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }  
}
