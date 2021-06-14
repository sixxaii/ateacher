import { Component, OnInit, OnDestroy } from '@angular/core';
import { Group, User } from '@/_models';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, AuthenticationService } from '@/_services';
import { GroupService } from '@/_services/group.service';
import { Error } from '@/_models';
import { IDs }  from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';

@Component({ 
    templateUrl: 'groups.create.component.html',
    styleUrls: ['./groups.create.component.less']
})
export class GroupsCreateComponent implements OnInit, OnDestroy {
    currentUser: User;
    groupCreateForm: FormGroup;
    loading = false;
    submitted = false;
    message = '';

    users: User[];
    allUsers: User[];

    constructor(private formBuilder: FormBuilder, 
                private groupService: GroupService,
                private alertService: AlertService,
                private authenticationService: AuthenticationService,
                private wsservice: WebSocketService) 
    {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.groupCreateForm = this.formBuilder.group({
            name: ['', Validators.required]
        });

        this.getUsers();

        this.users = [];
    }

    getUsers() {
        this.groupService.getUsers();

        this.wsservice.on<any>(IDs.groups.members.users)
            .subscribe((msg) => {
                if (!msg['code']) {
                    let allUsers = msg;
                    console.log(allUsers);
                    this.allUsers = allUsers.map(user => {
                        return new User({
                            firstname: user.firstname,
                            id: user.id,
                            lastname: user.lastname,
                            username: user.username,
                            middlename: user.middlename
                        })
                    });
                }
                else {
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    addUser(user) {
        this.users.push(user);
    }

    removeUser(user) {
        let ind = this.users.indexOf(user);
        delete this.users[ind];
    }

    alreadyContains(user) {
        return this.users.indexOf(user) > -1;
    }

    get f() { return this.groupCreateForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.groupCreateForm.invalid) {
            return;
        }

        this.loading = true;
        let members = this.users.map(user => {
            return user.username;
        });

        this.groupService.createGroup(this.groupCreateForm.value, members);
        this.wsservice.on<any>(IDs.groups.create)
            .subscribe((msg) => {
                this.loading = false;
                if (!msg['code']) {
                    this.message = 'Группа создана';
                }
                else {
                    this.message = 'Ошибка при создании группы';
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
