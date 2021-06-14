import { User } from "./user";
import { TaskResult } from "./taskResult";

export class ContestResult {
    id: number;
    user: User;
    tasks: TaskResult[];
    tasksSolvedCount: number;
    score: number;

    public constructor(init?:Partial<ContestResult>) {
        Object.assign(this, init);
    }
}