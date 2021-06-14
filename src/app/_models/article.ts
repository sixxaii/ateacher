export class Article {
    id: number;
    name: string;
    legend: string;

    public constructor(init?:Partial<Article>) {
        Object.assign(this, init);
    }
}