export class PullRequest {
    id:number
    number:number
    title:string
    author:string
    commit_count:number
    constructor(id:number,number:number,title:string,author:string,commit_count:number){
        this.id=id
        this.number=number
        this.title=title
        this.author=author
        this.commit_count=commit_count
    }
}