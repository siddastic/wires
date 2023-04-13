export class UniqueIdGenerator{
    index = 0;
    create(){
        let newId = `uid${this.index}`;
        this.index++;
        return newId;
    }
}