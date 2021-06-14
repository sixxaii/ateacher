import { AccessLevel } from './accessLevel';

export class User {
    id: number;
    username: string;
    password: string;
    email?: string;
    firstname: string;
    lastname: string;
    middlename?: string;
    token?: string;
    accessLevel: AccessLevel;
    accessToken: any;

    public constructor(init?:Partial<User>) {
        Object.assign(this, init);
    }
}