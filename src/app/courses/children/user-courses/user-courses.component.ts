import { Component, OnInit, OnDestroy } from '@angular/core';
import { first } from 'rxjs/operators';

import { Contest, Course, User } from '@/_models';
import { AuthenticationService, CourseService } from '@/_services';
import { ContestService } from '@/_services/contest.service';
import { ErrorInterceptor, IDs } from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';

@Component({ 
    templateUrl: './user-courses.component.html',
    styleUrls: ['./user-courses.component.less'] 
})
export class UserCoursesComponent implements OnInit {
    currentUser: User;
    userId: number;

    private courses: Course[];

    constructor(private authenticationService: AuthenticationService,
        private errorInterceptor: ErrorInterceptor,
        private wsservice: WebSocketService,
        private courseService: CourseService) { 
            this.currentUser = this.authenticationService.currentUserValue;
            console.log(this.currentUser);
            this.userId = this.currentUser.id;
        }

    ngOnInit() {
        this.getCourses();
    }

    getCourses() {
        console.log('get courses()');
        this.courseService.getUserCourses();

        this.wsservice.on<any>(IDs.courses.started)
            .subscribe((msg) => {
                console.log('courses started', msg);
                if (!msg['code']) {
                    let courses = msg;
                    //filter(course => course.users.contains(this.currentUser.id)).
                    this.courses = courses.map(course => {
                        return new Course({
                            name: course.name,
                            id: course.id,
                            description: course.description,
                            owner: course.owner
                        })
                    });
                }
                else {
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }
}