import { Injectable, OnDestroy, Inject } from '@angular/core';
import { Observable, SubscriptionLike, Subject, Observer, interval } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';

import { share, distinctUntilChanged, takeWhile } from 'rxjs/operators';
import { IWebsocketService, IWsMessage, WebSocketConfig } from './websocket.interfaces';
import { config } from './websocket.config';


@Injectable({
    providedIn: 'root'
})
export class WebSocketService implements IWebsocketService, OnDestroy {

    private config: WebSocketSubjectConfig<IWsMessage<any>>;

    private websocketSub: SubscriptionLike;
    private statusSub: SubscriptionLike;

    private reconnection$: Observable<number>;
    private websocket$: WebSocketSubject<IWsMessage<any>>;
    private connection$: Observer<boolean>;
    public wsMessages$: Subject<IWsMessage<any>>;

    private reconnectInterval: number;
    private reconnectAttempts: number;
    private isConnected: boolean;


    public status: Observable<boolean>;

    constructor(@Inject(config) private wsConfig: WebSocketConfig) {
        console.log('[WebSocketService] constructor');
        this.wsMessages$ = new Subject<IWsMessage<any>>();

        this.reconnectInterval = wsConfig.reconnectInterval || 2000; // pause between connections
        this.reconnectAttempts = wsConfig.reconnectAttempts || 10; // number of connection attempts

        this.config = {
            url: wsConfig.url,
            closeObserver: {
                next: (event: CloseEvent) => {
                    console.log('[WebSocketService] WebSocket closed!');
                    this.websocket$ = null;
                    this.connection$.next(false);
                    this.isConnected = false;
                    //this.wsMessages$.complete();
                    //this.connection$.complete();
                }
            },
            openObserver: {
                next: (event: Event) => {
                    console.log('[WebSocketService] WebSocket connected!');
                    this.connection$.next(true);
                    this.isConnected = true;
                }
            }
        };

        // connection status
        this.status = new Observable<boolean>((observer) => {
            this.connection$ = observer;
        }).pipe(share(), distinctUntilChanged());

        // run reconnect if not connection
        this.statusSub = this.status
            .subscribe((isConnected) => {
                this.isConnected = isConnected;

                if (!this.reconnection$ && typeof(isConnected) === 'boolean' && !isConnected) {
                    this.reconnect();
                }
            });

        this.websocketSub = this.wsMessages$.subscribe(
            null, (error: ErrorEvent) => console.error('WebSocket error!', error)
        );

        this.connect();
    }

    ngOnDestroy() {
        this.websocketSub.unsubscribe();
        this.statusSub.unsubscribe();
    }


    /*
    * connect to WebSocket
    * */
    public connect(): void {
        this.websocket$ = new WebSocketSubject(this.config);

        this.websocket$.subscribe(
            (message) => this.wsMessages$.next(message),
            (error: Event) => {
                if (!this.websocket$) {
                    // run reconnect if errors
                    this.reconnect();
                }
            });
    }


    /*
    * reconnect if not connecting or errors
    * */
    private reconnect(): void {
        this.reconnection$ = interval(this.reconnectInterval)
            .pipe(takeWhile((v, index) => index < this.reconnectAttempts && !this.websocket$));

        this.reconnection$.subscribe(
            () => this.connect(),
            null,
            () => {
                // Subject complete if reconnect attemts ending
                this.reconnection$ = null;

                if (!this.websocket$) {
                    this.wsMessages$.complete();
                    this.connection$.complete();
                }
            });
    }


    /*
    * on message event
    * */
    public on<T>(eventId: any): Observable<T> {
        console.log(eventId);
        if (eventId) {
            return this.wsMessages$.pipe(
                filter((message: IWsMessage<T>) => message.id === eventId),
                map((message: IWsMessage<T>) => message.result ? message.result : message.error)
            );
        }
    }


    /*
    * on message to server
    * */
    public send(eventId: any, data: any = {}): void {
        console.log('SEND');
        let that = this;
        if (eventId && this.isConnected && this.websocket$) {
            data['id'] = eventId;
            this.websocket$.next(data);
        } else {
            setTimeout(function() {
                that.send(eventId, data);
            }, 500);
            console.log('Still connecting, resending messsage...');
        }
    }

    public close() {
        //this.websocket$.complete();
    }
}