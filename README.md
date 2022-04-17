

# Nx Monorepo
![image](https://miro.medium.com/max/1400/1*czYEm0sqVhiH-kOiltbbxA.png)

A monorepo is a single git repository that holds the source code for multiple applications and libraries, along with the tooling for them.

Nx is a framework that allows you to architect, test, and build your project at any scale with the most popular modern Front-end frameworks like React and Angular, and Back-end ones like NestJs or Express. To make this possible, Nx comes shipped with a large toolset that simplifies your Monorepo management. If you are unfamiliar with Monorepo, it is basically a version-controlled code repository that holds many projects and libraries.

> If you are familiar with Lerna or Yarn workspaces, check out this guide (with a quick video) showing how to add Nx to a Lerna/Yarn workspace, what the difference is, when to use both and when to use just Nx.

What are the benefits of a monorepo?

- **Shared code and visibility** - Keeps your code DRY across your entire organization. Reuse validation code, UI components, and types across the codebase. Reuse code between the backend, the frontend, and utility libraries.
- **Atomic changes** - Change a server API and modify the downstream applications that consume that API in the same commit. You can change a button component in a shared library and the applications that use that component in the same commit. A monorepo saves the pain of trying to coordinate commits across multiple repositories.
- **Developer mobility** - Get a consistent way of building and testing applications written using different tools and technologies. Developers can confidently contribute to other teams’ applications and verify that their changes are safe.
- **Single set of dependencies** - Use a single version of all third-party dependencies, reducing inconsistencies between applications. Less actively developed applications are still kept up-to-date with the latest version of a framework, library, or build tool.


## Running
To running this project locally:
### Client
```sh
nx serve products
```
### Server
```sh
# For first (build binary)
cd apps/products-backend && make dev

# And then 
nx serve products-backend
```

## Issues
- docker can't running, solutions: downgrade version
- [https://github.com/nrwl/nx/issues/5605](https://github.com/nrwl/nx/issues/5605), solutions: create blank main.tsx
- Expected signal to be an instanceof AbortSignal SSR [https://github.com/reduxjs/redux-toolkit/issues/1240](https://github.com/reduxjs/redux-toolkit/issues/1240)
- bind: address already in use golang postgres
- backend issues: missed fields `product_items`, `product_variant_groups` -> after add product (not yet)
- backend issues: `http: superfluous response.WriteHeader`, PATCH request (not yet)


## Concerns
State (in the broadest sense) is the complex of all of the values held by the application as properties or variables at any given time, and the application is conceived of as acting by executing methods/functions that change the current state to another state.

State can be a messy part of application development - especially when there are a lot of user interactions to manage. While the DOM can certainly get you quite a ways if you have a particularly complex application it may get messy trying to keep everything straight. These all are’s matter, so here’s i Implementing crud feature in Next.js App with RTK Query, SSR. Hopefully helpful

Redux Toolkit was created to address three major concerns:
1. "Configuring a Redux store is too complicated" 
2. "I have to add a lot of packages to get Redux to do anything useful"
3. "Redux requires too much boilerplate code"
4. Caching: https://redux-toolkit.js.org/rtk-query/usage/cache-behavior
