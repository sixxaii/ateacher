import { Component, OnInit, OnDestroy } from '@angular/core';
import { Group, User } from '@/_models';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '@/_services/group.service';
import { AuthenticationService } from '@/_services';
import { IDs }  from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';

@Component({
    selector: 'app-addUser',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.less']
})
export class AddUserComponent implements OnInit, OnDestroy {
    private group: Group;
    private groupId: number;
    private users: User[];
    private members: User[];

    message = '';

    currentUser: User;

    constructor(private groupService: GroupService,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private wsservice: WebSocketService) { 
                    this.currentUser = this.authenticationService.currentUserValue;
                }

    ngOnInit(): void {
        this.groupId = this.route.snapshot.params.id;

        this.getGroupMembers();
    }

    getUsers() {
        this.groupService.getUsers();

        this.wsservice.on<any>(IDs.groups.members.users)
            .subscribe((msg) => {
                if (!msg['code']) {
                    let users = msg;
                    this.users = users.map(user => {
                        return new User({
                            username: user.username,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            middlename: user.middlename
                        });
                    });
                    
                    this.users = this.users.filter(user => {
                        let membersUsernames = this.members.map(member => {
                            return member.username;
                        });
        
                        return membersUsernames.indexOf(user.username) <= -1;
                    });
                }
                else {
                    this.message = 'Ошибка при удалении группы';
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    addUser(user) {
        let username = user.username;
        this.groupService.addUser(username, this.groupId);

        this.wsservice.on<any>(IDs.groups.members.add)
            .subscribe((msg) => {
                if (!msg['code']) {
                    this.message = 'Пользователь добавлен';
                }
                else {
                    this.message = 'Ошибка при добавлении пользователя';
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    getGroupMembers() {
        this.groupService.getRequestedGroup(this.groupId);

        this.wsservice.on<any>(IDs.groups.get)
            .subscribe((msg) => {
                this.getUsers();
                if (!msg['code']) {
                    let members = msg['users'];
                    members = members.map(member => {
                        return new User({
                            username: member.username,
                            firstname: member.firstname,
                            lastname: member.lastname,
                            middlename: member.middlename
                        });
                    });

                    this.members = members;
                }
                else {
                    this.message = 'Ошибка при удалении группы';
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
