export class Link {
    id: number;
    url: string;

    public constructor(init?:Partial<Link>) {
        Object.assign(this, init);
    }
}