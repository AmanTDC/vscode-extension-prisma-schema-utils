export class StringUtil{
    str: string = "";
    public static ignoredChars = ["\n", "\t", "\r", " "];

    static getLines(str: string): Array<string> {
        return str.split("\n").filter(l=>l!=='');
    }
    static getIthWord(string: string, separator: string, i: number){
        // return string.split(separator).filter(l=>l!=='')?.[i];
        return StringUtil.getTokens(string).filter(l=>l!=='')?.[i];
    }
    static getTokens(str: string): Array<string> {
        if(!str){
            return [];
        }
        let tokenStart: number | undefined;
        let bracesCount: number = 0;
        const tokens: string[] = [];
        const text = str.trim();
        let i = 0;
        for(i = 0; i<text.length; i++){
            if(StringUtil.ignoredChars.includes(text[i])){
                if(tokenStart!==undefined && bracesCount === 0){
                    tokens.push(text.slice(tokenStart, i).trim());
                    tokenStart = undefined;
                }
                continue;
            }
            if(tokenStart===undefined){
                tokenStart = i;
            }
            else if(text[i] === "("){
                bracesCount++;
            }
            else if(text[i] === ")"){
                bracesCount--;
            }
        }
        if (bracesCount === 0){
            if(str[i-1] === ')'){
                tokens.push(text.slice(tokenStart, i-1).trim());
            }
            else{
                tokens.push(text.slice(tokenStart, i).trim());
            }
        }

        return tokens;
    }
    static getBlocks(str: string): Array<string> {
        let blockStart: number | undefined = 0;
        let blocks: string[] = [];
        let i = 0;
        const text = str.trim();
        for(;i<text.length;i++){
            if(blockStart === undefined && text[i] === '{'){
                blockStart = i;
            }
            if(text[i] === '}'){
                blocks.push(text.slice(blockStart, i+1).trim());
                blockStart = i+1;
            }
        }
        return blocks;
    }
    static toCamelCase(input: String) {
        const pascal =  StringUtil.toPascalCase(input);
        return input?.charAt(0)?.toLowerCase()+pascal?.slice(1);
    }
    static toPascalCase(str:String) {
        if(!str){
            return '';
        }
        return str.split("_").map((w)=>w.charAt(0).toUpperCase()+w.slice(1)).join('');
        
    }
    static getAllIndices(line:string, char:string){
        var indices = [];
        for(var i=0; i<line.length;i++) {
            if (line[i] === char) {
                indices.push(i);
            };
        }
        return indices;
    }
    static isComment(line: string){
        return line.trim().startsWith('//');
    }
    static getComments(lines: string[]): string[]{
        return lines.filter(l=>l.trim().startsWith('//')).map(l=>l.trim().slice(2).trimStart());
    }
}