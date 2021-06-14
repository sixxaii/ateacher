import { Injectable } from '@angular/core';
import { AuthenticationService } from '@/_services';
import { User } from '@/_models';
import { Subject } from 'rxjs';
import { requestStatus, IDs } from '@/_helpers';
import { WebSocketService } from './websocket';

@Injectable({ providedIn: 'root' })
export class TaskService {
    currentUser: User;
    private method: string;
    public messages: Subject<any>;

    constructor(private authenticationService: AuthenticationService,
                private wsservice: WebSocketService) 
    { 
        this.currentUser = this.authenticationService.currentUserValue;
        console.log('tasks');
    }

    getTasks() {
        let id = IDs.task.list;
        let body = { 
            "method": "tasks.list",
            "params": {
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    postFile(taskId: number, fileToUpload: File, compilerId, courseId) /*: Observable<boolean>*/ {
        let message = '';

        let reader = new FileReader();
        reader.readAsArrayBuffer(fileToUpload);

        let body = {
            "method": "file.uploadSolution",
            "params": {
                "access_token": this.currentUser.token,
                "course_id": +courseId,
                "tid": +taskId,
                "compiler_name": compilerId
            }
        };

        console.log(body);

        reader.onload = function(e) {
            let socket = new WebSocket('wss://ateacher.io/api');
            socket.binaryType = "blob";
            socket.addEventListener('open', function() {
                let size = new Uint32Array(1);
                let payloadSize = new Uint32Array(1);
                size[0] = JSON.stringify(body).length;
                payloadSize[0] = fileToUpload.size;
                let blob = new Blob([size, JSON.stringify(body), payloadSize, reader.result]);
                socket.send(blob);
                socket.addEventListener('message', function(e) {
                    console.log(e.data);
                    message = requestStatus.success;
                });
            });
        }

        return message;
    }

    getRuns(taskId: number, courseId: number) {
        let id = IDs.task.runs.get;
        let body = { 
            "method": "runs.get",
            "params": {
                "tid": +taskId,
                "course_id": +courseId,
                "username": this.currentUser.username,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    getTask(taskId: number) {
        let id = IDs.task.get;
        let body = { 
            "method": "task.get",
            "params": {
                "cid": 1,
                "id": +taskId,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }

    getCompilers() {
        let id = IDs.task.compilers.list;
        let body = { 
            "method": "compilers.list",
            "params": {

            }
        };

        this.wsservice.send(id, body);
    }

    importTask(taskInfo) {
        let id = IDs.task.import;
        let body = { 
            "method": "polygon.importTask",
            "params": {
                "taskid": taskInfo.taskId,
                "polygon_login": taskInfo.login,
                "polygon_password": taskInfo.password,
                "access_token": this.currentUser.token
            }
        };

        this.wsservice.send(id, body);
    }
}