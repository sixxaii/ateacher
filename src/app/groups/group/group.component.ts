import { Component, OnInit, OnDestroy } from '@angular/core';
import { Group, User } from '@/_models';
import { AuthenticationService } from '@/_services';
import { GroupService } from '@/_services/group.service';
import { ActivatedRoute } from '@angular/router';
import { IDs }  from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';

@Component({ 
    templateUrl: 'group.component.html',
    styleUrls: ['./group.component.less']
})
export class GroupComponent implements OnInit, OnDestroy {
    private group: Group;
    private groupId: number;

    message = '';

    currentUser: User;

    constructor(private groupService: GroupService,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private wsservice: WebSocketService) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.groupId = this.route.snapshot.params.id;
 
        this.getRequestedGroup();
    }

    getRequestedGroup() {
        this.groupService.getRequestedGroup(this.groupId);

        this.wsservice.on<any>(IDs.groups.get)
            .subscribe((msg) => {
                console.log('group get', msg);
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

                    let group = msg;
                    this.group = new Group({
                        name: group.display_name,
                        id: group.id,
                        members: members
                    });
                }
                else {
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    removeUser(user) {
        let username = user.username;
        this.groupService.removeUser(username, this.groupId);
        
        let ind = this.group.members.indexOf(user);
        this.group.members.splice(ind, 1);

        this.wsservice.on<any>(IDs.groups.members.remove)
            .subscribe((msg) => {
                if (!msg['code']) {
                    this.message = 'Пользователь удален из группы';
                }
                else {
                    this.message = 'Ошибка при удалении пользователя из группы';
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
