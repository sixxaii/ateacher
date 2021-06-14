import { runResult } from "@/_helpers";

export class TaskRun {
    id: number;
    testsCount: number;
    result: string;

    public constructor(init?:Partial<TaskRun>) {
        Object.assign(this, init);
        if (this.result) 
            this.result = runResult[this.result];
    }
}