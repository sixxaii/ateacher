import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContestResult, User, TaskResult } from '@/_models';
import './results.component.less';
import { ContestService } from '@/_services/contest.service';
import { IDs }  from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';

@Component({ 
    templateUrl: 'results.component.html'
})
export class ResultsComponent implements OnInit, OnDestroy {
    private results: ContestResult[];
    private contestId: number;

    isLoading: boolean;

    contestResultPagedConfig: any;

    constructor(
        private route: ActivatedRoute,
        private contestService: ContestService,
        private wsservice: WebSocketService) {
            console.log('RESULTS', this.results);
    }

    ngOnInit() {
        this.contestId = this.route.snapshot.params.id;
        this.getRequestedContestResults(this.contestId);
        this.isLoading = true;
    }

    getRequestedContestResults(id: number) {
        this.contestService.getContestResults(id);
        this.wsservice.on<any>(IDs.contests.results)
            .subscribe((msg) => {
                if (!msg['code']) {
                    let results = msg["rows"];
                    this.results = results.map(result => {
                        return new ContestResult({
                            id: result.id,
                            tasks: result.results.map(task => { 
                                return new TaskResult({ 
                                    result: task == 0 ? '' : task > 0 ? '+' + (task - 1 == 0 ? '' : task - 1) : task 
                                }); 
                            }),
                            user: new User({ username: result.username }),
                            tasksSolvedCount: result.count_full
                        });
                    });
                }
                else {
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    onPageChange(event){
        this.contestResultPagedConfig.currentPage = event;
    }

    resultsDefined() {
        return this.results !== undefined ? this.results.length > 0 : false;
    }

    ngOnDestroy() {
        this.wsservice.close();
    }
}
