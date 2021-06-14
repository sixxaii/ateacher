import { User } from "./user";

export class Group {
    id: number;
    name: string;
    createdBy: User;
    members: User[];

    public constructor(init?:Partial<Group>) {
        Object.assign(this, init);
    }
}