import { Component, OnInit, OnDestroy } from '@angular/core';
import { first } from 'rxjs/operators';

import { Course, User } from '@/_models';
import { AuthenticationService } from '@/_services';
import { CourseService } from '@/_services';
import { ErrorInterceptor, IDs } from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';

@Component({ 
    templateUrl: './all-courses.component.html',
    styleUrls: ['./all-courses.component.less'] 
})
export class AllCoursesComponent implements OnInit {
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
        this.courseService.getCourses();

        this.wsservice.on<any>(IDs.courses.getAll)
            .subscribe((msg) => {
                if (!msg['code']) {
                    let courses = msg;
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

    removeCourse(course) {
        let ind = this.courses.indexOf(course);
        this.courses.splice(ind, 1);

        let id = course.id;
        this.courseService.removeCourse(id);

        this.wsservice.on<any>(IDs.courses.remove)
            .subscribe((msg) => {
                if (!msg['code']) {
                  
                }
                else {
   
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }
}