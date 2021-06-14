export class Task {
    id: number;
    name: string;
    legend: string;
    complexity: number;
    timeLimit: number;
    memoryLimit: number;
    input: string;
    output: string;
    tags: string[];
    entityId: number;

    public constructor(init?:Partial<Task>) {
        Object.assign(this, init);
    }
}