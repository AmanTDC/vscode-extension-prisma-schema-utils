import { StringUtil } from "../utils/string";

export interface Property {
    name: String;
    value: String;
    token: string;
    toString() : String ;
};
export class BlockProperty implements Property {
    public name: string = '';
    public value: string = '';
    public token: string = '';
    constructor(line: string){
        let i;
        const property = line.trim();
        for(i=2;i<property?.length;i++){
            if(property[i] === '('){
                this.name = property.slice(2,i);
                this.value = property.slice(i+1,property.length-1);
                break;
            }
        }
        this.token = property;
        let arrays = [];
        let arrayStarting = StringUtil.getAllIndices(this.value,'[');
        let arrayClosing = StringUtil.getAllIndices(this.value,']');
        for(let i=0;i<arrayStarting.length;i++){
            arrays[i] = this.value.slice(arrayStarting[i+1],arrayClosing[i]).split(" ").join(" ").split(",").map(c=>`${StringUtil.toCamelCase(c)}`).join(", ");
            this.value = this.value.replace(this.value.slice(arrayStarting[i+1],arrayClosing[i]),arrays[i]);
        }
    }
    toString(): String {
        return `@@${this.name}(${this.value})`;
    }
}
export class FieldProperty implements Property {
    public name: string = '';
    public value: string = '';
    token: string = '';
    constructor(token: string){
        let i: number;
        for(i=1;i<token.length;i++){
            if(token[i] === '('){
                this.name = token.slice(1,i);
                this.value = token.slice(i+1,token.length-1);
                break;
            }
        }
        if(i===token.length){
            this.name = token.slice(1,token.length);
        }
        token = this.token;
        let arrays = [];
        let arrayStarting = StringUtil.getAllIndices(this.value,'[');
        let arrayClosing = StringUtil.getAllIndices(this.value,']');
        for(let i=0;i<arrayStarting.length;i++){
            arrays[i] = this.value.slice(arrayStarting[i+1],arrayClosing[i]).split(" ").join(" ").split(",").map(c=>`${StringUtil.toCamelCase(c)}`).join(", ");
            this.value = this.value.replace(this.value.slice(arrayStarting[i+1],arrayClosing[i]),arrays[i]);
        }
    }
    toString(): String {
        return `@${this.name}(${this.value})`;
    }
}