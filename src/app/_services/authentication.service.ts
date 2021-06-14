import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '@/_models';
import { WebSocketService } from '@/_services/websocket';
import { Md5 } from 'ts-md5';
import { IDs }  from '@/_helpers';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private wsservice: WebSocketService) {
        //console.log('USER', localStorage.setItem('currentUser'));
        //localStorage.setItem('currentUser', 'null')
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        console.log('login service');

        let id = IDs.authentication.login;
        let body = { 
            "method": "user.authorize",
            "params": {
                "username": username,
                "password": Md5.hashStr(password),
                "exp": 86400
            }
        };

        this.wsservice.send(id, body);
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    setUser(basicInfo = null, username = null, _user = null) {
        let user: User;
        console.log('basic', basicInfo);
        if (!_user) {
            user = new User({
                username: username,
                lastname: basicInfo.lastname,
                firstname: basicInfo.fistname,
                middlename: basicInfo.middlename,
                accessLevel: +basicInfo.access_level,
                token: basicInfo.access_token
            });
        }
        else user = _user;

        localStorage.setItem('currentUser', JSON.stringify(user));        
        this.currentUserSubject.next(user);
    }

    getUserInfo(username) {
        let id = IDs.authentication.getUserInfo;
        let body = { 
            "method": "user.getInfo",
            "params": {
                "username": username
            }
        };

        this.wsservice.send(id, body);
   
        let userInfo: User;
        return this.wsservice.on<any>(IDs.authentication.getUserInfo).pipe(map(msg => {
            console.log('msg', msg);
            if (!msg['code']) {
                userInfo = new User({
                    id: msg.id,
                    username: msg.username,
                    lastname: msg.lastname,
                    firstname: msg.firstname,
                    middlename: msg.middlename,
                    accessLevel: +msg.access_level
                });
            }

            return userInfo;
        }));
    }

    register(user: User) {
        let id = IDs.authentication.register;
        let body = { 
            "method": "user.register",
            "params": {
                "username": user.username,
                "email": user.email,
                "password": Md5.hashStr(user.password),
                "firstname": user.firstname,
                "lastname": user.lastname,
                "middlename": user.middlename
            }
        };

        this.wsservice.send(id, body);
    }
}