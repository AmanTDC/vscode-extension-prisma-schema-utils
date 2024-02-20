import { StringUtil } from "../utils/string";
import { Block, DataSource, Enum, ImmutableBlock, Model } from "./block";

export class Page {
    public immutableBlocks: ImmutableBlock[] = [];
    public models: Model[] = [];
    public enums: Enum[] = [];
    public renameModelsFromSchemas = [];
    public datasource: DataSource = new DataSource([]);
    public dynamicMapping = {};
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
                const model = new Model(lines, this.datasource?.renameModelsFromSchemas);
                model.addToDict(this.dynamicMapping, model.name, model.schemaName, model.mappingName);
                this.models.push(model);
            }
            else if(/enum/.test(lines[0])){
                const enum_ = new Enum(lines , this.datasource?.renameModelsFromSchemas)
                enum_.addToDict(this.dynamicMapping, enum_.name, enum_.schemaName, enum_.mappingName);
                this.enums.push(enum_);
            }
        });
    }
    toString(): string{
        return `${this.datasource}${this.immutableBlocks.join('\n')}${'\n'}${this.models.map(m=>m.toCamelCase(this.dynamicMapping,this.datasource.renameModelsFromSchemas)).join('\n')}${'\n'}${this.enums.map(m=>m.toCamelCase(this.dynamicMapping,this.datasource.renameModelsFromSchemas)).join('\n')}`;
    }
}