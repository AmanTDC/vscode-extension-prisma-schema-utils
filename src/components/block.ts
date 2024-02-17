import { StringUtil } from "../utils/string";
import { EnumField, Field, ImmutableField, ModelField } from "./field";
import { BlockProperty } from "./property";


const blockPropertyRegex = /\@\@/;
export class Block {
    name: string = '';
    type: string = '';
    fields: Field[] = [];
    properties: BlockProperty[] = [];
    toString(): String {
        return `\n${this.type} ${this.name} { ${'\n\t'}${this.fields.map((f)=>f.toString()).join("\n\t")}${'\n\n\t'}${this.properties.map((p)=>p.toString()).join("\n\t")}${'\n'}}\n`;
    }
}
export class Model extends Block{
    public name: string = "";
    public type: string = "model";
    public fields: ModelField[] = [];
    public properties: BlockProperty[] = [];
    constructor(lines: string[], renameModelsFromSchemas: string[]){
        super();
        this.name = StringUtil.getIthWord(lines[0], " ", 1);
        this.type = StringUtil.getIthWord(lines[0], " ", 0);
        let isMapped = false;
        let schemaName = "";
        let originalName = "";
        for(let i=1;i<lines.length-1;i++){
            if(blockPropertyRegex.test(lines[i])){
                if(/\@\@map/.test(lines[i])){
                    isMapped = true;
                    originalName = StringUtil.getTokens(lines[i])?.[0].slice(7,-2);
                }
                else if(/\@\@schema/.test(lines[i])){
                    schemaName = StringUtil.getTokens(lines[i])?.[0].slice(10,-2);
                }
                this.properties.push(new BlockProperty(lines[i]));
            }
            else{
                this.fields.push(new ModelField(lines[i]));
            }
        }
        if(!isMapped){
            this.properties.push(new BlockProperty(`@@map("${this.name}")`));
        }
        if(renameModelsFromSchemas.includes(schemaName)){
            this.name = StringUtil.toPascalCase(schemaName)+StringUtil.toPascalCase(originalName||this.name);
        }
        else{
         this.name = StringUtil.toPascalCase(originalName||this.name);
        }
    }

}
export class Enum extends Block{
    public name: string = "";
    public type: string = "enum";
    public fields: ImmutableField[] = [];
    public properties: BlockProperty[] = [];
    constructor(lines: string[], renameModelsFromSchemas: string[]){
        super();
        this.name = StringUtil.getIthWord(lines[0], " ", 1);
        this.type = StringUtil.getIthWord(lines[0 ], " ", 0);
        let isMapped = false;
        let originalName = "";
        let schemaName = "";
        for(let i=1;i<lines.length-1;i++){
            if(blockPropertyRegex.test(lines[i])){
                if(/\@\@map/.test(lines[i])){
                    isMapped = true;
                    originalName = StringUtil.getTokens(lines[i])?.[0].slice(7,-2);
                }
                this.properties.push(new BlockProperty(lines[i]));
            }
            else{
                this.fields.push(new ImmutableField(lines[i]));
                schemaName = StringUtil.getTokens(lines[i])?.[0].slice(10,-2);
            }
        }
        if(!isMapped){
            this.properties.push(new BlockProperty(`@@map("${this.name}")`));
            this.name = StringUtil.toPascalCase(this.name);
        }
        if(renameModelsFromSchemas.includes(schemaName)){
            this.name = StringUtil.toPascalCase(schemaName)+StringUtil.toPascalCase(originalName||this.name);
        }
        else{
         this.name = StringUtil.toPascalCase(originalName||this.name);
        }
    }
}

export class ImmutableBlock extends Block {
    public fields: ImmutableField[] = [];
    public properties: BlockProperty[] = [];
    constructor(lines: string[]){
        super();
        this.name = StringUtil.getIthWord(lines[0], " ", 1);
        this.type = StringUtil.getIthWord(lines[0], " ", 0);
        for(let i=1;i<lines.length-1;i++){
            if(lines[i].trim()!==""){
                this.fields.push(new ImmutableField(lines[i]));
            }
        }
    }
}
export class DataSource extends ImmutableBlock {
    public comments: string[] = [];
    public renameModelsFromSchemas: string[] = [];
    constructor(lines:string[]){
        super(lines);
        this.comments = StringUtil.getComments(lines);
        this.comments.forEach( comment => {
            if(comment.startsWith("renameModelsFromSchemas")){
                this.renameModelsFromSchemas = StringUtil.getTokens(comment).slice(1);
            }
        });
    }
}