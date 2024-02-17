import { StringUtil } from "../utils/string";
import { Block, DataSource, Enum, ImmutableBlock, Model } from "./block";

export class Page {
    public immutableBlocks: ImmutableBlock[] = [];
    public models: Model[] = [];
    public enums: Enum[] = [];
    public renameModelsFromSchemas = [];
    public datasource: DataSource = new DataSource([]);
    constructor(public text: string) {
        const blocks = StringUtil.getBlocks(text);
        blocks.forEach(block=>{
            const lines = StringUtil.getLines(block);
            if(/datasource/.test(lines[0])){
                this.datasource = new DataSource(lines);
            }
            else if(/generator/.test(lines[0])){
                this.immutableBlocks.push(new ImmutableBlock(lines));
            }
            else if(/model/.test(lines[0])){
                this.immutableBlocks.push(new Model(lines, this.datasource?.renameModelsFromSchemas));
            }
            else if(/enum/.test(lines[0])){
                this.immutableBlocks.push(new Enum(lines , this.datasource?.renameModelsFromSchemas));
            }
        });
    }
    toString(): string{
        return `${this.datasource}${this.immutableBlocks.join('\n')}${'\n'}${this.models.join('\n')}${'\n'}${this.enums.join('\n')}`;
    }
}