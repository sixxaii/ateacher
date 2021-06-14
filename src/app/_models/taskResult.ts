export class TaskResult {
    id: number;
    taskId: number;
    result: string;

    public constructor(init?:Partial<TaskResult>) {
        Object.assign(this, init);
    }
}