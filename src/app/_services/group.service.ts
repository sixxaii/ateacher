import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { User, Group } from '../_models';
import { IDs }  from '@/_helpers';
import { WebSocketService } from './websocket';

@Injectable({ providedIn: 'root' })
export class GroupService {
    currentUser: User;

    constructor(private authenticationService: AuthenticationService,
                private wsservice: WebSocketService) 
    { 
        this.currentUser = this.authenticationService.currentUserValue;
        console.log('group');
    }

    createGroup(group: Group, users) {
        console.log(users);
        let id = IDs.groups.create;
        let body = { 
            "method": "group.create",
            "params": {
                "group_name": group.name,
                "access_token": this.currentUser.token,
                "users": users
            }
        };

        this.wsservice.send(id, body);
    }

    getRequestedGroup(groupId) {
        let id = IDs.groups.get;
        let body = { 
            "method": "group.get",
            "params": {
                "access_token": this.currentUser.token,
                "group_id": +groupId
            }
        };

        this.wsservice.send(id, body);
    }

    getGroups() {
        console.log('service get groups()');

        let id = IDs.groups.list;
        let body = { 
            "method": "groups.list",
            "params": {

            }
        };

        this.wsservice.send(id, body);
    }

    getUserGroups() {
        let id = IDs.groups.userList;
        let body = { 
            "method": "user.getGroups",
            "params": {
                "access_token": this.currentUser.token,
                "username": this.currentUser.username
            }
        };

        this.wsservice.send(id, body);
    }

    getUsers() {
        let id = IDs.groups.members.users;
        let body = { 
            "method": "users.list",
            "params": {
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    removeGroup(gid) {
        let id = IDs.groups.remove;
        let body = { 
            "method": "group.delete",
            "params": {
                "group_id": gid,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    removeUser(username, groupId) {
        let id = IDs.groups.members.remove;
        let body = { 
            "method": "group.removeUser",
            "params": {
                "group_id": +groupId,
                "username": username,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    addUser(username, groupId) {
        let id = IDs.groups.members.add;
        let body = { 
            "method": "group.addUser",
            "params": {
                "group_id": +groupId,
                "username": username,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }
}