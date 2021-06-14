import { Component, OnInit, OnDestroy } from '@angular/core';
import { Group, User } from '@/_models';
import { Error } from '@/_models';
import { GroupService } from '@/_services/group.service';
import { AuthenticationService } from '@/_services';
import { IDs }  from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';

@Component({ 
    templateUrl: 'groups.component.html',
    styleUrls: ['./groups.component.less']
})
export class GroupsComponent implements OnInit, OnDestroy {
    public filter = {
        q: '',
        tags: undefined,
        page: undefined
    };
    private groups: Group[];

    message = '';

    currentUser: User;

    constructor(private groupService: GroupService,
                private authenticationService: AuthenticationService,
                private wsservice: WebSocketService) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.getGroups();
    }

    getGroups() {
        console.log('get groups()');
        this.groupService.getGroups();

        this.wsservice.on<any>(IDs.groups.list)
            .subscribe((msg) => {
                if (!msg['code']) {
                    let groups = msg;
                    this.groups = groups.map(group => {
                        return new Group({
                            name: group['display_name'],
                            id: group.id
                        })
                    });
                }
                else {
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    search() {
        this.groups.filter((val) => {
            return val.name.toLowerCase().indexOf(this.filter.q) > -1;
         });
    }

    removeGroup(group) {
        let ind = this.groups.indexOf(group);
        this.groups.splice(ind, 1);

        let id = group.id;
        this.groupService.removeGroup(id);

        this.wsservice.on<any>(IDs.groups.remove)
            .subscribe((msg) => {
                if (!msg['code']) {
                    this.message = 'Группа удалена';
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
