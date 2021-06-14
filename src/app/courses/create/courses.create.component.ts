import { Component, OnInit, OnDestroy } from '@angular/core';
import { Group, User } from '@/_models';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, AuthenticationService } from '@/_services';
import { Error } from '@/_models';
import { CourseService } from '@/_services';
import { IDs }  from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';

@Component({ 
    templateUrl: 'courses.create.component.html',
    styleUrls: ['./courses.create.component.less']
})
export class CoursesCreateComponent implements OnInit, OnDestroy {
    courseCreateForm: FormGroup;
    loading = false;
    submitted = false;
    message = '';
    currentUser: User;

    constructor(private formBuilder: FormBuilder, 
                private courseService: CourseService,
                private alertService: AlertService,
                private authenticationService: AuthenticationService,
                private wsservice: WebSocketService) 
    {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.courseCreateForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['']
        });
    }

    get f() { return this.courseCreateForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.courseCreateForm.invalid) {
            return;
        }

        this.loading = true;

        this.courseService.createCourse(this.courseCreateForm.value);
        this.wsservice.on<any>(IDs.courses.create)
            .subscribe((msg) => {
                this.loading = false;
                if (!msg['code']) {
                    this.message = 'Курс создан';
                }
                else {
                    this.message = 'Ошибка';
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    hasAccess(level) {
        console.log('course access', level);

        if (this.currentUser.accessLevel < level) {
            return false;
        }
        return true;
    }

    ngOnDestroy() {
        this.wsservice.close();
    }
}
