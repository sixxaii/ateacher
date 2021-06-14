import { Component, OnInit, OnDestroy } from '@angular/core';
import { first } from 'rxjs/operators';

import { Course, Group, User } from '@/_models';
import { AuthenticationService } from '@/_services';
import { CourseService, GroupService } from '@/_services';
import { ErrorInterceptor, IDs } from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';

@Component({ 
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less'] 
})
export class HomeComponent implements OnInit {
    currentUser: User;

    private courses: Course[];
    private groups: Group[];

    constructor(private courseService: CourseService,
        private groupService: GroupService,
        private authenticationService: AuthenticationService,
        private errorInterceptor: ErrorInterceptor,
        private wsservice: WebSocketService) { 
            this.currentUser = this.authenticationService.currentUserValue;
            console.log('CURRENT USER', this.currentUser);
        }

    ngOnInit() {
        this.getCourses();
        this.getGroups();
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

    getGroups() {
        this.groupService.getUserGroups();

        this.wsservice.on<any>(IDs.groups.userList)
            .subscribe((msg) => {
                console.log('users groups', msg);
                if (!msg['code']) {
                    let groups = msg;
                    this.groups = groups.map(group => {
                        return new Group({
                            name: group.display_name,
                            id: group.id
                        })
                    });
                }
                else {
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }
}