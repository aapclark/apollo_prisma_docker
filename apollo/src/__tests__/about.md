About Testing

The testing suite is designed to test Apollo resolvers and Prisma functions. This will enable more thoughtful and effective refactoring of current resolvers according to specified test expectations. The test expecations will rely on the new Prisma datamodel created in the unification of QHub services.


The folder and file structure of testing will follow the structure of typeDefs in `apollo/src/typeDefs`. For example, tests for authorization will be contained in `__tests__/auth`. A generic `__scaffolding__` folder with boilerplate code for quickly implementing code is included.


## Testing Checklist
<details>
  <summary>Setup</summary>


</details>
<details>
  <summary>Template</summary>

  - [ ] test 1 intent
  - [ ] test2 intent
  - [ ] test3 intent

</details>



## Notes
This is a space for uncollected thoughts during the test process.


Process, First Draft
1 - load development env using `env_script.py`
2 - `docker-compose up`
3 - Deploy test stage to Prisma service
3.a - cd to `prisma` and execute `prisma deploy -e ../configuration/test.env`
3.b - Exit Docker processes.
4 - load testing env using `env_script.py` and
5 - `docker-compose up`, which will engage the apollo service with the test script
