import { Component, OnInit, OnDestroy } from '@angular/core';
import { Group, User } from '@/_models';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, AuthenticationService } from '@/_services';
import { Error } from '@/_models';
import { ContestService } from '@/_services/contest.service';
import { IDs }  from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';

@Component({ 
    templateUrl: 'contests.create.component.html',
    styleUrls: ['./contests.create.component.less']
})
export class ContestsCreateComponent implements OnInit, OnDestroy {
    contestCreateForm: FormGroup;
    loading = false;
    submitted = false;
    message = '';
    currentUser: User;

    constructor(private formBuilder: FormBuilder, 
                private contestService: ContestService,
                private alertService: AlertService,
                private authenticationService: AuthenticationService,
                private wsservice: WebSocketService) 
    {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.contestCreateForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            duration: ['', Validators.required],
        });
    }

    get f() { return this.contestCreateForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.contestCreateForm.invalid) {
            return;
        }

        this.loading = true;

        this.contestService.createContest(this.contestCreateForm.value);
        this.wsservice.on<any>(IDs.contests.create)
            .subscribe((msg) => {
                this.loading = false;
                if (!msg['code']) {
                    this.message = 'Соревнование создано';
                }
                else {
                    this.message = 'Ошибка';
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    hasAccess(level) {
        console.log('contest access', level);

        if (this.currentUser.accessLevel < level) {
            return false;
        }
        return true;
    }

    ngOnDestroy() {
        this.wsservice.close();
    }
}
