import { PrismaScalarTypes } from "../constants/scalar-types";
import { StringUtil } from "../utils/string";
import { FieldProperty } from "./property";

export interface Field {
    name: string;
    line: string;
    toString(): String;
}
export class ModelField implements Field {
    public type: string = "";
    public name: string = "";
    public properties: FieldProperty[] = [];
    public line: string = '';
    public isOptional: boolean = false;
    public isArray: boolean = false;
    constructor(line: string){
        this.line = line;
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
            this.name = tokens[0];
            // this.name = StringUtil.toCamelCase(tokens[0]);
        }
        else {
            this.name = tokens[0];
        }
        // this.type = StringUtil.toPascalCase(tokens[1]);
        this.type = tokens[1];
        if(this.type.includes("?")){
            this.isOptional = true;
            this.type = this.type.slice(0,this.type.length-1);
        }
        if(this.type.includes("[]")){
            this.isArray = true;
            this.type = this.type.slice(0,this.type.length-2);
        }

    }
    toString(): String {
        return `${this.name} ${this.type} ${this.properties
            .map((p)=>p.toString())
            .join(" ")}`;
    }
    getCamelDataType(dynamicMapping: any,renameModelsFromSchemas:string[], type: string){
        let dt = this.type;
        if(dynamicMapping.hasOwnProperty(this.type)){
            dt = StringUtil.toPascalCase(dynamicMapping[this.type].mappingName);
            if(renameModelsFromSchemas.includes(dynamicMapping[this.type].schemaName)){
                dt = StringUtil.toPascalCase(dynamicMapping[this.type].schemaName)+dt;
            }
        }
        return dt+(this.isArray?"[]":'')+(this.isOptional?'?':'');
        
    }
    toCamelCase(dynamicMapping: any, renameModelsFromSchemas: string[]): String {
        return `${StringUtil.toCamelCase(this.name)} ${this.getCamelDataType(dynamicMapping,renameModelsFromSchemas, this.type)} ${this.properties
            .map((p)=>p.toString())
            .join(" ")}`;
    }
}
export class EnumField implements Field {
    public name: string = "";
    line: string = '';
    public properties: FieldProperty[] = [];
    constructor(line:string){
        this.line = line;
    }
    toString(): String {
        return `${this.name}`;
    }
}
export class ImmutableField implements Field {
    name: string = '';
    line: string = '';
    constructor(value: string){
        this.line = this.line;
        this.name = value.trim();
    }
    toString(): String {
        return `${this.name.trim()}`;
    }
}