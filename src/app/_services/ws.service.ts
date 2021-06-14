import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as Rx from 'rxjs/Rx';

@Injectable({ providedIn: 'root' })
export class WebsocketService {

    readonly url: string = 'wss://ateacher.io/api';
    public messages: Subject<any>;
    
    constructor() {
        console.log('websocket constructor');
        this.connect();
    }

    public reconnect() {
        console.log('websocket reconnect');
        this.connect();
    }

    private subject: Rx.Subject<MessageEvent>;

    public connect(): Rx.Subject<MessageEvent> {
        //if (!this.subject) {
            this.subject = this.create(this);
            console.log("Successfully connected: " + this.url);
        //}

        this.messages = <Subject<any>>this.subject.map(
            (response: MessageEvent): any => {
                console.log("Response from websocket: " + response.data);
                let data = JSON.parse(response.data);
                console.log(data);
                if (data['error']) {
                    //this.reconnect();
                }
                return data;
            }
        );
        return this.subject;
    }

    private create(context): Rx.Subject<MessageEvent> {
        let ws = new WebSocket(this.url);

        let observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
            ws.onmessage = obs.next.bind(obs);
            ws.onerror = function(err) {
                obs.error.bind(obs);
                console.error('Socket encountered error, closing socket');
                ws.close();
            }

            ws.onclose = function() {
                ws = null;
                //setTimeout(context.reconnect(), 500)
            }
            
        });
        let observer = {
            next: (data: Object) => {
                setTimeout(send, 500);

                function send(){
                    if (ws.readyState==1) {
                        ws.send(JSON.stringify(data));
                    }
                    else
                        setTimeout(send, 500);
                }
            }
        };
        return Rx.Subject.create(observer, observable);
    }

}