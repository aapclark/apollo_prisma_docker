# Apollo and Prisma in Docker.
Apollo Server and Prisma 1.34 in Docker

This is a boilerplate and scaffolding repository for an Apollo Server, Prisma stack in a Docker container.

# Getting Started

To run the containerized services, complete the following steps:
- Clone this repo
- Load listed Environment Variables using script described below.
- Run `docker-compose up --build`
- From `/prisma` directory, run `prisma deploy`
- Apollo Server can be accessed at `localhost:5502`. See below for available operations against the server.


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

  * `JWT_SECRET` | Secret used for generating and evaluating Authorization tokens.
  * `APOLLO_PORT` | Specifies the port at which the Apollo Server listens.
  * `APOLLO_TEST_PORT` | Specifies the port at which the Apollo Server listens during testing scripts.
</details>


### Docker, Prisma, and Apollo Server


To achieve connectivity between Apollo Server and Prisma inside the same Docker container, Apollo must know that the endpoint is not found at `http://localhost` but `http://prisma`. For this reason, there are five ENVs relevant to Prisma's endpoint. Four are used by Docker and one is used by Prisma CLI. `PRISMA_URL`, `PRISMA_PORT`, `PRISMA_SERVICE_NAME`, and `PRISMA_STAGE` are used by `docker-compose.yml` to piece together a full, relevant *local*, URL that Apollo can use to communicate with its sibling service in the Docker container.

The separation of ENVs is to allow the execution of `prisma deploy` without having to update ENV files each time from `localhost` to `prisma`.

## Loading ENV Files

docker-compose assumes the existence of a `.env` file at the root project directory. Testing and development scenarios use different envinronment variables. For example, testing and development will each have their own stage on the Prisma service. Separate ENV files can be stored in the `/configuration` directory. Inside `/utils` is a Python script which will take a specified ENV file and create a new `.env` file in the root directory. To use this script, take the following steps:
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


## Structure

```
├── apollo
│   ├── schema
│   └── src
│       ├── __tests__
│       │   ├── config
│       │   ├── user
│       │   └── utils
│       ├── auth
│       ├── context
│       ├── generated
│       │   └── prisma-client
│       ├── plugins
│       │   └── apolloLogger
│       ├── resolvers
│       │   └── mutation
│       └── typeDefs
│           ├── __scaffold__
│           ├── auth
│           └── user
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
    - `/resolvers` structure is currently a work in progress and will be updated with a structure similar to `typeDefs`
    - `/typeDefs` contains GraphQL type definitions that Apollo Server can interpret. Each type is represented in a sub-folder which contains input, type, query, and mutation definitions as well as an index to import each folder's definitions and export as default.

#### Prisma
Prisma configuration and datamodel resides in the /prisma directory.

#### Others
ENV files can be stored in `/configuration`. The script to write ENV files to root .env is located in `/utils`
