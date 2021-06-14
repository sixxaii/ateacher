import { Component, OnInit, OnDestroy } from '@angular/core';
import { Method } from '@/_models';
import { IDs }  from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';

@Component({
  selector: 'app-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.less']
})
export class DocComponent implements OnInit, OnDestroy {
    currentMethod: Method;
    methods: Method[];

    constructor(private wsservice: WebSocketService) { }

    ngOnInit() {
        this.getMethods();
    }

    getMethods() {
        let id = IDs.doc.methodsList;
        let body = { 
            "method": "dev.methodsList"
        };

        this.wsservice.send(id, body);
        this.wsservice.on<any>(IDs.doc.methodsList)
            .subscribe((msg) => {
                if (!msg['code']) {
                    this.methods = msg.map(m => {
                        return new Method({
                            name: m
                        });
                    });
                }
                else {
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    getMethodInfo(method: Method) {
        this.currentMethod = method;

        let id = IDs.doc.methodInfo;
        let body = { 
            "method": "dev.getMethodInfo",
            "params": {
                "name": this.currentMethod.name
            }
        };

        this.wsservice.send(id, body);
        this.wsservice.on<any>(IDs.doc.methodInfo)
            .subscribe((msg) => {
                if (!msg['code']) {
                    this.currentMethod.description = msg.description;
                    if (msg.params) {
                        this.currentMethod.params = msg.params;
                    }
                }
                else {
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    ngOnDestroy() {
        this.wsservice.close();
    }
}
