# Apollo and Prisma in Docker.
Apollo Server and Prisma 1.34 in Docker

This is a boilerplate and scaffolding repository for an Apollo Server, Prisma stack in a Docker container.

# Getting Started

- Clone this repository.
- Supply specified ENVs inside of `/configuration/` named either `development.env` or `test.env` depending on service and stage.
- `package.json` in the root project directory contains various scripts (described in detail below), to build a new Docker container and launch the service within the new container, run `npm run dev:docker:build`.
- Apollo Service is now accessible at `localhost:5502/`
- From `prisma` directory, run `prisma deploy -e {target_env}` where `{target_env}` is the location of the ENV file.
- User can now interact with mutations and queries for User type.

## Additional Scripts

This package attempts to be flexible in the ways the Apollo service can be run. For testing, running the test scripts outside of Docker might be desirable. Additionally, if quick changes are made to Apollo's `package.json` file, the _entire_ Docker Apollo service will must be rebuilt to reflect those changes. Following are descriptions of what each script in `/package.json` accomplishes.
- `beforeAll` will stop all currently-running Docker services associated with the project. This script is utilized by other scripts to ensure Docker containers are running with the correct environment.
- `env:dev` and `env:test` utilize the python script in `/utils` to load a primary .env file in the root project directory to inform Prisma and Docker. This script is is called by other npm scripts and won't need to be directly called by the user.
- `{stage}:docker:build` where `{stage}` is `test` or `dev` will execute the env-loading script followed by `docker-compose up --build`.
- `{stage}:{container}` where `{stage}` is `test` or `dev` will load respective ENV and, where `{container}` is `docker` will launch _every_ service (Apollo, Prisma, Postgres) inside of the Docker container. Where `{container}` is `local`, _only_ Prisma and Postgres will run in the container -- the Apollo service will run in a NodeJS instance in the terminal. Currently this is most useful for testing, as Docker's terminal formats the Jest test feedback in ways less readable than the standard terminal presentation.

## Environment Variables

<details>
  <summary>Prisma</summary>

  * `PRISMA_ENDPOINT` | Specifies the full Prisma endpoint to which Prisma CLI can execute deploy commands. 
  * `PRISMA_URL` | Component of following four ENV variables. Used by `docker-compose` to specify Prisma's endpoint within Docker container.
  * `PRISMA_PORT`
  * `PRISMA_SERVICE_NAME`
  * `PRISMA_STAGE`
  * `PRISMA_SECRET` | Used to authenticate requests to Prisma Client
  * `PRISMA_MANAGEMENT_API_SECRET` | Optional, but should also be excluded from Docker and Prisma configurations. This ENV provides a secret for Prisma's Management API.
</details>

<details> 
  <summary>Postgres</summary> 

  * `PG_USER` | Specifies the username of the Postgres database.
  * `PG_PASSWORD` | Specifies the password for the Postgres database.
</details>
<details> 
  <summary>Apollo Server</summary>

  * `NPM_COMMAND` | Provides the command that Docker runs on Apollo service in `docker-compose`.
  * `JWT_SECRET` | Secret used for generating and evaluating Authorization tokens.
  * `APOLLO_PORT` | Specifies the port at which the Apollo Server listens.
  * `APOLLO_TEST_PORT` | Specifies the port at which the Apollo Server listens during testing scripts.
</details>



### Docker, Prisma, and Apollo Server


To achieve connectivity between Apollo Server and Prisma inside the same Docker container, Apollo must know that the endpoint is not found at `http://localhost` but `http://prisma`. For this reason, there are five ENVs relevant to Prisma's endpoint. Four are used by Docker and one is used by Prisma CLI. `PRISMA_URL`, `PRISMA_PORT`, `PRISMA_SERVICE_NAME`, and `PRISMA_STAGE` are used by `docker-compose.yml` to piece together a full, relevant *local*, URL that Apollo can use to communicate with its sibling service in the Docker container.

The separation of ENVs is to allow the execution of `prisma deploy` without having to update ENV files each time from `localhost` to `prisma`.

## Loading ENV Files

docker-compose assumes the existence of a `.env` file at the root project directory. Testing and development scenarios use different envinronment variables. For example, testing and development will each have their own stage on the Prisma service. Separate ENV files can be stored in the `/configuration` directory. Inside `/utils` is a Python script which will take a specified ENV file and create a new `.env` file in the root directory. The NPM scripts described above incorporate the ENV loading script thus running this script directly is generally unneccesary. To use this script, take the following steps:
  1. Open a Terminal window and cd to `/utils`
  2. Execute Python script using `python3 env_script.py [source_env_file]`
     1. The file directory is relative to the script, so the command to write development env files to the root directory would be `python3 env_script.py ../configuration/development.env`
     2. If an env file is _already_ located at the root directory, the script will delete it and write a new one.



## Datamodel

Prisma's datamodel specifies a User table in the database. This is structured so.

```
  User {
	id: ID! @id
	email: String! @unique
	password: String!
}
```


## Operations
GraphQL operations can be made at endpoint `localhost:5502` using a GraphQL Client or GraphQL Playground. There are a number of supported operations.

#### Queries
* `info` and `test` return strings and are useful to test a connection to the server.

#### Mutations
* `register` anticipates an object, `input`, with *required* fields `email` and `password`. Where successful, information for that newly user created and Authentication `token` can be returned. Where unsuccessful, an error is passed to the client.
* `login` anticipates an object, `input`, with *required* fields `email` and `password`. Where successful, information for that user and a new `token` can be returned.
* `updateUser` requires a valid token in the request HTTP header and throws an authentication error otherwise. An object, `input`, with fields `email` _and/or_ `password` which contain a new email or password. Where successful, the _new_ information for that user is returned by the server. UserInputErrors are returned to the client in the case where an email is already in use.
* `deleteUser` requires a valid token in the request  HTTP header and throws an authentication error otherwise. Where successful, the server removes that user and returns the user information back to the client.

## Structure

```
├── apollo
│   ├── schema
│   └── src
│       ├── __tests__
│       │   ├── config
│       │   ├── queries
│       │   ├── user
│       │   └── utils
│       ├── auth
│       ├── context
│       ├── generated
│       │   └── prisma-client
│       ├── plugins
│       │   └── apolloLogger
│       ├── resolvers
│       │   ├── auth
│       │   ├── general
│       │   └── user
│       └── typeDefs
│           ├── auth
│           └── user
├── configuration
├── prisma
└── utils
```

#### Apollo 
Apollo Server resides in the /apollo directory.
##### Sub-Directories
  - `src` contains the apollo server app
    - `/__tests__` contains configuration, helper functions (utils), and folders for each test suite.
    - `/auth` contains helper functions for authenticating users.
    - `/context` contains function which builds context. If context-level authentication is desired, it can be implemented here.
    - `/generated` contains the generated Prisma Client
    - `/plugins` contains any custom plugin used by Apollo Server, like apolloLogger.
    - `/resolvers` structure is currently a work in progress and is structured like `typeDefs`. Each subfolder represents a concern containing query and mutation resolvers.
    - `/typeDefs` contains GraphQL type definitions that Apollo Server can interpret. Each type is represented in a sub-folder which contains input, type, query, and mutation definitions as well as an index to import each folder's definitions and export as default.

#### Prisma
Prisma configuration and datamodel resides in the /prisma directory.

#### Others
ENV files can be stored in `/configuration`. The script to write ENV files to root .env is located in `/utils`
