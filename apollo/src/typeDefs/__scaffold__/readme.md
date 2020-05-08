The __scaffold__ directory and its contents serve as a template for typeDefs.

Generally, each typeDef parent folder represents a separate concern of the definitions. These correspond to custom types and fields present in prisma's datamodel.

TypeDefs are divided by their type (query, mutation, etc.). Custom types are located inside of types.js.

Index.js imports each used type (unused imports can be commented out and later removed). Some definition files will contain multiple definitions, in which case their variable assignment name is also plural. This needs to be reflected both in the specific typeDef and where imported in index.js.
