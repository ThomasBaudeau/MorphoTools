class Node{
    constructor(id,pos){
        this.id=id;
        this.pos=pos;
        this.link=[];
    }
    static AddEdge(id,prob){
        this.link.push({'id':id,'prob':prob});
    }
}

class Assembly{
    constructor(nodes){
        this.nodes=nodes;
    }
    static makeJson(){
        for (node in this.nodes){
            //construire un JSON
        }
    }
}