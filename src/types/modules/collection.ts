
type Collection={
    id:number|null;
    userId:number|null;
    name:string|null;
}

type ArticleCollection={
    collection:Collection|null;
    collected:boolean|null;
}

export type {
    Collection,
    ArticleCollection
}