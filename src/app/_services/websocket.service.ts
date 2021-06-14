import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import { Observable, timer, Subject, EMPTY } from 'rxjs';
import { retryWhen, tap, delayWhen, switchAll, catchError } from 'rxjs/operators';
export const WS_ENDPOINT = environment.ws;
export const RECONNECT_INTERVAL = environment.reconnectInterval;


@Injectable({
    providedIn: 'root'
})
export class WebSocketService {

    private socket$;
    private messagesSubject$ = new Subject();
    public messages$ = this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e }));

    constructor() {
        console.log('WebSocketService created');
    }

    /**
     * Creates a new WebSocket subject and send it to the messages subject
     * @param cfg if true the observable will be retried.
     */
    public connect(cfg: { reconnect: boolean } = { reconnect: false }): void {
        if (!this.socket$ || this.socket$.closed) {
            this.socket$ = this.getNewWebSocket();
            console.log(this.socket$);
            const messages = this.socket$.pipe(cfg.reconnect ? this.reconnect : o => o,
                tap({
                    error: error => console.log(error),
                }), catchError(_ => EMPTY))
            //toDO only next an observable if a new subscription was made double-check this
            this.messagesSubject$.next(messages);
        }
    }

    /**
     * Retry a given observable by a time span
     * @param observable the observable to be retried
     */
    private reconnect(observable: Observable<any>): Observable<any> {
        return observable.pipe(retryWhen(errors => errors.pipe(tap(val => console.log('[WebsocketService] Try to reconnect', val)),
            delayWhen(_ => timer(RECONNECT_INTERVAL)))));
    }

    close() {
        this.socket$.complete();
        this.socket$ = undefined;
    }

    sendMessage(msg: any) {
        this.socket$.next(msg);
    }

    /**
     * Return a custom WebSocket subject which reconnects after failure
     */
    private getNewWebSocket() {
        return webSocket({
            url: WS_ENDPOINT,
            openObserver: {
                next: () => {
                    console.log('[WebsocketService]: connection ok');
                }
            },
            closeObserver: {
                next: () => {
                    console.log('[WebsocketService]: connection closed');
                    this.socket$ = undefined;
                    this.connect({ reconnect: true });
                }
            },

        });
    }

}