import { PrismaScalarTypes } from "../constants/scalar-types";
import { StringUtil } from "../utils/string";
import { FieldProperty } from "./property";

export interface Field {
    name: string;
    toString(): String;
}
export class ModelField implements Field {
    public type: string = "";
    public name: string = "";
    public properties: FieldProperty[] = [];
    constructor(line: string){
        const tokens = StringUtil.getTokens(line);
        for(let i=2;i<tokens.length;i++){
            this.properties.push(new FieldProperty(tokens[i]));
        }
        if(!/\@map/.test(line)){
            let dataType = tokens[1].trim();
            if(dataType[dataType.length-1]==='?'){
                dataType = dataType.slice(0,dataType.length-1);
            }
            if(PrismaScalarTypes.includes(dataType)){
                this.properties.push( new FieldProperty(`@map("${tokens[0]}")`));
            }
            this.name = StringUtil.toCamelCase(tokens[0]);
        }
        else {
            this.name = tokens[0];
        }
        this.type = StringUtil.toPascalCase(tokens[1]);
        console.log(tokens[1]);
    }
    toString(): String {
        return `${this.name} ${this.type} ${this.properties
            .map((p)=>p.toString())
            .join(" ")}`;
    }
}
export class EnumField implements Field {
    public name: string = "";
    public properties: FieldProperty[] = [];
    toString(): String {
        return `${this.name}`;
    }
}
export class ImmutableField implements Field {
    name: string = '';
    constructor(value: string){
        this.name = value.trim();
    }
    toString(): String {
        return `${this.name}`;
    }
}