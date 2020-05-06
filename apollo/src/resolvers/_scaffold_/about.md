## About Resolver Scaffolding

The structure of the resolvers directory is meant to mirror that of the `typeDefs` directory. The hope is that the symmetry between the two functions will lend itself towards easier development.

The `_scaffold_` directory provides an example of the structure of each subtype of resolver.

The structure is as follows:

```
├──__scaffold__
│   ├──index.js
│   ├──mutation.js
│   ├──query.js
├──auth
│   ├──index.js
│   ├──query.js
│   ├──mutation.js
├──index.js
├──mutation.js
├──query.js
└──user
    ├──index.js
    ├──query.js
    ├──mutation.js
```
