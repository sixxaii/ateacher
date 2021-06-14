export class TaskCompiler {
    id: number;
    name: string;

    public constructor(init?:Partial<TaskCompiler>) {
        Object.assign(this, init);
    }
}