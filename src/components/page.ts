import { StringUtil } from "../utils/string";
import { Block, Enum, ImmutableBlock, Model } from "./block";

export class Page {
    public immutableBlocks: ImmutableBlock[] = [];
    public models: Model[] = [];
    public enums: Enum[] = [];
    constructor(public text: string) {
        const blocks = StringUtil.getBlocks(text);
        blocks.forEach(block=>{
            const lines = StringUtil.getLines(block);
            if(/generator|datasource/.test(lines[0])){
                this.immutableBlocks.push(new ImmutableBlock(lines));
            }
            else if(/model/.test(lines[0])){
                this.immutableBlocks.push(new Model(lines));
            }
            else if(/enum/.test(lines[0])){
                this.immutableBlocks.push(new Enum(lines));
            }
        });
    }
    toString(): string{
        return `${this.immutableBlocks.join('\n')}${'\n'}${this.models.join('\n')}${'\n'}${this.enums.join('\n')}`;
    }
}