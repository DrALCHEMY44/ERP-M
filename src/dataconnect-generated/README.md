# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
<<<<<<< HEAD
  - [*ListMovies*](#listmovies)
  - [*ListUsers*](#listusers)
  - [*ListUserReviews*](#listuserreviews)
  - [*GetMovieById*](#getmoviebyid)
  - [*SearchMovie*](#searchmovie)
- [**Mutations**](#mutations)
  - [*CreateMovie*](#createmovie)
  - [*UpsertUser*](#upsertuser)
  - [*AddReview*](#addreview)
  - [*DeleteReview*](#deletereview)
=======
  - [*ListTenants*](#listtenants)
  - [*ListUsers*](#listusers)
  - [*ListBusinesses*](#listbusinesses)
  - [*ListProducts*](#listproducts)
  - [*ListTransactions*](#listtransactions)
  - [*ListTasks*](#listtasks)
  - [*ListEmployees*](#listemployees)
  - [*ListCustomers*](#listcustomers)
  - [*ListSuppliers*](#listsuppliers)
  - [*ListDocuments*](#listdocuments)
- [**Mutations**](#mutations)
  - [*CreateTenant*](#createtenant)
  - [*UpdateTenant*](#updatetenant)
  - [*DeleteTenant*](#deletetenant)
  - [*CreateUser*](#createuser)
  - [*UpdateUser*](#updateuser)
  - [*DeleteUser*](#deleteuser)
  - [*CreateBusiness*](#createbusiness)
  - [*UpdateBusiness*](#updatebusiness)
  - [*DeleteBusiness*](#deletebusiness)
  - [*CreateProduct*](#createproduct)
  - [*UpdateProduct*](#updateproduct)
  - [*DeleteProduct*](#deleteproduct)
  - [*CreateTransaction*](#createtransaction)
  - [*UpdateTransaction*](#updatetransaction)
  - [*DeleteTransaction*](#deletetransaction)
  - [*CreateTask*](#createtask)
  - [*UpdateTask*](#updatetask)
  - [*DeleteTask*](#deletetask)
  - [*CreateEmployee*](#createemployee)
  - [*UpdateEmployee*](#updateemployee)
  - [*DeleteEmployee*](#deleteemployee)
  - [*CreateCustomer*](#createcustomer)
  - [*UpdateCustomer*](#updatecustomer)
  - [*DeleteCustomer*](#deletecustomer)
  - [*CreateSupplier*](#createsupplier)
  - [*UpdateSupplier*](#updatesupplier)
  - [*DeleteSupplier*](#deletesupplier)
  - [*CreateDocument*](#createdocument)
  - [*UpdateDocument*](#updatedocument)
  - [*DeleteDocument*](#deletedocument)
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

<<<<<<< HEAD
## ListMovies
You can execute the `ListMovies` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMovies(): QueryPromise<ListMoviesData, undefined>;

interface ListMoviesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMoviesData, undefined>;
}
export const listMoviesRef: ListMoviesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMovies(dc: DataConnect): QueryPromise<ListMoviesData, undefined>;

interface ListMoviesRef {
  ...
  (dc: DataConnect): QueryRef<ListMoviesData, undefined>;
}
export const listMoviesRef: ListMoviesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMoviesRef:
```typescript
const name = listMoviesRef.operationName;
=======
## ListTenants
You can execute the `ListTenants` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listTenants(): QueryPromise<ListTenantsData, undefined>;

interface ListTenantsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTenantsData, undefined>;
}
export const listTenantsRef: ListTenantsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTenants(dc: DataConnect): QueryPromise<ListTenantsData, undefined>;

interface ListTenantsRef {
  ...
  (dc: DataConnect): QueryRef<ListTenantsData, undefined>;
}
export const listTenantsRef: ListTenantsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTenantsRef:
```typescript
const name = listTenantsRef.operationName;
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8
console.log(name);
```

### Variables
<<<<<<< HEAD
The `ListMovies` query has no variables.
### Return Type
Recall that executing the `ListMovies` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMoviesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMoviesData {
  movies: ({
    id: UUIDString;
    title: string;
    imageUrl: string;
    genre?: string | null;
  } & Movie_Key)[];
}
```
### Using `ListMovies`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMovies } from '@dataconnect/generated';


// Call the `listMovies()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMovies();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMovies(dataConnect);

console.log(data.movies);

// Or, you can use the `Promise` API.
listMovies().then((response) => {
  const data = response.data;
  console.log(data.movies);
});
```

### Using `ListMovies`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMoviesRef } from '@dataconnect/generated';


// Call the `listMoviesRef()` function to get a reference to the query.
const ref = listMoviesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMoviesRef(dataConnect);
=======
The `ListTenants` query has no variables.
### Return Type
Recall that executing the `ListTenants` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTenantsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListTenantsData {
  tenants: ({
    id: UUIDString;
    name: string;
    businessSector: string;
  } & Tenant_Key)[];
}
```
### Using `ListTenants`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTenants } from '@dataconnect/generated';


// Call the `listTenants()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTenants();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTenants(dataConnect);

console.log(data.tenants);

// Or, you can use the `Promise` API.
listTenants().then((response) => {
  const data = response.data;
  console.log(data.tenants);
});
```

### Using `ListTenants`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTenantsRef } from '@dataconnect/generated';


// Call the `listTenantsRef()` function to get a reference to the query.
const ref = listTenantsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTenantsRef(dataConnect);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

<<<<<<< HEAD
console.log(data.movies);
=======
console.log(data.tenants);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
<<<<<<< HEAD
  console.log(data.movies);
=======
  console.log(data.tenants);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8
});
```

## ListUsers
You can execute the `ListUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
<<<<<<< HEAD
listUsers(): QueryPromise<ListUsersData, undefined>;
=======
listUsers(vars: ListUsersVariables): QueryPromise<ListUsersData, ListUsersVariables>;
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

interface ListUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
<<<<<<< HEAD
  (): QueryRef<ListUsersData, undefined>;
=======
  (vars: ListUsersVariables): QueryRef<ListUsersData, ListUsersVariables>;
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8
}
export const listUsersRef: ListUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
<<<<<<< HEAD
listUsers(dc: DataConnect): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
=======
listUsers(dc: DataConnect, vars: ListUsersVariables): QueryPromise<ListUsersData, ListUsersVariables>;

interface ListUsersRef {
  ...
  (dc: DataConnect, vars: ListUsersVariables): QueryRef<ListUsersData, ListUsersVariables>;
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8
}
export const listUsersRef: ListUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUsersRef:
```typescript
const name = listUsersRef.operationName;
console.log(name);
```

### Variables
<<<<<<< HEAD
The `ListUsers` query has no variables.
=======
The `ListUsers` query requires an argument of type `ListUsersVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListUsersVariables {
  tenantId: UUIDString;
}
```
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8
### Return Type
Recall that executing the `ListUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUsersData {
  users: ({
<<<<<<< HEAD
    id: string;
    username: string;
=======
    id: UUIDString;
    email: string;
    role: string;
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8
  } & User_Key)[];
}
```
### Using `ListUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
<<<<<<< HEAD
import { connectorConfig, listUsers } from '@dataconnect/generated';


// Call the `listUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUsers(dataConnect);
=======
import { connectorConfig, listUsers, ListUsersVariables } from '@dataconnect/generated';

// The `ListUsers` query requires an argument of type `ListUsersVariables`:
const listUsersVars: ListUsersVariables = {
  tenantId: ..., 
};

// Call the `listUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUsers(listUsersVars);
// Variables can be defined inline as well.
const { data } = await listUsers({ tenantId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUsers(dataConnect, listUsersVars);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

console.log(data.users);

// Or, you can use the `Promise` API.
<<<<<<< HEAD
listUsers().then((response) => {
=======
listUsers(listUsersVars).then((response) => {
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
<<<<<<< HEAD
import { connectorConfig, listUsersRef } from '@dataconnect/generated';


// Call the `listUsersRef()` function to get a reference to the query.
const ref = listUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUsersRef(dataConnect);
=======
import { connectorConfig, listUsersRef, ListUsersVariables } from '@dataconnect/generated';

// The `ListUsers` query requires an argument of type `ListUsersVariables`:
const listUsersVars: ListUsersVariables = {
  tenantId: ..., 
};

// Call the `listUsersRef()` function to get a reference to the query.
const ref = listUsersRef(listUsersVars);
// Variables can be defined inline as well.
const ref = listUsersRef({ tenantId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUsersRef(dataConnect, listUsersVars);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

<<<<<<< HEAD
## ListUserReviews
You can execute the `ListUserReviews` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUserReviews(): QueryPromise<ListUserReviewsData, undefined>;

interface ListUserReviewsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUserReviewsData, undefined>;
}
export const listUserReviewsRef: ListUserReviewsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUserReviews(dc: DataConnect): QueryPromise<ListUserReviewsData, undefined>;

interface ListUserReviewsRef {
  ...
  (dc: DataConnect): QueryRef<ListUserReviewsData, undefined>;
}
export const listUserReviewsRef: ListUserReviewsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUserReviewsRef:
```typescript
const name = listUserReviewsRef.operationName;
=======
## ListBusinesses
You can execute the `ListBusinesses` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listBusinesses(vars: ListBusinessesVariables): QueryPromise<ListBusinessesData, ListBusinessesVariables>;

interface ListBusinessesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListBusinessesVariables): QueryRef<ListBusinessesData, ListBusinessesVariables>;
}
export const listBusinessesRef: ListBusinessesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listBusinesses(dc: DataConnect, vars: ListBusinessesVariables): QueryPromise<ListBusinessesData, ListBusinessesVariables>;

interface ListBusinessesRef {
  ...
  (dc: DataConnect, vars: ListBusinessesVariables): QueryRef<ListBusinessesData, ListBusinessesVariables>;
}
export const listBusinessesRef: ListBusinessesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listBusinessesRef:
```typescript
const name = listBusinessesRef.operationName;
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8
console.log(name);
```

### Variables
<<<<<<< HEAD
The `ListUserReviews` query has no variables.
### Return Type
Recall that executing the `ListUserReviews` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUserReviewsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUserReviewsData {
  user?: {
    id: string;
    username: string;
    reviews: ({
      rating?: number | null;
      reviewDate: DateString;
      reviewText?: string | null;
      movie: {
        id: UUIDString;
        title: string;
      } & Movie_Key;
    })[];
  } & User_Key;
}
```
### Using `ListUserReviews`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUserReviews } from '@dataconnect/generated';


// Call the `listUserReviews()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUserReviews();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUserReviews(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
listUserReviews().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `ListUserReviews`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUserReviewsRef } from '@dataconnect/generated';


// Call the `listUserReviewsRef()` function to get a reference to the query.
const ref = listUserReviewsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUserReviewsRef(dataConnect);
=======
The `ListBusinesses` query requires an argument of type `ListBusinessesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListBusinessesVariables {
  tenantId: UUIDString;
}
```
### Return Type
Recall that executing the `ListBusinesses` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListBusinessesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListBusinessesData {
  businesses: ({
    id: UUIDString;
    name: string;
    location: string;
  } & Business_Key)[];
}
```
### Using `ListBusinesses`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listBusinesses, ListBusinessesVariables } from '@dataconnect/generated';

// The `ListBusinesses` query requires an argument of type `ListBusinessesVariables`:
const listBusinessesVars: ListBusinessesVariables = {
  tenantId: ..., 
};

// Call the `listBusinesses()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listBusinesses(listBusinessesVars);
// Variables can be defined inline as well.
const { data } = await listBusinesses({ tenantId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listBusinesses(dataConnect, listBusinessesVars);

console.log(data.businesses);

// Or, you can use the `Promise` API.
listBusinesses(listBusinessesVars).then((response) => {
  const data = response.data;
  console.log(data.businesses);
});
```

### Using `ListBusinesses`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listBusinessesRef, ListBusinessesVariables } from '@dataconnect/generated';

// The `ListBusinesses` query requires an argument of type `ListBusinessesVariables`:
const listBusinessesVars: ListBusinessesVariables = {
  tenantId: ..., 
};

// Call the `listBusinessesRef()` function to get a reference to the query.
const ref = listBusinessesRef(listBusinessesVars);
// Variables can be defined inline as well.
const ref = listBusinessesRef({ tenantId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listBusinessesRef(dataConnect, listBusinessesVars);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

<<<<<<< HEAD
console.log(data.user);
=======
console.log(data.businesses);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
<<<<<<< HEAD
  console.log(data.user);
});
```

## GetMovieById
You can execute the `GetMovieById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMovieById(vars: GetMovieByIdVariables): QueryPromise<GetMovieByIdData, GetMovieByIdVariables>;

interface GetMovieByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMovieByIdVariables): QueryRef<GetMovieByIdData, GetMovieByIdVariables>;
}
export const getMovieByIdRef: GetMovieByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMovieById(dc: DataConnect, vars: GetMovieByIdVariables): QueryPromise<GetMovieByIdData, GetMovieByIdVariables>;

interface GetMovieByIdRef {
  ...
  (dc: DataConnect, vars: GetMovieByIdVariables): QueryRef<GetMovieByIdData, GetMovieByIdVariables>;
}
export const getMovieByIdRef: GetMovieByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMovieByIdRef:
```typescript
const name = getMovieByIdRef.operationName;
=======
  console.log(data.businesses);
});
```

## ListProducts
You can execute the `ListProducts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listProducts(vars: ListProductsVariables): QueryPromise<ListProductsData, ListProductsVariables>;

interface ListProductsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListProductsVariables): QueryRef<ListProductsData, ListProductsVariables>;
}
export const listProductsRef: ListProductsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listProducts(dc: DataConnect, vars: ListProductsVariables): QueryPromise<ListProductsData, ListProductsVariables>;

interface ListProductsRef {
  ...
  (dc: DataConnect, vars: ListProductsVariables): QueryRef<ListProductsData, ListProductsVariables>;
}
export const listProductsRef: ListProductsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listProductsRef:
```typescript
const name = listProductsRef.operationName;
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8
console.log(name);
```

### Variables
<<<<<<< HEAD
The `GetMovieById` query requires an argument of type `GetMovieByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMovieByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetMovieById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMovieByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMovieByIdData {
  movie?: {
    id: UUIDString;
    title: string;
    imageUrl: string;
    genre?: string | null;
    metadata?: {
      rating?: number | null;
      releaseYear?: number | null;
      description?: string | null;
    };
      reviews: ({
        reviewText?: string | null;
        reviewDate: DateString;
        rating?: number | null;
        user: {
          id: string;
          username: string;
        } & User_Key;
      })[];
  } & Movie_Key;
}
```
### Using `GetMovieById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMovieById, GetMovieByIdVariables } from '@dataconnect/generated';

// The `GetMovieById` query requires an argument of type `GetMovieByIdVariables`:
const getMovieByIdVars: GetMovieByIdVariables = {
  id: ..., 
};

// Call the `getMovieById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMovieById(getMovieByIdVars);
// Variables can be defined inline as well.
const { data } = await getMovieById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMovieById(dataConnect, getMovieByIdVars);

console.log(data.movie);

// Or, you can use the `Promise` API.
getMovieById(getMovieByIdVars).then((response) => {
  const data = response.data;
  console.log(data.movie);
});
```

### Using `GetMovieById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMovieByIdRef, GetMovieByIdVariables } from '@dataconnect/generated';

// The `GetMovieById` query requires an argument of type `GetMovieByIdVariables`:
const getMovieByIdVars: GetMovieByIdVariables = {
  id: ..., 
};

// Call the `getMovieByIdRef()` function to get a reference to the query.
const ref = getMovieByIdRef(getMovieByIdVars);
// Variables can be defined inline as well.
const ref = getMovieByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMovieByIdRef(dataConnect, getMovieByIdVars);
=======
The `ListProducts` query requires an argument of type `ListProductsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListProductsVariables {
  businessId: UUIDString;
}
```
### Return Type
Recall that executing the `ListProducts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListProductsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListProductsData {
  products: ({
    id: UUIDString;
    name: string;
    sellingPrice: number;
  } & Product_Key)[];
}
```
### Using `ListProducts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listProducts, ListProductsVariables } from '@dataconnect/generated';

// The `ListProducts` query requires an argument of type `ListProductsVariables`:
const listProductsVars: ListProductsVariables = {
  businessId: ..., 
};

// Call the `listProducts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listProducts(listProductsVars);
// Variables can be defined inline as well.
const { data } = await listProducts({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listProducts(dataConnect, listProductsVars);

console.log(data.products);

// Or, you can use the `Promise` API.
listProducts(listProductsVars).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

### Using `ListProducts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listProductsRef, ListProductsVariables } from '@dataconnect/generated';

// The `ListProducts` query requires an argument of type `ListProductsVariables`:
const listProductsVars: ListProductsVariables = {
  businessId: ..., 
};

// Call the `listProductsRef()` function to get a reference to the query.
const ref = listProductsRef(listProductsVars);
// Variables can be defined inline as well.
const ref = listProductsRef({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listProductsRef(dataConnect, listProductsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.products);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

## ListTransactions
You can execute the `ListTransactions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listTransactions(vars: ListTransactionsVariables): QueryPromise<ListTransactionsData, ListTransactionsVariables>;

interface ListTransactionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTransactionsVariables): QueryRef<ListTransactionsData, ListTransactionsVariables>;
}
export const listTransactionsRef: ListTransactionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTransactions(dc: DataConnect, vars: ListTransactionsVariables): QueryPromise<ListTransactionsData, ListTransactionsVariables>;

interface ListTransactionsRef {
  ...
  (dc: DataConnect, vars: ListTransactionsVariables): QueryRef<ListTransactionsData, ListTransactionsVariables>;
}
export const listTransactionsRef: ListTransactionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTransactionsRef:
```typescript
const name = listTransactionsRef.operationName;
console.log(name);
```

### Variables
The `ListTransactions` query requires an argument of type `ListTransactionsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListTransactionsVariables {
  businessId: UUIDString;
}
```
### Return Type
Recall that executing the `ListTransactions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTransactionsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListTransactionsData {
  transactions: ({
    id: UUIDString;
    type: string;
    amount: number;
  } & Transaction_Key)[];
}
```
### Using `ListTransactions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTransactions, ListTransactionsVariables } from '@dataconnect/generated';

// The `ListTransactions` query requires an argument of type `ListTransactionsVariables`:
const listTransactionsVars: ListTransactionsVariables = {
  businessId: ..., 
};

// Call the `listTransactions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTransactions(listTransactionsVars);
// Variables can be defined inline as well.
const { data } = await listTransactions({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTransactions(dataConnect, listTransactionsVars);

console.log(data.transactions);

// Or, you can use the `Promise` API.
listTransactions(listTransactionsVars).then((response) => {
  const data = response.data;
  console.log(data.transactions);
});
```

### Using `ListTransactions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTransactionsRef, ListTransactionsVariables } from '@dataconnect/generated';

// The `ListTransactions` query requires an argument of type `ListTransactionsVariables`:
const listTransactionsVars: ListTransactionsVariables = {
  businessId: ..., 
};

// Call the `listTransactionsRef()` function to get a reference to the query.
const ref = listTransactionsRef(listTransactionsVars);
// Variables can be defined inline as well.
const ref = listTransactionsRef({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTransactionsRef(dataConnect, listTransactionsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.transactions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.transactions);
});
```

## ListTasks
You can execute the `ListTasks` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listTasks(vars: ListTasksVariables): QueryPromise<ListTasksData, ListTasksVariables>;

interface ListTasksRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTasksVariables): QueryRef<ListTasksData, ListTasksVariables>;
}
export const listTasksRef: ListTasksRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTasks(dc: DataConnect, vars: ListTasksVariables): QueryPromise<ListTasksData, ListTasksVariables>;

interface ListTasksRef {
  ...
  (dc: DataConnect, vars: ListTasksVariables): QueryRef<ListTasksData, ListTasksVariables>;
}
export const listTasksRef: ListTasksRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTasksRef:
```typescript
const name = listTasksRef.operationName;
console.log(name);
```

### Variables
The `ListTasks` query requires an argument of type `ListTasksVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListTasksVariables {
  businessId: UUIDString;
}
```
### Return Type
Recall that executing the `ListTasks` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTasksData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListTasksData {
  tasks: ({
    id: UUIDString;
    title: string;
    status: string;
  } & Task_Key)[];
}
```
### Using `ListTasks`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTasks, ListTasksVariables } from '@dataconnect/generated';

// The `ListTasks` query requires an argument of type `ListTasksVariables`:
const listTasksVars: ListTasksVariables = {
  businessId: ..., 
};

// Call the `listTasks()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTasks(listTasksVars);
// Variables can be defined inline as well.
const { data } = await listTasks({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTasks(dataConnect, listTasksVars);

console.log(data.tasks);

// Or, you can use the `Promise` API.
listTasks(listTasksVars).then((response) => {
  const data = response.data;
  console.log(data.tasks);
});
```

### Using `ListTasks`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTasksRef, ListTasksVariables } from '@dataconnect/generated';

// The `ListTasks` query requires an argument of type `ListTasksVariables`:
const listTasksVars: ListTasksVariables = {
  businessId: ..., 
};

// Call the `listTasksRef()` function to get a reference to the query.
const ref = listTasksRef(listTasksVars);
// Variables can be defined inline as well.
const ref = listTasksRef({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTasksRef(dataConnect, listTasksVars);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

<<<<<<< HEAD
console.log(data.movie);
=======
console.log(data.tasks);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
<<<<<<< HEAD
  console.log(data.movie);
});
```

## SearchMovie
You can execute the `SearchMovie` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
searchMovie(vars?: SearchMovieVariables): QueryPromise<SearchMovieData, SearchMovieVariables>;

interface SearchMovieRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: SearchMovieVariables): QueryRef<SearchMovieData, SearchMovieVariables>;
}
export const searchMovieRef: SearchMovieRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
searchMovie(dc: DataConnect, vars?: SearchMovieVariables): QueryPromise<SearchMovieData, SearchMovieVariables>;

interface SearchMovieRef {
  ...
  (dc: DataConnect, vars?: SearchMovieVariables): QueryRef<SearchMovieData, SearchMovieVariables>;
}
export const searchMovieRef: SearchMovieRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the searchMovieRef:
```typescript
const name = searchMovieRef.operationName;
=======
  console.log(data.tasks);
});
```

## ListEmployees
You can execute the `ListEmployees` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listEmployees(vars: ListEmployeesVariables): QueryPromise<ListEmployeesData, ListEmployeesVariables>;

interface ListEmployeesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListEmployeesVariables): QueryRef<ListEmployeesData, ListEmployeesVariables>;
}
export const listEmployeesRef: ListEmployeesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listEmployees(dc: DataConnect, vars: ListEmployeesVariables): QueryPromise<ListEmployeesData, ListEmployeesVariables>;

interface ListEmployeesRef {
  ...
  (dc: DataConnect, vars: ListEmployeesVariables): QueryRef<ListEmployeesData, ListEmployeesVariables>;
}
export const listEmployeesRef: ListEmployeesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listEmployeesRef:
```typescript
const name = listEmployeesRef.operationName;
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8
console.log(name);
```

### Variables
<<<<<<< HEAD
The `SearchMovie` query has an optional argument of type `SearchMovieVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SearchMovieVariables {
  titleInput?: string | null;
  genre?: string | null;
}
```
### Return Type
Recall that executing the `SearchMovie` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SearchMovieData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SearchMovieData {
  movies: ({
    id: UUIDString;
    title: string;
    genre?: string | null;
    imageUrl: string;
  } & Movie_Key)[];
}
```
### Using `SearchMovie`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, searchMovie, SearchMovieVariables } from '@dataconnect/generated';

// The `SearchMovie` query has an optional argument of type `SearchMovieVariables`:
const searchMovieVars: SearchMovieVariables = {
  titleInput: ..., // optional
  genre: ..., // optional
};

// Call the `searchMovie()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await searchMovie(searchMovieVars);
// Variables can be defined inline as well.
const { data } = await searchMovie({ titleInput: ..., genre: ..., });
// Since all variables are optional for this query, you can omit the `SearchMovieVariables` argument.
const { data } = await searchMovie();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await searchMovie(dataConnect, searchMovieVars);

console.log(data.movies);

// Or, you can use the `Promise` API.
searchMovie(searchMovieVars).then((response) => {
  const data = response.data;
  console.log(data.movies);
});
```

### Using `SearchMovie`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, searchMovieRef, SearchMovieVariables } from '@dataconnect/generated';

// The `SearchMovie` query has an optional argument of type `SearchMovieVariables`:
const searchMovieVars: SearchMovieVariables = {
  titleInput: ..., // optional
  genre: ..., // optional
};

// Call the `searchMovieRef()` function to get a reference to the query.
const ref = searchMovieRef(searchMovieVars);
// Variables can be defined inline as well.
const ref = searchMovieRef({ titleInput: ..., genre: ..., });
// Since all variables are optional for this query, you can omit the `SearchMovieVariables` argument.
const ref = searchMovieRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = searchMovieRef(dataConnect, searchMovieVars);
=======
The `ListEmployees` query requires an argument of type `ListEmployeesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListEmployeesVariables {
  businessId: UUIDString;
}
```
### Return Type
Recall that executing the `ListEmployees` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListEmployeesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListEmployeesData {
  employees: ({
    id: UUIDString;
    fullName: string;
  } & Employee_Key)[];
}
```
### Using `ListEmployees`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listEmployees, ListEmployeesVariables } from '@dataconnect/generated';

// The `ListEmployees` query requires an argument of type `ListEmployeesVariables`:
const listEmployeesVars: ListEmployeesVariables = {
  businessId: ..., 
};

// Call the `listEmployees()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listEmployees(listEmployeesVars);
// Variables can be defined inline as well.
const { data } = await listEmployees({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listEmployees(dataConnect, listEmployeesVars);

console.log(data.employees);

// Or, you can use the `Promise` API.
listEmployees(listEmployeesVars).then((response) => {
  const data = response.data;
  console.log(data.employees);
});
```

### Using `ListEmployees`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listEmployeesRef, ListEmployeesVariables } from '@dataconnect/generated';

// The `ListEmployees` query requires an argument of type `ListEmployeesVariables`:
const listEmployeesVars: ListEmployeesVariables = {
  businessId: ..., 
};

// Call the `listEmployeesRef()` function to get a reference to the query.
const ref = listEmployeesRef(listEmployeesVars);
// Variables can be defined inline as well.
const ref = listEmployeesRef({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listEmployeesRef(dataConnect, listEmployeesVars);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

<<<<<<< HEAD
console.log(data.movies);
=======
console.log(data.employees);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
<<<<<<< HEAD
  console.log(data.movies);
=======
  console.log(data.employees);
});
```

## ListCustomers
You can execute the `ListCustomers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listCustomers(vars: ListCustomersVariables): QueryPromise<ListCustomersData, ListCustomersVariables>;

interface ListCustomersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCustomersVariables): QueryRef<ListCustomersData, ListCustomersVariables>;
}
export const listCustomersRef: ListCustomersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCustomers(dc: DataConnect, vars: ListCustomersVariables): QueryPromise<ListCustomersData, ListCustomersVariables>;

interface ListCustomersRef {
  ...
  (dc: DataConnect, vars: ListCustomersVariables): QueryRef<ListCustomersData, ListCustomersVariables>;
}
export const listCustomersRef: ListCustomersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCustomersRef:
```typescript
const name = listCustomersRef.operationName;
console.log(name);
```

### Variables
The `ListCustomers` query requires an argument of type `ListCustomersVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListCustomersVariables {
  businessId: UUIDString;
}
```
### Return Type
Recall that executing the `ListCustomers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCustomersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCustomersData {
  customers: ({
    id: UUIDString;
    customerName: string;
  } & Customer_Key)[];
}
```
### Using `ListCustomers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCustomers, ListCustomersVariables } from '@dataconnect/generated';

// The `ListCustomers` query requires an argument of type `ListCustomersVariables`:
const listCustomersVars: ListCustomersVariables = {
  businessId: ..., 
};

// Call the `listCustomers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCustomers(listCustomersVars);
// Variables can be defined inline as well.
const { data } = await listCustomers({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCustomers(dataConnect, listCustomersVars);

console.log(data.customers);

// Or, you can use the `Promise` API.
listCustomers(listCustomersVars).then((response) => {
  const data = response.data;
  console.log(data.customers);
});
```

### Using `ListCustomers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCustomersRef, ListCustomersVariables } from '@dataconnect/generated';

// The `ListCustomers` query requires an argument of type `ListCustomersVariables`:
const listCustomersVars: ListCustomersVariables = {
  businessId: ..., 
};

// Call the `listCustomersRef()` function to get a reference to the query.
const ref = listCustomersRef(listCustomersVars);
// Variables can be defined inline as well.
const ref = listCustomersRef({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCustomersRef(dataConnect, listCustomersVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.customers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.customers);
});
```

## ListSuppliers
You can execute the `ListSuppliers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listSuppliers(vars: ListSuppliersVariables): QueryPromise<ListSuppliersData, ListSuppliersVariables>;

interface ListSuppliersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListSuppliersVariables): QueryRef<ListSuppliersData, ListSuppliersVariables>;
}
export const listSuppliersRef: ListSuppliersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listSuppliers(dc: DataConnect, vars: ListSuppliersVariables): QueryPromise<ListSuppliersData, ListSuppliersVariables>;

interface ListSuppliersRef {
  ...
  (dc: DataConnect, vars: ListSuppliersVariables): QueryRef<ListSuppliersData, ListSuppliersVariables>;
}
export const listSuppliersRef: ListSuppliersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listSuppliersRef:
```typescript
const name = listSuppliersRef.operationName;
console.log(name);
```

### Variables
The `ListSuppliers` query requires an argument of type `ListSuppliersVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListSuppliersVariables {
  businessId: UUIDString;
}
```
### Return Type
Recall that executing the `ListSuppliers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListSuppliersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListSuppliersData {
  suppliers: ({
    id: UUIDString;
    supplierName: string;
  } & Supplier_Key)[];
}
```
### Using `ListSuppliers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listSuppliers, ListSuppliersVariables } from '@dataconnect/generated';

// The `ListSuppliers` query requires an argument of type `ListSuppliersVariables`:
const listSuppliersVars: ListSuppliersVariables = {
  businessId: ..., 
};

// Call the `listSuppliers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listSuppliers(listSuppliersVars);
// Variables can be defined inline as well.
const { data } = await listSuppliers({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listSuppliers(dataConnect, listSuppliersVars);

console.log(data.suppliers);

// Or, you can use the `Promise` API.
listSuppliers(listSuppliersVars).then((response) => {
  const data = response.data;
  console.log(data.suppliers);
});
```

### Using `ListSuppliers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listSuppliersRef, ListSuppliersVariables } from '@dataconnect/generated';

// The `ListSuppliers` query requires an argument of type `ListSuppliersVariables`:
const listSuppliersVars: ListSuppliersVariables = {
  businessId: ..., 
};

// Call the `listSuppliersRef()` function to get a reference to the query.
const ref = listSuppliersRef(listSuppliersVars);
// Variables can be defined inline as well.
const ref = listSuppliersRef({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listSuppliersRef(dataConnect, listSuppliersVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.suppliers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.suppliers);
});
```

## ListDocuments
You can execute the `ListDocuments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listDocuments(vars: ListDocumentsVariables): QueryPromise<ListDocumentsData, ListDocumentsVariables>;

interface ListDocumentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListDocumentsVariables): QueryRef<ListDocumentsData, ListDocumentsVariables>;
}
export const listDocumentsRef: ListDocumentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listDocuments(dc: DataConnect, vars: ListDocumentsVariables): QueryPromise<ListDocumentsData, ListDocumentsVariables>;

interface ListDocumentsRef {
  ...
  (dc: DataConnect, vars: ListDocumentsVariables): QueryRef<ListDocumentsData, ListDocumentsVariables>;
}
export const listDocumentsRef: ListDocumentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listDocumentsRef:
```typescript
const name = listDocumentsRef.operationName;
console.log(name);
```

### Variables
The `ListDocuments` query requires an argument of type `ListDocumentsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListDocumentsVariables {
  businessId: UUIDString;
}
```
### Return Type
Recall that executing the `ListDocuments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListDocumentsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListDocumentsData {
  documents: ({
    id: UUIDString;
    title: string;
  } & Document_Key)[];
}
```
### Using `ListDocuments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listDocuments, ListDocumentsVariables } from '@dataconnect/generated';

// The `ListDocuments` query requires an argument of type `ListDocumentsVariables`:
const listDocumentsVars: ListDocumentsVariables = {
  businessId: ..., 
};

// Call the `listDocuments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listDocuments(listDocumentsVars);
// Variables can be defined inline as well.
const { data } = await listDocuments({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listDocuments(dataConnect, listDocumentsVars);

console.log(data.documents);

// Or, you can use the `Promise` API.
listDocuments(listDocumentsVars).then((response) => {
  const data = response.data;
  console.log(data.documents);
});
```

### Using `ListDocuments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listDocumentsRef, ListDocumentsVariables } from '@dataconnect/generated';

// The `ListDocuments` query requires an argument of type `ListDocumentsVariables`:
const listDocumentsVars: ListDocumentsVariables = {
  businessId: ..., 
};

// Call the `listDocumentsRef()` function to get a reference to the query.
const ref = listDocumentsRef(listDocumentsVars);
// Variables can be defined inline as well.
const ref = listDocumentsRef({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listDocumentsRef(dataConnect, listDocumentsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.documents);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.documents);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

<<<<<<< HEAD
## CreateMovie
You can execute the `CreateMovie` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createMovie(vars: CreateMovieVariables): MutationPromise<CreateMovieData, CreateMovieVariables>;

interface CreateMovieRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMovieVariables): MutationRef<CreateMovieData, CreateMovieVariables>;
}
export const createMovieRef: CreateMovieRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createMovie(dc: DataConnect, vars: CreateMovieVariables): MutationPromise<CreateMovieData, CreateMovieVariables>;

interface CreateMovieRef {
  ...
  (dc: DataConnect, vars: CreateMovieVariables): MutationRef<CreateMovieData, CreateMovieVariables>;
}
export const createMovieRef: CreateMovieRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createMovieRef:
```typescript
const name = createMovieRef.operationName;
=======
## CreateTenant
You can execute the `CreateTenant` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createTenant(vars: CreateTenantVariables): MutationPromise<CreateTenantData, CreateTenantVariables>;

interface CreateTenantRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTenantVariables): MutationRef<CreateTenantData, CreateTenantVariables>;
}
export const createTenantRef: CreateTenantRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTenant(dc: DataConnect, vars: CreateTenantVariables): MutationPromise<CreateTenantData, CreateTenantVariables>;

interface CreateTenantRef {
  ...
  (dc: DataConnect, vars: CreateTenantVariables): MutationRef<CreateTenantData, CreateTenantVariables>;
}
export const createTenantRef: CreateTenantRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTenantRef:
```typescript
const name = createTenantRef.operationName;
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8
console.log(name);
```

### Variables
<<<<<<< HEAD
The `CreateMovie` mutation requires an argument of type `CreateMovieVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateMovieVariables {
  title: string;
  genre: string;
  imageUrl: string;
}
```
### Return Type
Recall that executing the `CreateMovie` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateMovieData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateMovieData {
  movie_insert: Movie_Key;
}
```
### Using `CreateMovie`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createMovie, CreateMovieVariables } from '@dataconnect/generated';

// The `CreateMovie` mutation requires an argument of type `CreateMovieVariables`:
const createMovieVars: CreateMovieVariables = {
  title: ..., 
  genre: ..., 
  imageUrl: ..., 
};

// Call the `createMovie()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createMovie(createMovieVars);
// Variables can be defined inline as well.
const { data } = await createMovie({ title: ..., genre: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createMovie(dataConnect, createMovieVars);

console.log(data.movie_insert);

// Or, you can use the `Promise` API.
createMovie(createMovieVars).then((response) => {
  const data = response.data;
  console.log(data.movie_insert);
});
```

### Using `CreateMovie`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createMovieRef, CreateMovieVariables } from '@dataconnect/generated';

// The `CreateMovie` mutation requires an argument of type `CreateMovieVariables`:
const createMovieVars: CreateMovieVariables = {
  title: ..., 
  genre: ..., 
  imageUrl: ..., 
};

// Call the `createMovieRef()` function to get a reference to the mutation.
const ref = createMovieRef(createMovieVars);
// Variables can be defined inline as well.
const ref = createMovieRef({ title: ..., genre: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createMovieRef(dataConnect, createMovieVars);
=======
The `CreateTenant` mutation requires an argument of type `CreateTenantVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTenantVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessSector?: string | null;
      businessSector_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              location?: string | null;
              location_expr?: {
              };
                logoUrl?: string | null;
                logoUrl_expr?: {
                };
                  name?: string | null;
                  name_expr?: {
                  };
                    ownerEmail?: string | null;
                    ownerEmail_expr?: {
                    };
                      subscriptionTier?: string | null;
                      subscriptionTier_expr?: {
                      };
                        taxId?: string | null;
                        taxId_expr?: {
                        };
  };
}
```
### Return Type
Recall that executing the `CreateTenant` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTenantData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTenantData {
  tenant_insert: Tenant_Key;
}
```
### Using `CreateTenant`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTenant, CreateTenantVariables } from '@dataconnect/generated';

// The `CreateTenant` mutation requires an argument of type `CreateTenantVariables`:
const createTenantVars: CreateTenantVariables = {
  data: ..., 
};

// Call the `createTenant()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTenant(createTenantVars);
// Variables can be defined inline as well.
const { data } = await createTenant({ data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTenant(dataConnect, createTenantVars);

console.log(data.tenant_insert);

// Or, you can use the `Promise` API.
createTenant(createTenantVars).then((response) => {
  const data = response.data;
  console.log(data.tenant_insert);
});
```

### Using `CreateTenant`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTenantRef, CreateTenantVariables } from '@dataconnect/generated';

// The `CreateTenant` mutation requires an argument of type `CreateTenantVariables`:
const createTenantVars: CreateTenantVariables = {
  data: ..., 
};

// Call the `createTenantRef()` function to get a reference to the mutation.
const ref = createTenantRef(createTenantVars);
// Variables can be defined inline as well.
const ref = createTenantRef({ data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTenantRef(dataConnect, createTenantVars);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

<<<<<<< HEAD
console.log(data.movie_insert);
=======
console.log(data.tenant_insert);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
<<<<<<< HEAD
  console.log(data.movie_insert);
});
```

## UpsertUser
You can execute the `UpsertUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserRef:
```typescript
const name = upsertUserRef.operationName;
=======
  console.log(data.tenant_insert);
});
```

## UpdateTenant
You can execute the `UpdateTenant` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateTenant(vars: UpdateTenantVariables): MutationPromise<UpdateTenantData, UpdateTenantVariables>;

interface UpdateTenantRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTenantVariables): MutationRef<UpdateTenantData, UpdateTenantVariables>;
}
export const updateTenantRef: UpdateTenantRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTenant(dc: DataConnect, vars: UpdateTenantVariables): MutationPromise<UpdateTenantData, UpdateTenantVariables>;

interface UpdateTenantRef {
  ...
  (dc: DataConnect, vars: UpdateTenantVariables): MutationRef<UpdateTenantData, UpdateTenantVariables>;
}
export const updateTenantRef: UpdateTenantRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTenantRef:
```typescript
const name = updateTenantRef.operationName;
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8
console.log(name);
```

### Variables
<<<<<<< HEAD
The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertUserVariables {
  username: string;
}
```
### Return Type
Recall that executing the `UpsertUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserData {
  user_upsert: User_Key;
}
```
### Using `UpsertUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUser, UpsertUserVariables } from '@dataconnect/generated';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  username: ..., 
};

// Call the `upsertUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUser(upsertUserVars);
// Variables can be defined inline as well.
const { data } = await upsertUser({ username: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUser(dataConnect, upsertUserVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertUser(upsertUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserRef, UpsertUserVariables } from '@dataconnect/generated';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  username: ..., 
};

// Call the `upsertUserRef()` function to get a reference to the mutation.
const ref = upsertUserRef(upsertUserVars);
// Variables can be defined inline as well.
const ref = upsertUserRef({ username: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserRef(dataConnect, upsertUserVars);
=======
The `UpdateTenant` mutation requires an argument of type `UpdateTenantVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTenantVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessSector?: string | null;
      businessSector_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              location?: string | null;
              location_expr?: {
              };
                logoUrl?: string | null;
                logoUrl_expr?: {
                };
                  name?: string | null;
                  name_expr?: {
                  };
                    ownerEmail?: string | null;
                    ownerEmail_expr?: {
                    };
                      subscriptionTier?: string | null;
                      subscriptionTier_expr?: {
                      };
                        taxId?: string | null;
                        taxId_expr?: {
                        };
  };
}
```
### Return Type
Recall that executing the `UpdateTenant` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTenantData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTenantData {
  tenant_update?: Tenant_Key | null;
}
```
### Using `UpdateTenant`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTenant, UpdateTenantVariables } from '@dataconnect/generated';

// The `UpdateTenant` mutation requires an argument of type `UpdateTenantVariables`:
const updateTenantVars: UpdateTenantVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateTenant()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTenant(updateTenantVars);
// Variables can be defined inline as well.
const { data } = await updateTenant({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTenant(dataConnect, updateTenantVars);

console.log(data.tenant_update);

// Or, you can use the `Promise` API.
updateTenant(updateTenantVars).then((response) => {
  const data = response.data;
  console.log(data.tenant_update);
});
```

### Using `UpdateTenant`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTenantRef, UpdateTenantVariables } from '@dataconnect/generated';

// The `UpdateTenant` mutation requires an argument of type `UpdateTenantVariables`:
const updateTenantVars: UpdateTenantVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateTenantRef()` function to get a reference to the mutation.
const ref = updateTenantRef(updateTenantVars);
// Variables can be defined inline as well.
const ref = updateTenantRef({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTenantRef(dataConnect, updateTenantVars);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

<<<<<<< HEAD
console.log(data.user_upsert);
=======
console.log(data.tenant_update);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
<<<<<<< HEAD
  console.log(data.user_upsert);
});
```

## AddReview
You can execute the `AddReview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addReview(vars: AddReviewVariables): MutationPromise<AddReviewData, AddReviewVariables>;

interface AddReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddReviewVariables): MutationRef<AddReviewData, AddReviewVariables>;
}
export const addReviewRef: AddReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addReview(dc: DataConnect, vars: AddReviewVariables): MutationPromise<AddReviewData, AddReviewVariables>;

interface AddReviewRef {
  ...
  (dc: DataConnect, vars: AddReviewVariables): MutationRef<AddReviewData, AddReviewVariables>;
}
export const addReviewRef: AddReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addReviewRef:
```typescript
const name = addReviewRef.operationName;
=======
  console.log(data.tenant_update);
});
```

## DeleteTenant
You can execute the `DeleteTenant` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteTenant(vars: DeleteTenantVariables): MutationPromise<DeleteTenantData, DeleteTenantVariables>;

interface DeleteTenantRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTenantVariables): MutationRef<DeleteTenantData, DeleteTenantVariables>;
}
export const deleteTenantRef: DeleteTenantRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteTenant(dc: DataConnect, vars: DeleteTenantVariables): MutationPromise<DeleteTenantData, DeleteTenantVariables>;

interface DeleteTenantRef {
  ...
  (dc: DataConnect, vars: DeleteTenantVariables): MutationRef<DeleteTenantData, DeleteTenantVariables>;
}
export const deleteTenantRef: DeleteTenantRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteTenantRef:
```typescript
const name = deleteTenantRef.operationName;
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8
console.log(name);
```

### Variables
<<<<<<< HEAD
The `AddReview` mutation requires an argument of type `AddReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddReviewVariables {
  movieId: UUIDString;
  rating: number;
  reviewText: string;
}
```
### Return Type
Recall that executing the `AddReview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddReviewData {
  review_upsert: Review_Key;
}
```
### Using `AddReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addReview, AddReviewVariables } from '@dataconnect/generated';

// The `AddReview` mutation requires an argument of type `AddReviewVariables`:
const addReviewVars: AddReviewVariables = {
  movieId: ..., 
  rating: ..., 
  reviewText: ..., 
};

// Call the `addReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addReview(addReviewVars);
// Variables can be defined inline as well.
const { data } = await addReview({ movieId: ..., rating: ..., reviewText: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addReview(dataConnect, addReviewVars);

console.log(data.review_upsert);

// Or, you can use the `Promise` API.
addReview(addReviewVars).then((response) => {
  const data = response.data;
  console.log(data.review_upsert);
});
```

### Using `AddReview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addReviewRef, AddReviewVariables } from '@dataconnect/generated';

// The `AddReview` mutation requires an argument of type `AddReviewVariables`:
const addReviewVars: AddReviewVariables = {
  movieId: ..., 
  rating: ..., 
  reviewText: ..., 
};

// Call the `addReviewRef()` function to get a reference to the mutation.
const ref = addReviewRef(addReviewVars);
// Variables can be defined inline as well.
const ref = addReviewRef({ movieId: ..., rating: ..., reviewText: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addReviewRef(dataConnect, addReviewVars);
=======
The `DeleteTenant` mutation requires an argument of type `DeleteTenantVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteTenantVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteTenant` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteTenantData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteTenantData {
  tenant_delete?: Tenant_Key | null;
}
```
### Using `DeleteTenant`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteTenant, DeleteTenantVariables } from '@dataconnect/generated';

// The `DeleteTenant` mutation requires an argument of type `DeleteTenantVariables`:
const deleteTenantVars: DeleteTenantVariables = {
  id: ..., 
};

// Call the `deleteTenant()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteTenant(deleteTenantVars);
// Variables can be defined inline as well.
const { data } = await deleteTenant({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteTenant(dataConnect, deleteTenantVars);

console.log(data.tenant_delete);

// Or, you can use the `Promise` API.
deleteTenant(deleteTenantVars).then((response) => {
  const data = response.data;
  console.log(data.tenant_delete);
});
```

### Using `DeleteTenant`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteTenantRef, DeleteTenantVariables } from '@dataconnect/generated';

// The `DeleteTenant` mutation requires an argument of type `DeleteTenantVariables`:
const deleteTenantVars: DeleteTenantVariables = {
  id: ..., 
};

// Call the `deleteTenantRef()` function to get a reference to the mutation.
const ref = deleteTenantRef(deleteTenantVars);
// Variables can be defined inline as well.
const ref = deleteTenantRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteTenantRef(dataConnect, deleteTenantVars);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

<<<<<<< HEAD
console.log(data.review_upsert);
=======
console.log(data.tenant_delete);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
<<<<<<< HEAD
  console.log(data.review_upsert);
});
```

## DeleteReview
You can execute the `DeleteReview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteReview(vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;

interface DeleteReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
}
export const deleteReviewRef: DeleteReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteReview(dc: DataConnect, vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;

interface DeleteReviewRef {
  ...
  (dc: DataConnect, vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
}
export const deleteReviewRef: DeleteReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteReviewRef:
```typescript
const name = deleteReviewRef.operationName;
=======
  console.log(data.tenant_delete);
});
```

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8
console.log(name);
```

### Variables
<<<<<<< HEAD
The `DeleteReview` mutation requires an argument of type `DeleteReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteReviewVariables {
  movieId: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteReview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteReviewData {
  review_delete?: Review_Key | null;
}
```
### Using `DeleteReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteReview, DeleteReviewVariables } from '@dataconnect/generated';

// The `DeleteReview` mutation requires an argument of type `DeleteReviewVariables`:
const deleteReviewVars: DeleteReviewVariables = {
  movieId: ..., 
};

// Call the `deleteReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteReview(deleteReviewVars);
// Variables can be defined inline as well.
const { data } = await deleteReview({ movieId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteReview(dataConnect, deleteReviewVars);

console.log(data.review_delete);

// Or, you can use the `Promise` API.
deleteReview(deleteReviewVars).then((response) => {
  const data = response.data;
  console.log(data.review_delete);
});
```

### Using `DeleteReview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteReviewRef, DeleteReviewVariables } from '@dataconnect/generated';

// The `DeleteReview` mutation requires an argument of type `DeleteReviewVariables`:
const deleteReviewVars: DeleteReviewVariables = {
  movieId: ..., 
};

// Call the `deleteReviewRef()` function to get a reference to the mutation.
const ref = deleteReviewRef(deleteReviewVars);
// Variables can be defined inline as well.
const ref = deleteReviewRef({ movieId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteReviewRef(dataConnect, deleteReviewVars);
=======
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              department?: string | null;
              department_expr?: {
              };
                email?: string | null;
                email_expr?: {
                };
                  phoneNumber?: string | null;
                  phoneNumber_expr?: {
                  };
                    role?: string | null;
                    role_expr?: {
                    };
                      tenantId?: UUIDString | null;
                      tenantId_expr?: {
                      };
  };
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  data: ..., 
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  data: ..., 
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

<<<<<<< HEAD
console.log(data.review_delete);
=======
console.log(data.user_insert);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
<<<<<<< HEAD
  console.log(data.review_delete);
=======
  console.log(data.user_insert);
});
```

## UpdateUser
You can execute the `UpdateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUser(vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUser(dc: DataConnect, vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  (dc: DataConnect, vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserRef:
```typescript
const name = updateUserRef.operationName;
console.log(name);
```

### Variables
The `UpdateUser` mutation requires an argument of type `UpdateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              department?: string | null;
              department_expr?: {
              };
                email?: string | null;
                email_expr?: {
                };
                  phoneNumber?: string | null;
                  phoneNumber_expr?: {
                  };
                    role?: string | null;
                    role_expr?: {
                    };
                      tenantId?: UUIDString | null;
                      tenantId_expr?: {
                      };
  };
}
```
### Return Type
Recall that executing the `UpdateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUser, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation requires an argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUser(updateUserVars);
// Variables can be defined inline as well.
const { data } = await updateUser({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUser(dataConnect, updateUserVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUser(updateUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserRef, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation requires an argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateUserRef()` function to get a reference to the mutation.
const ref = updateUserRef(updateUserVars);
// Variables can be defined inline as well.
const ref = updateUserRef({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserRef(dataConnect, updateUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## DeleteUser
You can execute the `DeleteUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUser(vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface DeleteUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
}
export const deleteUserRef: DeleteUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUser(dc: DataConnect, vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface DeleteUserRef {
  ...
  (dc: DataConnect, vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
}
export const deleteUserRef: DeleteUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserRef:
```typescript
const name = deleteUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteUser` mutation requires an argument of type `DeleteUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteUserVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```
### Using `DeleteUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUser, DeleteUserVariables } from '@dataconnect/generated';

// The `DeleteUser` mutation requires an argument of type `DeleteUserVariables`:
const deleteUserVars: DeleteUserVariables = {
  id: ..., 
};

// Call the `deleteUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUser(deleteUserVars);
// Variables can be defined inline as well.
const { data } = await deleteUser({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUser(dataConnect, deleteUserVars);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
deleteUser(deleteUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

### Using `DeleteUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserRef, DeleteUserVariables } from '@dataconnect/generated';

// The `DeleteUser` mutation requires an argument of type `DeleteUserVariables`:
const deleteUserVars: DeleteUserVariables = {
  id: ..., 
};

// Call the `deleteUserRef()` function to get a reference to the mutation.
const ref = deleteUserRef(deleteUserVars);
// Variables can be defined inline as well.
const ref = deleteUserRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserRef(dataConnect, deleteUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

## CreateBusiness
You can execute the `CreateBusiness` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createBusiness(vars: CreateBusinessVariables): MutationPromise<CreateBusinessData, CreateBusinessVariables>;

interface CreateBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBusinessVariables): MutationRef<CreateBusinessData, CreateBusinessVariables>;
}
export const createBusinessRef: CreateBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createBusiness(dc: DataConnect, vars: CreateBusinessVariables): MutationPromise<CreateBusinessData, CreateBusinessVariables>;

interface CreateBusinessRef {
  ...
  (dc: DataConnect, vars: CreateBusinessVariables): MutationRef<CreateBusinessData, CreateBusinessVariables>;
}
export const createBusinessRef: CreateBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createBusinessRef:
```typescript
const name = createBusinessRef.operationName;
console.log(name);
```

### Variables
The `CreateBusiness` mutation requires an argument of type `CreateBusinessVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateBusinessVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessType?: string | null;
      businessType_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              location?: string | null;
              location_expr?: {
              };
                name?: string | null;
                name_expr?: {
                };
                  region?: string | null;
                  region_expr?: {
                  };
                    tenantId?: UUIDString | null;
                    tenantId_expr?: {
                    };
  };
}
```
### Return Type
Recall that executing the `CreateBusiness` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBusinessData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBusinessData {
  business_insert: Business_Key;
}
```
### Using `CreateBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBusiness, CreateBusinessVariables } from '@dataconnect/generated';

// The `CreateBusiness` mutation requires an argument of type `CreateBusinessVariables`:
const createBusinessVars: CreateBusinessVariables = {
  data: ..., 
};

// Call the `createBusiness()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBusiness(createBusinessVars);
// Variables can be defined inline as well.
const { data } = await createBusiness({ data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createBusiness(dataConnect, createBusinessVars);

console.log(data.business_insert);

// Or, you can use the `Promise` API.
createBusiness(createBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.business_insert);
});
```

### Using `CreateBusiness`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createBusinessRef, CreateBusinessVariables } from '@dataconnect/generated';

// The `CreateBusiness` mutation requires an argument of type `CreateBusinessVariables`:
const createBusinessVars: CreateBusinessVariables = {
  data: ..., 
};

// Call the `createBusinessRef()` function to get a reference to the mutation.
const ref = createBusinessRef(createBusinessVars);
// Variables can be defined inline as well.
const ref = createBusinessRef({ data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createBusinessRef(dataConnect, createBusinessVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.business_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.business_insert);
});
```

## UpdateBusiness
You can execute the `UpdateBusiness` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateBusiness(vars: UpdateBusinessVariables): MutationPromise<UpdateBusinessData, UpdateBusinessVariables>;

interface UpdateBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBusinessVariables): MutationRef<UpdateBusinessData, UpdateBusinessVariables>;
}
export const updateBusinessRef: UpdateBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateBusiness(dc: DataConnect, vars: UpdateBusinessVariables): MutationPromise<UpdateBusinessData, UpdateBusinessVariables>;

interface UpdateBusinessRef {
  ...
  (dc: DataConnect, vars: UpdateBusinessVariables): MutationRef<UpdateBusinessData, UpdateBusinessVariables>;
}
export const updateBusinessRef: UpdateBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateBusinessRef:
```typescript
const name = updateBusinessRef.operationName;
console.log(name);
```

### Variables
The `UpdateBusiness` mutation requires an argument of type `UpdateBusinessVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateBusinessVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessType?: string | null;
      businessType_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              location?: string | null;
              location_expr?: {
              };
                name?: string | null;
                name_expr?: {
                };
                  region?: string | null;
                  region_expr?: {
                  };
                    tenantId?: UUIDString | null;
                    tenantId_expr?: {
                    };
  };
}
```
### Return Type
Recall that executing the `UpdateBusiness` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateBusinessData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateBusinessData {
  business_update?: Business_Key | null;
}
```
### Using `UpdateBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateBusiness, UpdateBusinessVariables } from '@dataconnect/generated';

// The `UpdateBusiness` mutation requires an argument of type `UpdateBusinessVariables`:
const updateBusinessVars: UpdateBusinessVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateBusiness()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateBusiness(updateBusinessVars);
// Variables can be defined inline as well.
const { data } = await updateBusiness({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateBusiness(dataConnect, updateBusinessVars);

console.log(data.business_update);

// Or, you can use the `Promise` API.
updateBusiness(updateBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.business_update);
});
```

### Using `UpdateBusiness`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateBusinessRef, UpdateBusinessVariables } from '@dataconnect/generated';

// The `UpdateBusiness` mutation requires an argument of type `UpdateBusinessVariables`:
const updateBusinessVars: UpdateBusinessVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateBusinessRef()` function to get a reference to the mutation.
const ref = updateBusinessRef(updateBusinessVars);
// Variables can be defined inline as well.
const ref = updateBusinessRef({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateBusinessRef(dataConnect, updateBusinessVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.business_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.business_update);
});
```

## DeleteBusiness
You can execute the `DeleteBusiness` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteBusiness(vars: DeleteBusinessVariables): MutationPromise<DeleteBusinessData, DeleteBusinessVariables>;

interface DeleteBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBusinessVariables): MutationRef<DeleteBusinessData, DeleteBusinessVariables>;
}
export const deleteBusinessRef: DeleteBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteBusiness(dc: DataConnect, vars: DeleteBusinessVariables): MutationPromise<DeleteBusinessData, DeleteBusinessVariables>;

interface DeleteBusinessRef {
  ...
  (dc: DataConnect, vars: DeleteBusinessVariables): MutationRef<DeleteBusinessData, DeleteBusinessVariables>;
}
export const deleteBusinessRef: DeleteBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteBusinessRef:
```typescript
const name = deleteBusinessRef.operationName;
console.log(name);
```

### Variables
The `DeleteBusiness` mutation requires an argument of type `DeleteBusinessVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteBusinessVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteBusiness` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteBusinessData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteBusinessData {
  business_delete?: Business_Key | null;
}
```
### Using `DeleteBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteBusiness, DeleteBusinessVariables } from '@dataconnect/generated';

// The `DeleteBusiness` mutation requires an argument of type `DeleteBusinessVariables`:
const deleteBusinessVars: DeleteBusinessVariables = {
  id: ..., 
};

// Call the `deleteBusiness()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteBusiness(deleteBusinessVars);
// Variables can be defined inline as well.
const { data } = await deleteBusiness({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteBusiness(dataConnect, deleteBusinessVars);

console.log(data.business_delete);

// Or, you can use the `Promise` API.
deleteBusiness(deleteBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.business_delete);
});
```

### Using `DeleteBusiness`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteBusinessRef, DeleteBusinessVariables } from '@dataconnect/generated';

// The `DeleteBusiness` mutation requires an argument of type `DeleteBusinessVariables`:
const deleteBusinessVars: DeleteBusinessVariables = {
  id: ..., 
};

// Call the `deleteBusinessRef()` function to get a reference to the mutation.
const ref = deleteBusinessRef(deleteBusinessVars);
// Variables can be defined inline as well.
const ref = deleteBusinessRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteBusinessRef(dataConnect, deleteBusinessVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.business_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.business_delete);
});
```

## CreateProduct
You can execute the `CreateProduct` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createProduct(vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;

interface CreateProductRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
}
export const createProductRef: CreateProductRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createProduct(dc: DataConnect, vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;

interface CreateProductRef {
  ...
  (dc: DataConnect, vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
}
export const createProductRef: CreateProductRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createProductRef:
```typescript
const name = createProductRef.operationName;
console.log(name);
```

### Variables
The `CreateProduct` mutation requires an argument of type `CreateProductVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateProductVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        category?: string | null;
        category_expr?: {
        };
          costPrice?: number | null;
          costPrice_expr?: {
          };
            costPrice_update?: ({
              inc?: number | null;
              dec?: number | null;
            })[];
              createdAt?: TimestampString | null;
              createdAt_expr?: {
              };
                createdAt_time?: {
                  now?: {
                  };
                    at?: TimestampString | null;
                    add?: {
                      milliseconds?: number;
                      seconds?: number;
                      minutes?: number;
                      hours?: number;
                      days?: number;
                      weeks?: number;
                      months?: number;
                      years?: number;
                    };
                      sub?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                        truncateTo?: Timestamp_Interval | null;
                };
                  createdAt_update?: ({
                    inc?: {
                      milliseconds?: number;
                      seconds?: number;
                      minutes?: number;
                      hours?: number;
                      days?: number;
                      weeks?: number;
                      months?: number;
                      years?: number;
                    };
                      dec?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                  })[];
                    createdBy?: UUIDString | null;
                    createdBy_expr?: {
                    };
                      expiryDate?: DateString | null;
                      expiryDate_expr?: {
                      };
                        expiryDate_date?: {
                          today?: {
                          };
                            on?: DateString | null;
                            add?: {
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                              sub?: {
                                days?: number;
                                weeks?: number;
                                months?: number;
                                years?: number;
                              };
                                truncateTo?: Date_Interval | null;
                        };
                          expiryDate_update?: ({
                            inc?: {
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                              dec?: {
                                days?: number;
                                weeks?: number;
                                months?: number;
                                years?: number;
                              };
                          })[];
                            lowStockLevel?: number | null;
                            lowStockLevel_expr?: {
                            };
                              lowStockLevel_update?: ({
                                inc?: number | null;
                                dec?: number | null;
                              })[];
                                name?: string | null;
                                name_expr?: {
                                };
                                  quantity?: number | null;
                                  quantity_expr?: {
                                  };
                                    quantity_update?: ({
                                      inc?: number | null;
                                      dec?: number | null;
                                    })[];
                                      sellingPrice?: number | null;
                                      sellingPrice_expr?: {
                                      };
                                        sellingPrice_update?: ({
                                          inc?: number | null;
                                          dec?: number | null;
                                        })[];
                                          tenantId?: UUIDString | null;
                                          tenantId_expr?: {
                                          };
                                            updatedAt?: TimestampString | null;
                                            updatedAt_expr?: {
                                            };
                                              updatedAt_time?: {
                                                now?: {
                                                };
                                                  at?: TimestampString | null;
                                                  add?: {
                                                    milliseconds?: number;
                                                    seconds?: number;
                                                    minutes?: number;
                                                    hours?: number;
                                                    days?: number;
                                                    weeks?: number;
                                                    months?: number;
                                                    years?: number;
                                                  };
                                                    sub?: {
                                                      milliseconds?: number;
                                                      seconds?: number;
                                                      minutes?: number;
                                                      hours?: number;
                                                      days?: number;
                                                      weeks?: number;
                                                      months?: number;
                                                      years?: number;
                                                    };
                                                      truncateTo?: Timestamp_Interval | null;
                                              };
                                                updatedAt_update?: ({
                                                  inc?: {
                                                    milliseconds?: number;
                                                    seconds?: number;
                                                    minutes?: number;
                                                    hours?: number;
                                                    days?: number;
                                                    weeks?: number;
                                                    months?: number;
                                                    years?: number;
                                                  };
                                                    dec?: {
                                                      milliseconds?: number;
                                                      seconds?: number;
                                                      minutes?: number;
                                                      hours?: number;
                                                      days?: number;
                                                      weeks?: number;
                                                      months?: number;
                                                      years?: number;
                                                    };
                                                })[];
  };
}
```
### Return Type
Recall that executing the `CreateProduct` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateProductData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateProductData {
  product_insert: Product_Key;
}
```
### Using `CreateProduct`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProduct, CreateProductVariables } from '@dataconnect/generated';

// The `CreateProduct` mutation requires an argument of type `CreateProductVariables`:
const createProductVars: CreateProductVariables = {
  data: ..., 
};

// Call the `createProduct()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProduct(createProductVars);
// Variables can be defined inline as well.
const { data } = await createProduct({ data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProduct(dataConnect, createProductVars);

console.log(data.product_insert);

// Or, you can use the `Promise` API.
createProduct(createProductVars).then((response) => {
  const data = response.data;
  console.log(data.product_insert);
});
```

### Using `CreateProduct`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createProductRef, CreateProductVariables } from '@dataconnect/generated';

// The `CreateProduct` mutation requires an argument of type `CreateProductVariables`:
const createProductVars: CreateProductVariables = {
  data: ..., 
};

// Call the `createProductRef()` function to get a reference to the mutation.
const ref = createProductRef(createProductVars);
// Variables can be defined inline as well.
const ref = createProductRef({ data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createProductRef(dataConnect, createProductVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_insert);
});
```

## UpdateProduct
You can execute the `UpdateProduct` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateProduct(vars: UpdateProductVariables): MutationPromise<UpdateProductData, UpdateProductVariables>;

interface UpdateProductRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductVariables): MutationRef<UpdateProductData, UpdateProductVariables>;
}
export const updateProductRef: UpdateProductRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProduct(dc: DataConnect, vars: UpdateProductVariables): MutationPromise<UpdateProductData, UpdateProductVariables>;

interface UpdateProductRef {
  ...
  (dc: DataConnect, vars: UpdateProductVariables): MutationRef<UpdateProductData, UpdateProductVariables>;
}
export const updateProductRef: UpdateProductRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateProductRef:
```typescript
const name = updateProductRef.operationName;
console.log(name);
```

### Variables
The `UpdateProduct` mutation requires an argument of type `UpdateProductVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProductVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        category?: string | null;
        category_expr?: {
        };
          costPrice?: number | null;
          costPrice_expr?: {
          };
            costPrice_update?: ({
              inc?: number | null;
              dec?: number | null;
            })[];
              createdAt?: TimestampString | null;
              createdAt_expr?: {
              };
                createdAt_time?: {
                  now?: {
                  };
                    at?: TimestampString | null;
                    add?: {
                      milliseconds?: number;
                      seconds?: number;
                      minutes?: number;
                      hours?: number;
                      days?: number;
                      weeks?: number;
                      months?: number;
                      years?: number;
                    };
                      sub?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                        truncateTo?: Timestamp_Interval | null;
                };
                  createdAt_update?: ({
                    inc?: {
                      milliseconds?: number;
                      seconds?: number;
                      minutes?: number;
                      hours?: number;
                      days?: number;
                      weeks?: number;
                      months?: number;
                      years?: number;
                    };
                      dec?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                  })[];
                    createdBy?: UUIDString | null;
                    createdBy_expr?: {
                    };
                      expiryDate?: DateString | null;
                      expiryDate_expr?: {
                      };
                        expiryDate_date?: {
                          today?: {
                          };
                            on?: DateString | null;
                            add?: {
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                              sub?: {
                                days?: number;
                                weeks?: number;
                                months?: number;
                                years?: number;
                              };
                                truncateTo?: Date_Interval | null;
                        };
                          expiryDate_update?: ({
                            inc?: {
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                              dec?: {
                                days?: number;
                                weeks?: number;
                                months?: number;
                                years?: number;
                              };
                          })[];
                            lowStockLevel?: number | null;
                            lowStockLevel_expr?: {
                            };
                              lowStockLevel_update?: ({
                                inc?: number | null;
                                dec?: number | null;
                              })[];
                                name?: string | null;
                                name_expr?: {
                                };
                                  quantity?: number | null;
                                  quantity_expr?: {
                                  };
                                    quantity_update?: ({
                                      inc?: number | null;
                                      dec?: number | null;
                                    })[];
                                      sellingPrice?: number | null;
                                      sellingPrice_expr?: {
                                      };
                                        sellingPrice_update?: ({
                                          inc?: number | null;
                                          dec?: number | null;
                                        })[];
                                          tenantId?: UUIDString | null;
                                          tenantId_expr?: {
                                          };
                                            updatedAt?: TimestampString | null;
                                            updatedAt_expr?: {
                                            };
                                              updatedAt_time?: {
                                                now?: {
                                                };
                                                  at?: TimestampString | null;
                                                  add?: {
                                                    milliseconds?: number;
                                                    seconds?: number;
                                                    minutes?: number;
                                                    hours?: number;
                                                    days?: number;
                                                    weeks?: number;
                                                    months?: number;
                                                    years?: number;
                                                  };
                                                    sub?: {
                                                      milliseconds?: number;
                                                      seconds?: number;
                                                      minutes?: number;
                                                      hours?: number;
                                                      days?: number;
                                                      weeks?: number;
                                                      months?: number;
                                                      years?: number;
                                                    };
                                                      truncateTo?: Timestamp_Interval | null;
                                              };
                                                updatedAt_update?: ({
                                                  inc?: {
                                                    milliseconds?: number;
                                                    seconds?: number;
                                                    minutes?: number;
                                                    hours?: number;
                                                    days?: number;
                                                    weeks?: number;
                                                    months?: number;
                                                    years?: number;
                                                  };
                                                    dec?: {
                                                      milliseconds?: number;
                                                      seconds?: number;
                                                      minutes?: number;
                                                      hours?: number;
                                                      days?: number;
                                                      weeks?: number;
                                                      months?: number;
                                                      years?: number;
                                                    };
                                                })[];
  };
}
```
### Return Type
Recall that executing the `UpdateProduct` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProductData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProductData {
  product_update?: Product_Key | null;
}
```
### Using `UpdateProduct`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProduct, UpdateProductVariables } from '@dataconnect/generated';

// The `UpdateProduct` mutation requires an argument of type `UpdateProductVariables`:
const updateProductVars: UpdateProductVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateProduct()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProduct(updateProductVars);
// Variables can be defined inline as well.
const { data } = await updateProduct({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProduct(dataConnect, updateProductVars);

console.log(data.product_update);

// Or, you can use the `Promise` API.
updateProduct(updateProductVars).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

### Using `UpdateProduct`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProductRef, UpdateProductVariables } from '@dataconnect/generated';

// The `UpdateProduct` mutation requires an argument of type `UpdateProductVariables`:
const updateProductVars: UpdateProductVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateProductRef()` function to get a reference to the mutation.
const ref = updateProductRef(updateProductVars);
// Variables can be defined inline as well.
const ref = updateProductRef({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProductRef(dataConnect, updateProductVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

## DeleteProduct
You can execute the `DeleteProduct` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteProduct(vars: DeleteProductVariables): MutationPromise<DeleteProductData, DeleteProductVariables>;

interface DeleteProductRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProductVariables): MutationRef<DeleteProductData, DeleteProductVariables>;
}
export const deleteProductRef: DeleteProductRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteProduct(dc: DataConnect, vars: DeleteProductVariables): MutationPromise<DeleteProductData, DeleteProductVariables>;

interface DeleteProductRef {
  ...
  (dc: DataConnect, vars: DeleteProductVariables): MutationRef<DeleteProductData, DeleteProductVariables>;
}
export const deleteProductRef: DeleteProductRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteProductRef:
```typescript
const name = deleteProductRef.operationName;
console.log(name);
```

### Variables
The `DeleteProduct` mutation requires an argument of type `DeleteProductVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteProductVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteProduct` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteProductData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteProductData {
  product_delete?: Product_Key | null;
}
```
### Using `DeleteProduct`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteProduct, DeleteProductVariables } from '@dataconnect/generated';

// The `DeleteProduct` mutation requires an argument of type `DeleteProductVariables`:
const deleteProductVars: DeleteProductVariables = {
  id: ..., 
};

// Call the `deleteProduct()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteProduct(deleteProductVars);
// Variables can be defined inline as well.
const { data } = await deleteProduct({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteProduct(dataConnect, deleteProductVars);

console.log(data.product_delete);

// Or, you can use the `Promise` API.
deleteProduct(deleteProductVars).then((response) => {
  const data = response.data;
  console.log(data.product_delete);
});
```

### Using `DeleteProduct`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteProductRef, DeleteProductVariables } from '@dataconnect/generated';

// The `DeleteProduct` mutation requires an argument of type `DeleteProductVariables`:
const deleteProductVars: DeleteProductVariables = {
  id: ..., 
};

// Call the `deleteProductRef()` function to get a reference to the mutation.
const ref = deleteProductRef(deleteProductVars);
// Variables can be defined inline as well.
const ref = deleteProductRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteProductRef(dataConnect, deleteProductVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_delete);
});
```

## CreateTransaction
You can execute the `CreateTransaction` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createTransaction(vars: CreateTransactionVariables): MutationPromise<CreateTransactionData, CreateTransactionVariables>;

interface CreateTransactionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTransactionVariables): MutationRef<CreateTransactionData, CreateTransactionVariables>;
}
export const createTransactionRef: CreateTransactionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTransaction(dc: DataConnect, vars: CreateTransactionVariables): MutationPromise<CreateTransactionData, CreateTransactionVariables>;

interface CreateTransactionRef {
  ...
  (dc: DataConnect, vars: CreateTransactionVariables): MutationRef<CreateTransactionData, CreateTransactionVariables>;
}
export const createTransactionRef: CreateTransactionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTransactionRef:
```typescript
const name = createTransactionRef.operationName;
console.log(name);
```

### Variables
The `CreateTransaction` mutation requires an argument of type `CreateTransactionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTransactionVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      amount?: number | null;
      amount_expr?: {
      };
        amount_update?: ({
          inc?: number | null;
          dec?: number | null;
        })[];
          businessId?: UUIDString | null;
          businessId_expr?: {
          };
            category?: string | null;
            category_expr?: {
            };
              createdAt?: TimestampString | null;
              createdAt_expr?: {
              };
                createdAt_time?: {
                  now?: {
                  };
                    at?: TimestampString | null;
                    add?: {
                      milliseconds?: number;
                      seconds?: number;
                      minutes?: number;
                      hours?: number;
                      days?: number;
                      weeks?: number;
                      months?: number;
                      years?: number;
                    };
                      sub?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                        truncateTo?: Timestamp_Interval | null;
                };
                  createdAt_update?: ({
                    inc?: {
                      milliseconds?: number;
                      seconds?: number;
                      minutes?: number;
                      hours?: number;
                      days?: number;
                      weeks?: number;
                      months?: number;
                      years?: number;
                    };
                      dec?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                  })[];
                    date?: TimestampString | null;
                    date_expr?: {
                    };
                      date_time?: {
                        now?: {
                        };
                          at?: TimestampString | null;
                          add?: {
                            milliseconds?: number;
                            seconds?: number;
                            minutes?: number;
                            hours?: number;
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            sub?: {
                              milliseconds?: number;
                              seconds?: number;
                              minutes?: number;
                              hours?: number;
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                              truncateTo?: Timestamp_Interval | null;
                      };
                        date_update?: ({
                          inc?: {
                            milliseconds?: number;
                            seconds?: number;
                            minutes?: number;
                            hours?: number;
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            dec?: {
                              milliseconds?: number;
                              seconds?: number;
                              minutes?: number;
                              hours?: number;
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                        })[];
                          receiptUrl?: string | null;
                          receiptUrl_expr?: {
                          };
                            recordedBy?: UUIDString | null;
                            recordedBy_expr?: {
                            };
                              tenantId?: UUIDString | null;
                              tenantId_expr?: {
                              };
                                type?: string | null;
                                type_expr?: {
                                };
  };
}
```
### Return Type
Recall that executing the `CreateTransaction` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTransactionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTransactionData {
  transaction_insert: Transaction_Key;
}
```
### Using `CreateTransaction`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTransaction, CreateTransactionVariables } from '@dataconnect/generated';

// The `CreateTransaction` mutation requires an argument of type `CreateTransactionVariables`:
const createTransactionVars: CreateTransactionVariables = {
  data: ..., 
};

// Call the `createTransaction()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTransaction(createTransactionVars);
// Variables can be defined inline as well.
const { data } = await createTransaction({ data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTransaction(dataConnect, createTransactionVars);

console.log(data.transaction_insert);

// Or, you can use the `Promise` API.
createTransaction(createTransactionVars).then((response) => {
  const data = response.data;
  console.log(data.transaction_insert);
});
```

### Using `CreateTransaction`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTransactionRef, CreateTransactionVariables } from '@dataconnect/generated';

// The `CreateTransaction` mutation requires an argument of type `CreateTransactionVariables`:
const createTransactionVars: CreateTransactionVariables = {
  data: ..., 
};

// Call the `createTransactionRef()` function to get a reference to the mutation.
const ref = createTransactionRef(createTransactionVars);
// Variables can be defined inline as well.
const ref = createTransactionRef({ data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTransactionRef(dataConnect, createTransactionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.transaction_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.transaction_insert);
});
```

## UpdateTransaction
You can execute the `UpdateTransaction` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateTransaction(vars: UpdateTransactionVariables): MutationPromise<UpdateTransactionData, UpdateTransactionVariables>;

interface UpdateTransactionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTransactionVariables): MutationRef<UpdateTransactionData, UpdateTransactionVariables>;
}
export const updateTransactionRef: UpdateTransactionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTransaction(dc: DataConnect, vars: UpdateTransactionVariables): MutationPromise<UpdateTransactionData, UpdateTransactionVariables>;

interface UpdateTransactionRef {
  ...
  (dc: DataConnect, vars: UpdateTransactionVariables): MutationRef<UpdateTransactionData, UpdateTransactionVariables>;
}
export const updateTransactionRef: UpdateTransactionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTransactionRef:
```typescript
const name = updateTransactionRef.operationName;
console.log(name);
```

### Variables
The `UpdateTransaction` mutation requires an argument of type `UpdateTransactionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTransactionVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      amount?: number | null;
      amount_expr?: {
      };
        amount_update?: ({
          inc?: number | null;
          dec?: number | null;
        })[];
          businessId?: UUIDString | null;
          businessId_expr?: {
          };
            category?: string | null;
            category_expr?: {
            };
              createdAt?: TimestampString | null;
              createdAt_expr?: {
              };
                createdAt_time?: {
                  now?: {
                  };
                    at?: TimestampString | null;
                    add?: {
                      milliseconds?: number;
                      seconds?: number;
                      minutes?: number;
                      hours?: number;
                      days?: number;
                      weeks?: number;
                      months?: number;
                      years?: number;
                    };
                      sub?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                        truncateTo?: Timestamp_Interval | null;
                };
                  createdAt_update?: ({
                    inc?: {
                      milliseconds?: number;
                      seconds?: number;
                      minutes?: number;
                      hours?: number;
                      days?: number;
                      weeks?: number;
                      months?: number;
                      years?: number;
                    };
                      dec?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                  })[];
                    date?: TimestampString | null;
                    date_expr?: {
                    };
                      date_time?: {
                        now?: {
                        };
                          at?: TimestampString | null;
                          add?: {
                            milliseconds?: number;
                            seconds?: number;
                            minutes?: number;
                            hours?: number;
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            sub?: {
                              milliseconds?: number;
                              seconds?: number;
                              minutes?: number;
                              hours?: number;
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                              truncateTo?: Timestamp_Interval | null;
                      };
                        date_update?: ({
                          inc?: {
                            milliseconds?: number;
                            seconds?: number;
                            minutes?: number;
                            hours?: number;
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            dec?: {
                              milliseconds?: number;
                              seconds?: number;
                              minutes?: number;
                              hours?: number;
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                        })[];
                          receiptUrl?: string | null;
                          receiptUrl_expr?: {
                          };
                            recordedBy?: UUIDString | null;
                            recordedBy_expr?: {
                            };
                              tenantId?: UUIDString | null;
                              tenantId_expr?: {
                              };
                                type?: string | null;
                                type_expr?: {
                                };
  };
}
```
### Return Type
Recall that executing the `UpdateTransaction` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTransactionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTransactionData {
  transaction_update?: Transaction_Key | null;
}
```
### Using `UpdateTransaction`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTransaction, UpdateTransactionVariables } from '@dataconnect/generated';

// The `UpdateTransaction` mutation requires an argument of type `UpdateTransactionVariables`:
const updateTransactionVars: UpdateTransactionVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateTransaction()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTransaction(updateTransactionVars);
// Variables can be defined inline as well.
const { data } = await updateTransaction({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTransaction(dataConnect, updateTransactionVars);

console.log(data.transaction_update);

// Or, you can use the `Promise` API.
updateTransaction(updateTransactionVars).then((response) => {
  const data = response.data;
  console.log(data.transaction_update);
});
```

### Using `UpdateTransaction`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTransactionRef, UpdateTransactionVariables } from '@dataconnect/generated';

// The `UpdateTransaction` mutation requires an argument of type `UpdateTransactionVariables`:
const updateTransactionVars: UpdateTransactionVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateTransactionRef()` function to get a reference to the mutation.
const ref = updateTransactionRef(updateTransactionVars);
// Variables can be defined inline as well.
const ref = updateTransactionRef({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTransactionRef(dataConnect, updateTransactionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.transaction_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.transaction_update);
});
```

## DeleteTransaction
You can execute the `DeleteTransaction` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteTransaction(vars: DeleteTransactionVariables): MutationPromise<DeleteTransactionData, DeleteTransactionVariables>;

interface DeleteTransactionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTransactionVariables): MutationRef<DeleteTransactionData, DeleteTransactionVariables>;
}
export const deleteTransactionRef: DeleteTransactionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteTransaction(dc: DataConnect, vars: DeleteTransactionVariables): MutationPromise<DeleteTransactionData, DeleteTransactionVariables>;

interface DeleteTransactionRef {
  ...
  (dc: DataConnect, vars: DeleteTransactionVariables): MutationRef<DeleteTransactionData, DeleteTransactionVariables>;
}
export const deleteTransactionRef: DeleteTransactionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteTransactionRef:
```typescript
const name = deleteTransactionRef.operationName;
console.log(name);
```

### Variables
The `DeleteTransaction` mutation requires an argument of type `DeleteTransactionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteTransactionVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteTransaction` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteTransactionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteTransactionData {
  transaction_delete?: Transaction_Key | null;
}
```
### Using `DeleteTransaction`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteTransaction, DeleteTransactionVariables } from '@dataconnect/generated';

// The `DeleteTransaction` mutation requires an argument of type `DeleteTransactionVariables`:
const deleteTransactionVars: DeleteTransactionVariables = {
  id: ..., 
};

// Call the `deleteTransaction()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteTransaction(deleteTransactionVars);
// Variables can be defined inline as well.
const { data } = await deleteTransaction({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteTransaction(dataConnect, deleteTransactionVars);

console.log(data.transaction_delete);

// Or, you can use the `Promise` API.
deleteTransaction(deleteTransactionVars).then((response) => {
  const data = response.data;
  console.log(data.transaction_delete);
});
```

### Using `DeleteTransaction`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteTransactionRef, DeleteTransactionVariables } from '@dataconnect/generated';

// The `DeleteTransaction` mutation requires an argument of type `DeleteTransactionVariables`:
const deleteTransactionVars: DeleteTransactionVariables = {
  id: ..., 
};

// Call the `deleteTransactionRef()` function to get a reference to the mutation.
const ref = deleteTransactionRef(deleteTransactionVars);
// Variables can be defined inline as well.
const ref = deleteTransactionRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteTransactionRef(dataConnect, deleteTransactionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.transaction_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.transaction_delete);
});
```

## CreateTask
You can execute the `CreateTask` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createTask(vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface CreateTaskRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
}
export const createTaskRef: CreateTaskRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTask(dc: DataConnect, vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface CreateTaskRef {
  ...
  (dc: DataConnect, vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
}
export const createTaskRef: CreateTaskRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTaskRef:
```typescript
const name = createTaskRef.operationName;
console.log(name);
```

### Variables
The `CreateTask` mutation requires an argument of type `CreateTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTaskVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      assignedToId?: UUIDString | null;
      assignedToId_expr?: {
      };
        assignedTo?: User_Key | null;
        businessId?: UUIDString | null;
        businessId_expr?: {
        };
          createdAt?: TimestampString | null;
          createdAt_expr?: {
          };
            createdAt_time?: {
              now?: {
              };
                at?: TimestampString | null;
                add?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  sub?: {
                    milliseconds?: number;
                    seconds?: number;
                    minutes?: number;
                    hours?: number;
                    days?: number;
                    weeks?: number;
                    months?: number;
                    years?: number;
                  };
                    truncateTo?: Timestamp_Interval | null;
            };
              createdAt_update?: ({
                inc?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  dec?: {
                    milliseconds?: number;
                    seconds?: number;
                    minutes?: number;
                    hours?: number;
                    days?: number;
                    weeks?: number;
                    months?: number;
                    years?: number;
                  };
              })[];
                createdBy?: UUIDString | null;
                createdBy_expr?: {
                };
                  description?: string | null;
                  description_expr?: {
                  };
                    dueDate?: TimestampString | null;
                    dueDate_expr?: {
                    };
                      dueDate_time?: {
                        now?: {
                        };
                          at?: TimestampString | null;
                          add?: {
                            milliseconds?: number;
                            seconds?: number;
                            minutes?: number;
                            hours?: number;
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            sub?: {
                              milliseconds?: number;
                              seconds?: number;
                              minutes?: number;
                              hours?: number;
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                              truncateTo?: Timestamp_Interval | null;
                      };
                        dueDate_update?: ({
                          inc?: {
                            milliseconds?: number;
                            seconds?: number;
                            minutes?: number;
                            hours?: number;
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            dec?: {
                              milliseconds?: number;
                              seconds?: number;
                              minutes?: number;
                              hours?: number;
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                        })[];
                          priority?: string | null;
                          priority_expr?: {
                          };
                            status?: string | null;
                            status_expr?: {
                            };
                              tenantId?: UUIDString | null;
                              tenantId_expr?: {
                              };
                                title?: string | null;
                                title_expr?: {
                                };
                                  updatedAt?: TimestampString | null;
                                  updatedAt_expr?: {
                                  };
                                    updatedAt_time?: {
                                      now?: {
                                      };
                                        at?: TimestampString | null;
                                        add?: {
                                          milliseconds?: number;
                                          seconds?: number;
                                          minutes?: number;
                                          hours?: number;
                                          days?: number;
                                          weeks?: number;
                                          months?: number;
                                          years?: number;
                                        };
                                          sub?: {
                                            milliseconds?: number;
                                            seconds?: number;
                                            minutes?: number;
                                            hours?: number;
                                            days?: number;
                                            weeks?: number;
                                            months?: number;
                                            years?: number;
                                          };
                                            truncateTo?: Timestamp_Interval | null;
                                    };
                                      updatedAt_update?: ({
                                        inc?: {
                                          milliseconds?: number;
                                          seconds?: number;
                                          minutes?: number;
                                          hours?: number;
                                          days?: number;
                                          weeks?: number;
                                          months?: number;
                                          years?: number;
                                        };
                                          dec?: {
                                            milliseconds?: number;
                                            seconds?: number;
                                            minutes?: number;
                                            hours?: number;
                                            days?: number;
                                            weeks?: number;
                                            months?: number;
                                            years?: number;
                                          };
                                      })[];
  };
}
```
### Return Type
Recall that executing the `CreateTask` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTaskData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTaskData {
  task_insert: Task_Key;
}
```
### Using `CreateTask`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTask, CreateTaskVariables } from '@dataconnect/generated';

// The `CreateTask` mutation requires an argument of type `CreateTaskVariables`:
const createTaskVars: CreateTaskVariables = {
  data: ..., 
};

// Call the `createTask()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTask(createTaskVars);
// Variables can be defined inline as well.
const { data } = await createTask({ data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTask(dataConnect, createTaskVars);

console.log(data.task_insert);

// Or, you can use the `Promise` API.
createTask(createTaskVars).then((response) => {
  const data = response.data;
  console.log(data.task_insert);
});
```

### Using `CreateTask`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTaskRef, CreateTaskVariables } from '@dataconnect/generated';

// The `CreateTask` mutation requires an argument of type `CreateTaskVariables`:
const createTaskVars: CreateTaskVariables = {
  data: ..., 
};

// Call the `createTaskRef()` function to get a reference to the mutation.
const ref = createTaskRef(createTaskVars);
// Variables can be defined inline as well.
const ref = createTaskRef({ data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTaskRef(dataConnect, createTaskVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.task_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.task_insert);
});
```

## UpdateTask
You can execute the `UpdateTask` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateTask(vars: UpdateTaskVariables): MutationPromise<UpdateTaskData, UpdateTaskVariables>;

interface UpdateTaskRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTaskVariables): MutationRef<UpdateTaskData, UpdateTaskVariables>;
}
export const updateTaskRef: UpdateTaskRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTask(dc: DataConnect, vars: UpdateTaskVariables): MutationPromise<UpdateTaskData, UpdateTaskVariables>;

interface UpdateTaskRef {
  ...
  (dc: DataConnect, vars: UpdateTaskVariables): MutationRef<UpdateTaskData, UpdateTaskVariables>;
}
export const updateTaskRef: UpdateTaskRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTaskRef:
```typescript
const name = updateTaskRef.operationName;
console.log(name);
```

### Variables
The `UpdateTask` mutation requires an argument of type `UpdateTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTaskVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      assignedToId?: UUIDString | null;
      assignedToId_expr?: {
      };
        assignedTo?: User_Key | null;
        businessId?: UUIDString | null;
        businessId_expr?: {
        };
          createdAt?: TimestampString | null;
          createdAt_expr?: {
          };
            createdAt_time?: {
              now?: {
              };
                at?: TimestampString | null;
                add?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  sub?: {
                    milliseconds?: number;
                    seconds?: number;
                    minutes?: number;
                    hours?: number;
                    days?: number;
                    weeks?: number;
                    months?: number;
                    years?: number;
                  };
                    truncateTo?: Timestamp_Interval | null;
            };
              createdAt_update?: ({
                inc?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  dec?: {
                    milliseconds?: number;
                    seconds?: number;
                    minutes?: number;
                    hours?: number;
                    days?: number;
                    weeks?: number;
                    months?: number;
                    years?: number;
                  };
              })[];
                createdBy?: UUIDString | null;
                createdBy_expr?: {
                };
                  description?: string | null;
                  description_expr?: {
                  };
                    dueDate?: TimestampString | null;
                    dueDate_expr?: {
                    };
                      dueDate_time?: {
                        now?: {
                        };
                          at?: TimestampString | null;
                          add?: {
                            milliseconds?: number;
                            seconds?: number;
                            minutes?: number;
                            hours?: number;
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            sub?: {
                              milliseconds?: number;
                              seconds?: number;
                              minutes?: number;
                              hours?: number;
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                              truncateTo?: Timestamp_Interval | null;
                      };
                        dueDate_update?: ({
                          inc?: {
                            milliseconds?: number;
                            seconds?: number;
                            minutes?: number;
                            hours?: number;
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            dec?: {
                              milliseconds?: number;
                              seconds?: number;
                              minutes?: number;
                              hours?: number;
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                        })[];
                          priority?: string | null;
                          priority_expr?: {
                          };
                            status?: string | null;
                            status_expr?: {
                            };
                              tenantId?: UUIDString | null;
                              tenantId_expr?: {
                              };
                                title?: string | null;
                                title_expr?: {
                                };
                                  updatedAt?: TimestampString | null;
                                  updatedAt_expr?: {
                                  };
                                    updatedAt_time?: {
                                      now?: {
                                      };
                                        at?: TimestampString | null;
                                        add?: {
                                          milliseconds?: number;
                                          seconds?: number;
                                          minutes?: number;
                                          hours?: number;
                                          days?: number;
                                          weeks?: number;
                                          months?: number;
                                          years?: number;
                                        };
                                          sub?: {
                                            milliseconds?: number;
                                            seconds?: number;
                                            minutes?: number;
                                            hours?: number;
                                            days?: number;
                                            weeks?: number;
                                            months?: number;
                                            years?: number;
                                          };
                                            truncateTo?: Timestamp_Interval | null;
                                    };
                                      updatedAt_update?: ({
                                        inc?: {
                                          milliseconds?: number;
                                          seconds?: number;
                                          minutes?: number;
                                          hours?: number;
                                          days?: number;
                                          weeks?: number;
                                          months?: number;
                                          years?: number;
                                        };
                                          dec?: {
                                            milliseconds?: number;
                                            seconds?: number;
                                            minutes?: number;
                                            hours?: number;
                                            days?: number;
                                            weeks?: number;
                                            months?: number;
                                            years?: number;
                                          };
                                      })[];
  };
}
```
### Return Type
Recall that executing the `UpdateTask` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTaskData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTaskData {
  task_update?: Task_Key | null;
}
```
### Using `UpdateTask`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTask, UpdateTaskVariables } from '@dataconnect/generated';

// The `UpdateTask` mutation requires an argument of type `UpdateTaskVariables`:
const updateTaskVars: UpdateTaskVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateTask()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTask(updateTaskVars);
// Variables can be defined inline as well.
const { data } = await updateTask({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTask(dataConnect, updateTaskVars);

console.log(data.task_update);

// Or, you can use the `Promise` API.
updateTask(updateTaskVars).then((response) => {
  const data = response.data;
  console.log(data.task_update);
});
```

### Using `UpdateTask`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTaskRef, UpdateTaskVariables } from '@dataconnect/generated';

// The `UpdateTask` mutation requires an argument of type `UpdateTaskVariables`:
const updateTaskVars: UpdateTaskVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateTaskRef()` function to get a reference to the mutation.
const ref = updateTaskRef(updateTaskVars);
// Variables can be defined inline as well.
const ref = updateTaskRef({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTaskRef(dataConnect, updateTaskVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.task_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.task_update);
});
```

## DeleteTask
You can execute the `DeleteTask` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteTask(vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;

interface DeleteTaskRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
}
export const deleteTaskRef: DeleteTaskRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteTask(dc: DataConnect, vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;

interface DeleteTaskRef {
  ...
  (dc: DataConnect, vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
}
export const deleteTaskRef: DeleteTaskRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteTaskRef:
```typescript
const name = deleteTaskRef.operationName;
console.log(name);
```

### Variables
The `DeleteTask` mutation requires an argument of type `DeleteTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteTaskVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteTask` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteTaskData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteTaskData {
  task_delete?: Task_Key | null;
}
```
### Using `DeleteTask`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteTask, DeleteTaskVariables } from '@dataconnect/generated';

// The `DeleteTask` mutation requires an argument of type `DeleteTaskVariables`:
const deleteTaskVars: DeleteTaskVariables = {
  id: ..., 
};

// Call the `deleteTask()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteTask(deleteTaskVars);
// Variables can be defined inline as well.
const { data } = await deleteTask({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteTask(dataConnect, deleteTaskVars);

console.log(data.task_delete);

// Or, you can use the `Promise` API.
deleteTask(deleteTaskVars).then((response) => {
  const data = response.data;
  console.log(data.task_delete);
});
```

### Using `DeleteTask`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteTaskRef, DeleteTaskVariables } from '@dataconnect/generated';

// The `DeleteTask` mutation requires an argument of type `DeleteTaskVariables`:
const deleteTaskVars: DeleteTaskVariables = {
  id: ..., 
};

// Call the `deleteTaskRef()` function to get a reference to the mutation.
const ref = deleteTaskRef(deleteTaskVars);
// Variables can be defined inline as well.
const ref = deleteTaskRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteTaskRef(dataConnect, deleteTaskVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.task_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.task_delete);
});
```

## CreateEmployee
You can execute the `CreateEmployee` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createEmployee(vars: CreateEmployeeVariables): MutationPromise<CreateEmployeeData, CreateEmployeeVariables>;

interface CreateEmployeeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEmployeeVariables): MutationRef<CreateEmployeeData, CreateEmployeeVariables>;
}
export const createEmployeeRef: CreateEmployeeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createEmployee(dc: DataConnect, vars: CreateEmployeeVariables): MutationPromise<CreateEmployeeData, CreateEmployeeVariables>;

interface CreateEmployeeRef {
  ...
  (dc: DataConnect, vars: CreateEmployeeVariables): MutationRef<CreateEmployeeData, CreateEmployeeVariables>;
}
export const createEmployeeRef: CreateEmployeeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createEmployeeRef:
```typescript
const name = createEmployeeRef.operationName;
console.log(name);
```

### Variables
The `CreateEmployee` mutation requires an argument of type `CreateEmployeeVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateEmployeeVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              department?: string | null;
              department_expr?: {
              };
                fullName?: string | null;
                fullName_expr?: {
                };
                  position?: string | null;
                  position_expr?: {
                  };
                    salary?: number | null;
                    salary_expr?: {
                    };
                      salary_update?: ({
                        inc?: number | null;
                        dec?: number | null;
                      })[];
                        startDate?: DateString | null;
                        startDate_expr?: {
                        };
                          startDate_date?: {
                            today?: {
                            };
                              on?: DateString | null;
                              add?: {
                                days?: number;
                                weeks?: number;
                                months?: number;
                                years?: number;
                              };
                                sub?: {
                                  days?: number;
                                  weeks?: number;
                                  months?: number;
                                  years?: number;
                                };
                                  truncateTo?: Date_Interval | null;
                          };
                            startDate_update?: ({
                              inc?: {
                                days?: number;
                                weeks?: number;
                                months?: number;
                                years?: number;
                              };
                                dec?: {
                                  days?: number;
                                  weeks?: number;
                                  months?: number;
                                  years?: number;
                                };
                            })[];
                              status?: string | null;
                              status_expr?: {
                              };
                                tenantId?: UUIDString | null;
                                tenantId_expr?: {
                                };
  };
}
```
### Return Type
Recall that executing the `CreateEmployee` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateEmployeeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateEmployeeData {
  employee_insert: Employee_Key;
}
```
### Using `CreateEmployee`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createEmployee, CreateEmployeeVariables } from '@dataconnect/generated';

// The `CreateEmployee` mutation requires an argument of type `CreateEmployeeVariables`:
const createEmployeeVars: CreateEmployeeVariables = {
  data: ..., 
};

// Call the `createEmployee()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createEmployee(createEmployeeVars);
// Variables can be defined inline as well.
const { data } = await createEmployee({ data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createEmployee(dataConnect, createEmployeeVars);

console.log(data.employee_insert);

// Or, you can use the `Promise` API.
createEmployee(createEmployeeVars).then((response) => {
  const data = response.data;
  console.log(data.employee_insert);
});
```

### Using `CreateEmployee`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createEmployeeRef, CreateEmployeeVariables } from '@dataconnect/generated';

// The `CreateEmployee` mutation requires an argument of type `CreateEmployeeVariables`:
const createEmployeeVars: CreateEmployeeVariables = {
  data: ..., 
};

// Call the `createEmployeeRef()` function to get a reference to the mutation.
const ref = createEmployeeRef(createEmployeeVars);
// Variables can be defined inline as well.
const ref = createEmployeeRef({ data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createEmployeeRef(dataConnect, createEmployeeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.employee_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.employee_insert);
});
```

## UpdateEmployee
You can execute the `UpdateEmployee` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateEmployee(vars: UpdateEmployeeVariables): MutationPromise<UpdateEmployeeData, UpdateEmployeeVariables>;

interface UpdateEmployeeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEmployeeVariables): MutationRef<UpdateEmployeeData, UpdateEmployeeVariables>;
}
export const updateEmployeeRef: UpdateEmployeeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateEmployee(dc: DataConnect, vars: UpdateEmployeeVariables): MutationPromise<UpdateEmployeeData, UpdateEmployeeVariables>;

interface UpdateEmployeeRef {
  ...
  (dc: DataConnect, vars: UpdateEmployeeVariables): MutationRef<UpdateEmployeeData, UpdateEmployeeVariables>;
}
export const updateEmployeeRef: UpdateEmployeeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateEmployeeRef:
```typescript
const name = updateEmployeeRef.operationName;
console.log(name);
```

### Variables
The `UpdateEmployee` mutation requires an argument of type `UpdateEmployeeVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateEmployeeVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              department?: string | null;
              department_expr?: {
              };
                fullName?: string | null;
                fullName_expr?: {
                };
                  position?: string | null;
                  position_expr?: {
                  };
                    salary?: number | null;
                    salary_expr?: {
                    };
                      salary_update?: ({
                        inc?: number | null;
                        dec?: number | null;
                      })[];
                        startDate?: DateString | null;
                        startDate_expr?: {
                        };
                          startDate_date?: {
                            today?: {
                            };
                              on?: DateString | null;
                              add?: {
                                days?: number;
                                weeks?: number;
                                months?: number;
                                years?: number;
                              };
                                sub?: {
                                  days?: number;
                                  weeks?: number;
                                  months?: number;
                                  years?: number;
                                };
                                  truncateTo?: Date_Interval | null;
                          };
                            startDate_update?: ({
                              inc?: {
                                days?: number;
                                weeks?: number;
                                months?: number;
                                years?: number;
                              };
                                dec?: {
                                  days?: number;
                                  weeks?: number;
                                  months?: number;
                                  years?: number;
                                };
                            })[];
                              status?: string | null;
                              status_expr?: {
                              };
                                tenantId?: UUIDString | null;
                                tenantId_expr?: {
                                };
  };
}
```
### Return Type
Recall that executing the `UpdateEmployee` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateEmployeeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateEmployeeData {
  employee_update?: Employee_Key | null;
}
```
### Using `UpdateEmployee`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateEmployee, UpdateEmployeeVariables } from '@dataconnect/generated';

// The `UpdateEmployee` mutation requires an argument of type `UpdateEmployeeVariables`:
const updateEmployeeVars: UpdateEmployeeVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateEmployee()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEmployee(updateEmployeeVars);
// Variables can be defined inline as well.
const { data } = await updateEmployee({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateEmployee(dataConnect, updateEmployeeVars);

console.log(data.employee_update);

// Or, you can use the `Promise` API.
updateEmployee(updateEmployeeVars).then((response) => {
  const data = response.data;
  console.log(data.employee_update);
});
```

### Using `UpdateEmployee`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateEmployeeRef, UpdateEmployeeVariables } from '@dataconnect/generated';

// The `UpdateEmployee` mutation requires an argument of type `UpdateEmployeeVariables`:
const updateEmployeeVars: UpdateEmployeeVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateEmployeeRef()` function to get a reference to the mutation.
const ref = updateEmployeeRef(updateEmployeeVars);
// Variables can be defined inline as well.
const ref = updateEmployeeRef({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateEmployeeRef(dataConnect, updateEmployeeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.employee_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.employee_update);
});
```

## DeleteEmployee
You can execute the `DeleteEmployee` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteEmployee(vars: DeleteEmployeeVariables): MutationPromise<DeleteEmployeeData, DeleteEmployeeVariables>;

interface DeleteEmployeeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteEmployeeVariables): MutationRef<DeleteEmployeeData, DeleteEmployeeVariables>;
}
export const deleteEmployeeRef: DeleteEmployeeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteEmployee(dc: DataConnect, vars: DeleteEmployeeVariables): MutationPromise<DeleteEmployeeData, DeleteEmployeeVariables>;

interface DeleteEmployeeRef {
  ...
  (dc: DataConnect, vars: DeleteEmployeeVariables): MutationRef<DeleteEmployeeData, DeleteEmployeeVariables>;
}
export const deleteEmployeeRef: DeleteEmployeeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteEmployeeRef:
```typescript
const name = deleteEmployeeRef.operationName;
console.log(name);
```

### Variables
The `DeleteEmployee` mutation requires an argument of type `DeleteEmployeeVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteEmployeeVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteEmployee` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteEmployeeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteEmployeeData {
  employee_delete?: Employee_Key | null;
}
```
### Using `DeleteEmployee`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteEmployee, DeleteEmployeeVariables } from '@dataconnect/generated';

// The `DeleteEmployee` mutation requires an argument of type `DeleteEmployeeVariables`:
const deleteEmployeeVars: DeleteEmployeeVariables = {
  id: ..., 
};

// Call the `deleteEmployee()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteEmployee(deleteEmployeeVars);
// Variables can be defined inline as well.
const { data } = await deleteEmployee({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteEmployee(dataConnect, deleteEmployeeVars);

console.log(data.employee_delete);

// Or, you can use the `Promise` API.
deleteEmployee(deleteEmployeeVars).then((response) => {
  const data = response.data;
  console.log(data.employee_delete);
});
```

### Using `DeleteEmployee`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteEmployeeRef, DeleteEmployeeVariables } from '@dataconnect/generated';

// The `DeleteEmployee` mutation requires an argument of type `DeleteEmployeeVariables`:
const deleteEmployeeVars: DeleteEmployeeVariables = {
  id: ..., 
};

// Call the `deleteEmployeeRef()` function to get a reference to the mutation.
const ref = deleteEmployeeRef(deleteEmployeeVars);
// Variables can be defined inline as well.
const ref = deleteEmployeeRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteEmployeeRef(dataConnect, deleteEmployeeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.employee_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.employee_delete);
});
```

## CreateCustomer
You can execute the `CreateCustomer` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createCustomer(vars: CreateCustomerVariables): MutationPromise<CreateCustomerData, CreateCustomerVariables>;

interface CreateCustomerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCustomerVariables): MutationRef<CreateCustomerData, CreateCustomerVariables>;
}
export const createCustomerRef: CreateCustomerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCustomer(dc: DataConnect, vars: CreateCustomerVariables): MutationPromise<CreateCustomerData, CreateCustomerVariables>;

interface CreateCustomerRef {
  ...
  (dc: DataConnect, vars: CreateCustomerVariables): MutationRef<CreateCustomerData, CreateCustomerVariables>;
}
export const createCustomerRef: CreateCustomerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCustomerRef:
```typescript
const name = createCustomerRef.operationName;
console.log(name);
```

### Variables
The `CreateCustomer` mutation requires an argument of type `CreateCustomerVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCustomerVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              customerName?: string | null;
              customerName_expr?: {
              };
                email?: string | null;
                email_expr?: {
                };
                  phoneNumber?: string | null;
                  phoneNumber_expr?: {
                  };
                    tenantId?: UUIDString | null;
                    tenantId_expr?: {
                    };
  };
}
```
### Return Type
Recall that executing the `CreateCustomer` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCustomerData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCustomerData {
  customer_insert: Customer_Key;
}
```
### Using `CreateCustomer`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCustomer, CreateCustomerVariables } from '@dataconnect/generated';

// The `CreateCustomer` mutation requires an argument of type `CreateCustomerVariables`:
const createCustomerVars: CreateCustomerVariables = {
  data: ..., 
};

// Call the `createCustomer()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCustomer(createCustomerVars);
// Variables can be defined inline as well.
const { data } = await createCustomer({ data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCustomer(dataConnect, createCustomerVars);

console.log(data.customer_insert);

// Or, you can use the `Promise` API.
createCustomer(createCustomerVars).then((response) => {
  const data = response.data;
  console.log(data.customer_insert);
});
```

### Using `CreateCustomer`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCustomerRef, CreateCustomerVariables } from '@dataconnect/generated';

// The `CreateCustomer` mutation requires an argument of type `CreateCustomerVariables`:
const createCustomerVars: CreateCustomerVariables = {
  data: ..., 
};

// Call the `createCustomerRef()` function to get a reference to the mutation.
const ref = createCustomerRef(createCustomerVars);
// Variables can be defined inline as well.
const ref = createCustomerRef({ data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCustomerRef(dataConnect, createCustomerVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.customer_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.customer_insert);
});
```

## UpdateCustomer
You can execute the `UpdateCustomer` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateCustomer(vars: UpdateCustomerVariables): MutationPromise<UpdateCustomerData, UpdateCustomerVariables>;

interface UpdateCustomerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCustomerVariables): MutationRef<UpdateCustomerData, UpdateCustomerVariables>;
}
export const updateCustomerRef: UpdateCustomerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateCustomer(dc: DataConnect, vars: UpdateCustomerVariables): MutationPromise<UpdateCustomerData, UpdateCustomerVariables>;

interface UpdateCustomerRef {
  ...
  (dc: DataConnect, vars: UpdateCustomerVariables): MutationRef<UpdateCustomerData, UpdateCustomerVariables>;
}
export const updateCustomerRef: UpdateCustomerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateCustomerRef:
```typescript
const name = updateCustomerRef.operationName;
console.log(name);
```

### Variables
The `UpdateCustomer` mutation requires an argument of type `UpdateCustomerVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateCustomerVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              customerName?: string | null;
              customerName_expr?: {
              };
                email?: string | null;
                email_expr?: {
                };
                  phoneNumber?: string | null;
                  phoneNumber_expr?: {
                  };
                    tenantId?: UUIDString | null;
                    tenantId_expr?: {
                    };
  };
}
```
### Return Type
Recall that executing the `UpdateCustomer` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateCustomerData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateCustomerData {
  customer_update?: Customer_Key | null;
}
```
### Using `UpdateCustomer`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCustomer, UpdateCustomerVariables } from '@dataconnect/generated';

// The `UpdateCustomer` mutation requires an argument of type `UpdateCustomerVariables`:
const updateCustomerVars: UpdateCustomerVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateCustomer()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCustomer(updateCustomerVars);
// Variables can be defined inline as well.
const { data } = await updateCustomer({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCustomer(dataConnect, updateCustomerVars);

console.log(data.customer_update);

// Or, you can use the `Promise` API.
updateCustomer(updateCustomerVars).then((response) => {
  const data = response.data;
  console.log(data.customer_update);
});
```

### Using `UpdateCustomer`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateCustomerRef, UpdateCustomerVariables } from '@dataconnect/generated';

// The `UpdateCustomer` mutation requires an argument of type `UpdateCustomerVariables`:
const updateCustomerVars: UpdateCustomerVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateCustomerRef()` function to get a reference to the mutation.
const ref = updateCustomerRef(updateCustomerVars);
// Variables can be defined inline as well.
const ref = updateCustomerRef({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateCustomerRef(dataConnect, updateCustomerVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.customer_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.customer_update);
});
```

## DeleteCustomer
You can execute the `DeleteCustomer` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteCustomer(vars: DeleteCustomerVariables): MutationPromise<DeleteCustomerData, DeleteCustomerVariables>;

interface DeleteCustomerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCustomerVariables): MutationRef<DeleteCustomerData, DeleteCustomerVariables>;
}
export const deleteCustomerRef: DeleteCustomerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteCustomer(dc: DataConnect, vars: DeleteCustomerVariables): MutationPromise<DeleteCustomerData, DeleteCustomerVariables>;

interface DeleteCustomerRef {
  ...
  (dc: DataConnect, vars: DeleteCustomerVariables): MutationRef<DeleteCustomerData, DeleteCustomerVariables>;
}
export const deleteCustomerRef: DeleteCustomerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCustomerRef:
```typescript
const name = deleteCustomerRef.operationName;
console.log(name);
```

### Variables
The `DeleteCustomer` mutation requires an argument of type `DeleteCustomerVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteCustomerVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteCustomer` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCustomerData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCustomerData {
  customer_delete?: Customer_Key | null;
}
```
### Using `DeleteCustomer`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteCustomer, DeleteCustomerVariables } from '@dataconnect/generated';

// The `DeleteCustomer` mutation requires an argument of type `DeleteCustomerVariables`:
const deleteCustomerVars: DeleteCustomerVariables = {
  id: ..., 
};

// Call the `deleteCustomer()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteCustomer(deleteCustomerVars);
// Variables can be defined inline as well.
const { data } = await deleteCustomer({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteCustomer(dataConnect, deleteCustomerVars);

console.log(data.customer_delete);

// Or, you can use the `Promise` API.
deleteCustomer(deleteCustomerVars).then((response) => {
  const data = response.data;
  console.log(data.customer_delete);
});
```

### Using `DeleteCustomer`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCustomerRef, DeleteCustomerVariables } from '@dataconnect/generated';

// The `DeleteCustomer` mutation requires an argument of type `DeleteCustomerVariables`:
const deleteCustomerVars: DeleteCustomerVariables = {
  id: ..., 
};

// Call the `deleteCustomerRef()` function to get a reference to the mutation.
const ref = deleteCustomerRef(deleteCustomerVars);
// Variables can be defined inline as well.
const ref = deleteCustomerRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCustomerRef(dataConnect, deleteCustomerVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.customer_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.customer_delete);
});
```

## CreateSupplier
You can execute the `CreateSupplier` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createSupplier(vars: CreateSupplierVariables): MutationPromise<CreateSupplierData, CreateSupplierVariables>;

interface CreateSupplierRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSupplierVariables): MutationRef<CreateSupplierData, CreateSupplierVariables>;
}
export const createSupplierRef: CreateSupplierRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSupplier(dc: DataConnect, vars: CreateSupplierVariables): MutationPromise<CreateSupplierData, CreateSupplierVariables>;

interface CreateSupplierRef {
  ...
  (dc: DataConnect, vars: CreateSupplierVariables): MutationRef<CreateSupplierData, CreateSupplierVariables>;
}
export const createSupplierRef: CreateSupplierRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSupplierRef:
```typescript
const name = createSupplierRef.operationName;
console.log(name);
```

### Variables
The `CreateSupplier` mutation requires an argument of type `CreateSupplierVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateSupplierVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              email?: string | null;
              email_expr?: {
              };
                phoneNumber?: string | null;
                phoneNumber_expr?: {
                };
                  supplierName?: string | null;
                  supplierName_expr?: {
                  };
                    tenantId?: UUIDString | null;
                    tenantId_expr?: {
                    };
  };
}
```
### Return Type
Recall that executing the `CreateSupplier` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSupplierData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSupplierData {
  supplier_insert: Supplier_Key;
}
```
### Using `CreateSupplier`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSupplier, CreateSupplierVariables } from '@dataconnect/generated';

// The `CreateSupplier` mutation requires an argument of type `CreateSupplierVariables`:
const createSupplierVars: CreateSupplierVariables = {
  data: ..., 
};

// Call the `createSupplier()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSupplier(createSupplierVars);
// Variables can be defined inline as well.
const { data } = await createSupplier({ data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSupplier(dataConnect, createSupplierVars);

console.log(data.supplier_insert);

// Or, you can use the `Promise` API.
createSupplier(createSupplierVars).then((response) => {
  const data = response.data;
  console.log(data.supplier_insert);
});
```

### Using `CreateSupplier`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSupplierRef, CreateSupplierVariables } from '@dataconnect/generated';

// The `CreateSupplier` mutation requires an argument of type `CreateSupplierVariables`:
const createSupplierVars: CreateSupplierVariables = {
  data: ..., 
};

// Call the `createSupplierRef()` function to get a reference to the mutation.
const ref = createSupplierRef(createSupplierVars);
// Variables can be defined inline as well.
const ref = createSupplierRef({ data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSupplierRef(dataConnect, createSupplierVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.supplier_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.supplier_insert);
});
```

## UpdateSupplier
You can execute the `UpdateSupplier` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateSupplier(vars: UpdateSupplierVariables): MutationPromise<UpdateSupplierData, UpdateSupplierVariables>;

interface UpdateSupplierRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSupplierVariables): MutationRef<UpdateSupplierData, UpdateSupplierVariables>;
}
export const updateSupplierRef: UpdateSupplierRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateSupplier(dc: DataConnect, vars: UpdateSupplierVariables): MutationPromise<UpdateSupplierData, UpdateSupplierVariables>;

interface UpdateSupplierRef {
  ...
  (dc: DataConnect, vars: UpdateSupplierVariables): MutationRef<UpdateSupplierData, UpdateSupplierVariables>;
}
export const updateSupplierRef: UpdateSupplierRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateSupplierRef:
```typescript
const name = updateSupplierRef.operationName;
console.log(name);
```

### Variables
The `UpdateSupplier` mutation requires an argument of type `UpdateSupplierVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateSupplierVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        createdAt?: TimestampString | null;
        createdAt_expr?: {
        };
          createdAt_time?: {
            now?: {
            };
              at?: TimestampString | null;
              add?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                sub?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  truncateTo?: Timestamp_Interval | null;
          };
            createdAt_update?: ({
              inc?: {
                milliseconds?: number;
                seconds?: number;
                minutes?: number;
                hours?: number;
                days?: number;
                weeks?: number;
                months?: number;
                years?: number;
              };
                dec?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
            })[];
              email?: string | null;
              email_expr?: {
              };
                phoneNumber?: string | null;
                phoneNumber_expr?: {
                };
                  supplierName?: string | null;
                  supplierName_expr?: {
                  };
                    tenantId?: UUIDString | null;
                    tenantId_expr?: {
                    };
  };
}
```
### Return Type
Recall that executing the `UpdateSupplier` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateSupplierData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateSupplierData {
  supplier_update?: Supplier_Key | null;
}
```
### Using `UpdateSupplier`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateSupplier, UpdateSupplierVariables } from '@dataconnect/generated';

// The `UpdateSupplier` mutation requires an argument of type `UpdateSupplierVariables`:
const updateSupplierVars: UpdateSupplierVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateSupplier()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateSupplier(updateSupplierVars);
// Variables can be defined inline as well.
const { data } = await updateSupplier({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateSupplier(dataConnect, updateSupplierVars);

console.log(data.supplier_update);

// Or, you can use the `Promise` API.
updateSupplier(updateSupplierVars).then((response) => {
  const data = response.data;
  console.log(data.supplier_update);
});
```

### Using `UpdateSupplier`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateSupplierRef, UpdateSupplierVariables } from '@dataconnect/generated';

// The `UpdateSupplier` mutation requires an argument of type `UpdateSupplierVariables`:
const updateSupplierVars: UpdateSupplierVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateSupplierRef()` function to get a reference to the mutation.
const ref = updateSupplierRef(updateSupplierVars);
// Variables can be defined inline as well.
const ref = updateSupplierRef({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateSupplierRef(dataConnect, updateSupplierVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.supplier_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.supplier_update);
});
```

## DeleteSupplier
You can execute the `DeleteSupplier` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteSupplier(vars: DeleteSupplierVariables): MutationPromise<DeleteSupplierData, DeleteSupplierVariables>;

interface DeleteSupplierRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSupplierVariables): MutationRef<DeleteSupplierData, DeleteSupplierVariables>;
}
export const deleteSupplierRef: DeleteSupplierRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSupplier(dc: DataConnect, vars: DeleteSupplierVariables): MutationPromise<DeleteSupplierData, DeleteSupplierVariables>;

interface DeleteSupplierRef {
  ...
  (dc: DataConnect, vars: DeleteSupplierVariables): MutationRef<DeleteSupplierData, DeleteSupplierVariables>;
}
export const deleteSupplierRef: DeleteSupplierRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSupplierRef:
```typescript
const name = deleteSupplierRef.operationName;
console.log(name);
```

### Variables
The `DeleteSupplier` mutation requires an argument of type `DeleteSupplierVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSupplierVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteSupplier` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSupplierData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSupplierData {
  supplier_delete?: Supplier_Key | null;
}
```
### Using `DeleteSupplier`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSupplier, DeleteSupplierVariables } from '@dataconnect/generated';

// The `DeleteSupplier` mutation requires an argument of type `DeleteSupplierVariables`:
const deleteSupplierVars: DeleteSupplierVariables = {
  id: ..., 
};

// Call the `deleteSupplier()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSupplier(deleteSupplierVars);
// Variables can be defined inline as well.
const { data } = await deleteSupplier({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSupplier(dataConnect, deleteSupplierVars);

console.log(data.supplier_delete);

// Or, you can use the `Promise` API.
deleteSupplier(deleteSupplierVars).then((response) => {
  const data = response.data;
  console.log(data.supplier_delete);
});
```

### Using `DeleteSupplier`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSupplierRef, DeleteSupplierVariables } from '@dataconnect/generated';

// The `DeleteSupplier` mutation requires an argument of type `DeleteSupplierVariables`:
const deleteSupplierVars: DeleteSupplierVariables = {
  id: ..., 
};

// Call the `deleteSupplierRef()` function to get a reference to the mutation.
const ref = deleteSupplierRef(deleteSupplierVars);
// Variables can be defined inline as well.
const ref = deleteSupplierRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSupplierRef(dataConnect, deleteSupplierVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.supplier_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.supplier_delete);
});
```

## CreateDocument
You can execute the `CreateDocument` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createDocument(vars: CreateDocumentVariables): MutationPromise<CreateDocumentData, CreateDocumentVariables>;

interface CreateDocumentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDocumentVariables): MutationRef<CreateDocumentData, CreateDocumentVariables>;
}
export const createDocumentRef: CreateDocumentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDocument(dc: DataConnect, vars: CreateDocumentVariables): MutationPromise<CreateDocumentData, CreateDocumentVariables>;

interface CreateDocumentRef {
  ...
  (dc: DataConnect, vars: CreateDocumentVariables): MutationRef<CreateDocumentData, CreateDocumentVariables>;
}
export const createDocumentRef: CreateDocumentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDocumentRef:
```typescript
const name = createDocumentRef.operationName;
console.log(name);
```

### Variables
The `CreateDocument` mutation requires an argument of type `CreateDocumentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateDocumentVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        documentType?: string | null;
        documentType_expr?: {
        };
          fileUrl?: string | null;
          fileUrl_expr?: {
          };
            tenantId?: UUIDString | null;
            tenantId_expr?: {
            };
              title?: string | null;
              title_expr?: {
              };
                uploadedAt?: TimestampString | null;
                uploadedAt_expr?: {
                };
                  uploadedAt_time?: {
                    now?: {
                    };
                      at?: TimestampString | null;
                      add?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                        sub?: {
                          milliseconds?: number;
                          seconds?: number;
                          minutes?: number;
                          hours?: number;
                          days?: number;
                          weeks?: number;
                          months?: number;
                          years?: number;
                        };
                          truncateTo?: Timestamp_Interval | null;
                  };
                    uploadedAt_update?: ({
                      inc?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                        dec?: {
                          milliseconds?: number;
                          seconds?: number;
                          minutes?: number;
                          hours?: number;
                          days?: number;
                          weeks?: number;
                          months?: number;
                          years?: number;
                        };
                    })[];
                      uploadedBy?: UUIDString | null;
                      uploadedBy_expr?: {
                      };
  };
}
```
### Return Type
Recall that executing the `CreateDocument` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDocumentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDocumentData {
  document_insert: Document_Key;
}
```
### Using `CreateDocument`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDocument, CreateDocumentVariables } from '@dataconnect/generated';

// The `CreateDocument` mutation requires an argument of type `CreateDocumentVariables`:
const createDocumentVars: CreateDocumentVariables = {
  data: ..., 
};

// Call the `createDocument()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDocument(createDocumentVars);
// Variables can be defined inline as well.
const { data } = await createDocument({ data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDocument(dataConnect, createDocumentVars);

console.log(data.document_insert);

// Or, you can use the `Promise` API.
createDocument(createDocumentVars).then((response) => {
  const data = response.data;
  console.log(data.document_insert);
});
```

### Using `CreateDocument`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDocumentRef, CreateDocumentVariables } from '@dataconnect/generated';

// The `CreateDocument` mutation requires an argument of type `CreateDocumentVariables`:
const createDocumentVars: CreateDocumentVariables = {
  data: ..., 
};

// Call the `createDocumentRef()` function to get a reference to the mutation.
const ref = createDocumentRef(createDocumentVars);
// Variables can be defined inline as well.
const ref = createDocumentRef({ data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDocumentRef(dataConnect, createDocumentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.document_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.document_insert);
});
```

## UpdateDocument
You can execute the `UpdateDocument` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateDocument(vars: UpdateDocumentVariables): MutationPromise<UpdateDocumentData, UpdateDocumentVariables>;

interface UpdateDocumentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDocumentVariables): MutationRef<UpdateDocumentData, UpdateDocumentVariables>;
}
export const updateDocumentRef: UpdateDocumentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateDocument(dc: DataConnect, vars: UpdateDocumentVariables): MutationPromise<UpdateDocumentData, UpdateDocumentVariables>;

interface UpdateDocumentRef {
  ...
  (dc: DataConnect, vars: UpdateDocumentVariables): MutationRef<UpdateDocumentData, UpdateDocumentVariables>;
}
export const updateDocumentRef: UpdateDocumentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateDocumentRef:
```typescript
const name = updateDocumentRef.operationName;
console.log(name);
```

### Variables
The `UpdateDocument` mutation requires an argument of type `UpdateDocumentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateDocumentVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      businessId?: UUIDString | null;
      businessId_expr?: {
      };
        documentType?: string | null;
        documentType_expr?: {
        };
          fileUrl?: string | null;
          fileUrl_expr?: {
          };
            tenantId?: UUIDString | null;
            tenantId_expr?: {
            };
              title?: string | null;
              title_expr?: {
              };
                uploadedAt?: TimestampString | null;
                uploadedAt_expr?: {
                };
                  uploadedAt_time?: {
                    now?: {
                    };
                      at?: TimestampString | null;
                      add?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                        sub?: {
                          milliseconds?: number;
                          seconds?: number;
                          minutes?: number;
                          hours?: number;
                          days?: number;
                          weeks?: number;
                          months?: number;
                          years?: number;
                        };
                          truncateTo?: Timestamp_Interval | null;
                  };
                    uploadedAt_update?: ({
                      inc?: {
                        milliseconds?: number;
                        seconds?: number;
                        minutes?: number;
                        hours?: number;
                        days?: number;
                        weeks?: number;
                        months?: number;
                        years?: number;
                      };
                        dec?: {
                          milliseconds?: number;
                          seconds?: number;
                          minutes?: number;
                          hours?: number;
                          days?: number;
                          weeks?: number;
                          months?: number;
                          years?: number;
                        };
                    })[];
                      uploadedBy?: UUIDString | null;
                      uploadedBy_expr?: {
                      };
  };
}
```
### Return Type
Recall that executing the `UpdateDocument` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateDocumentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateDocumentData {
  document_update?: Document_Key | null;
}
```
### Using `UpdateDocument`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateDocument, UpdateDocumentVariables } from '@dataconnect/generated';

// The `UpdateDocument` mutation requires an argument of type `UpdateDocumentVariables`:
const updateDocumentVars: UpdateDocumentVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateDocument()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateDocument(updateDocumentVars);
// Variables can be defined inline as well.
const { data } = await updateDocument({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateDocument(dataConnect, updateDocumentVars);

console.log(data.document_update);

// Or, you can use the `Promise` API.
updateDocument(updateDocumentVars).then((response) => {
  const data = response.data;
  console.log(data.document_update);
});
```

### Using `UpdateDocument`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateDocumentRef, UpdateDocumentVariables } from '@dataconnect/generated';

// The `UpdateDocument` mutation requires an argument of type `UpdateDocumentVariables`:
const updateDocumentVars: UpdateDocumentVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateDocumentRef()` function to get a reference to the mutation.
const ref = updateDocumentRef(updateDocumentVars);
// Variables can be defined inline as well.
const ref = updateDocumentRef({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateDocumentRef(dataConnect, updateDocumentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.document_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.document_update);
});
```

## DeleteDocument
You can execute the `DeleteDocument` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteDocument(vars: DeleteDocumentVariables): MutationPromise<DeleteDocumentData, DeleteDocumentVariables>;

interface DeleteDocumentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteDocumentVariables): MutationRef<DeleteDocumentData, DeleteDocumentVariables>;
}
export const deleteDocumentRef: DeleteDocumentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteDocument(dc: DataConnect, vars: DeleteDocumentVariables): MutationPromise<DeleteDocumentData, DeleteDocumentVariables>;

interface DeleteDocumentRef {
  ...
  (dc: DataConnect, vars: DeleteDocumentVariables): MutationRef<DeleteDocumentData, DeleteDocumentVariables>;
}
export const deleteDocumentRef: DeleteDocumentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteDocumentRef:
```typescript
const name = deleteDocumentRef.operationName;
console.log(name);
```

### Variables
The `DeleteDocument` mutation requires an argument of type `DeleteDocumentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteDocumentVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteDocument` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteDocumentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteDocumentData {
  document_delete?: Document_Key | null;
}
```
### Using `DeleteDocument`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteDocument, DeleteDocumentVariables } from '@dataconnect/generated';

// The `DeleteDocument` mutation requires an argument of type `DeleteDocumentVariables`:
const deleteDocumentVars: DeleteDocumentVariables = {
  id: ..., 
};

// Call the `deleteDocument()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteDocument(deleteDocumentVars);
// Variables can be defined inline as well.
const { data } = await deleteDocument({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteDocument(dataConnect, deleteDocumentVars);

console.log(data.document_delete);

// Or, you can use the `Promise` API.
deleteDocument(deleteDocumentVars).then((response) => {
  const data = response.data;
  console.log(data.document_delete);
});
```

### Using `DeleteDocument`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteDocumentRef, DeleteDocumentVariables } from '@dataconnect/generated';

// The `DeleteDocument` mutation requires an argument of type `DeleteDocumentVariables`:
const deleteDocumentVars: DeleteDocumentVariables = {
  id: ..., 
};

// Call the `deleteDocumentRef()` function to get a reference to the mutation.
const ref = deleteDocumentRef(deleteDocumentVars);
// Variables can be defined inline as well.
const ref = deleteDocumentRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteDocumentRef(dataConnect, deleteDocumentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.document_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.document_delete);
>>>>>>> 546aacf70afe81cbee3ea5f2edbc661c271990b8
});
```

