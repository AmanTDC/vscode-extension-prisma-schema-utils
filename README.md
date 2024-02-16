
## Features

Following are features that have been planned for this extension:

1. Map the schema from snake case to camel case


## Need

When we pull the schema from database using <code> prisma db pull </code> it is pulled as it is from the database. 

But if code is written in <b>camelCase</b> then the mapping causes issue.

One can manually write the mapping using <code>@map</code> for fields and <code>@@map</code> but it is cumbersome process and if you pull the db again you need to repeat entire process. This extension solves this issue. 
