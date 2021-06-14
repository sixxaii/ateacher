export class TaskListItem {
    id: number;
    name: string;
    
    public constructor(init?:Partial<TaskListItem>) {
        Object.assign(this, init);
    }
}