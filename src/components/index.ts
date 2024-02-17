import { Page } from "./page";
import * as fs from 'fs';

let page  = new Page(fs.readFileSync("src/utils/schema.prisma", "utf8"));
// const page = `model Tenant {
//     id Int @id @default(autoincrement()) @map("id")

//     users Users[]

//     @@map("tenant")
//     @@schema("public")
// }`;
console.log(page.toString());