import { TaskListItem } from "./taskListItem";

export class Contest {
    id: number;
    name: string;
    description: string;
    contestTasks: TaskListItem[];
    duration: number;

    public constructor(init?:Partial<Contest>) {
        Object.assign(this, init);
    }
}