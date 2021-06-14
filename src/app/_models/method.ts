import { Param } from './param';

export class Method {
    id: number;
    name: string;
    description: string;
    params: Param[];

    public constructor(init?:Partial<Method>) {
        Object.assign(this, init);
    }
}