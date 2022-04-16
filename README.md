

# Nx Monorepo
![image](https://miro.medium.com/max/1400/1*czYEm0sqVhiH-kOiltbbxA.png)

Recently, we started a new project at work. Actually two projects. We needed an application where people could sign in and see information about their account, and another one where they could search for a doctor or facility where they could receive care. The wrinkle is that the search functionality needed to be available inside the member portal application, and be available as a stand-alone application. 

Because of that, we decided to build the two applications inside a monorepo, where they could share all the code they needed. It allowed us to write the code one time, and use it in multiple places. There's more than one way to do this, including packaging up the code and pushing it to NPM or a private registry, but in my opinion the monorepo is the simplest way to share the code. To learn more about Nx, check out their site, nx.dev.

## Running
To running this project locally:
### Client
```sh
nx serve products
```
### Server
```sh
nx serve products-backend
```

## Issues
- docker can't running, solutions: downgrade version
- [https://github.com/nrwl/nx/issues/5605](https://github.com/nrwl/nx/issues/5605), solutions: create blank main.tsx
- Expected signal to be an instanceof AbortSignal SSR [https://github.com/reduxjs/redux-toolkit/issues/1240](https://github.com/reduxjs/redux-toolkit/issues/1240)
- bind: address already in use golang postgres
- backend issues: missed fields `product_items`, `product_variant_groups` -> after add product (not yet)


## Concerns
Redux Toolkit was created to address three major concerns:
1. "Configuring a Redux store is too complicated" 
2. "I have to add a lot of packages to get Redux to do anything useful"
3. "Redux requires too much boilerplate code"
4. Caching: https://redux-toolkit.js.org/rtk-query/usage/cache-behavior
