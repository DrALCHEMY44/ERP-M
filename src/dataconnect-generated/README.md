# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListTenants*](#listtenants)
  - [*ListUsers*](#listusers)
  - [*ListBusinesses*](#listbusinesses)
  - [*getUserByEmail*](#getuserbyemail)
  - [*listProductsByBusiness*](#listproductsbybusiness)
  - [*listCustomersByBusiness*](#listcustomersbybusiness)
  - [*listUsersByBusiness*](#listusersbybusiness)
  - [*listSuppliersByBusiness*](#listsuppliersbybusiness)
  - [*listTasksByBusiness*](#listtasksbybusiness)
  - [*listTransactionsByBusiness*](#listtransactionsbybusiness)
  - [*listTransactionsByType*](#listtransactionsbytype)
  - [*listEmployeesByBusiness*](#listemployeesbybusiness)
  - [*listDocumentsByBusiness*](#listdocumentsbybusiness)
  - [*listActivityLogsByUser*](#listactivitylogsbyuser)
  - [*listActivityLogsByBusiness*](#listactivitylogsbybusiness)
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
  - [*CreateTaskComment*](#createtaskcomment)
  - [*UpdateTaskComment*](#updatetaskcomment)
  - [*DeleteTaskComment*](#deletetaskcomment)
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
  - [*CreateActivityLog*](#createactivitylog)
  - [*UpdateActivityLog*](#updateactivitylog)
  - [*DeleteActivityLog*](#deleteactivitylog)
  - [*CreateAiQuery*](#createaiquery)
  - [*UpdateAiQuery*](#updateaiquery)
  - [*DeleteAiQuery*](#deleteaiquery)
  - [*CreateNotification*](#createnotification)
  - [*UpdateNotification*](#updatenotification)
  - [*DeleteNotification*](#deletenotification)
  - [*CreateTask*](#createtask)
  - [*UpdateTask*](#updatetask)
  - [*DeleteTask*](#deletetask)

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

## ListTenants
You can execute the `ListTenants` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listTenants(options?: ExecuteQueryOptions): QueryPromise<ListTenantsData, undefined>;

interface ListTenantsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTenantsData, undefined>;
}
export const listTenantsRef: ListTenantsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTenants(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListTenantsData, undefined>;

interface ListTenantsRef {
  ...
  (dc: DataConnect): QueryRef<ListTenantsData, undefined>;
}
export const listTenantsRef: ListTenantsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTenantsRef:
```typescript
const name = listTenantsRef.operationName;
console.log(name);
```

### Variables
The `ListTenants` query has no variables.
### Return Type
Recall that executing the `ListTenants` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTenantsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListTenantsData {
  tenants: ({
    id: string;
    name: string;
    businessSector: string;
    location: string;
    ownerEmail: string;
    taxId?: string | null;
    logoUrl?: string | null;
    subscriptionTier?: string | null;
    status?: string | null;
    createdAt: TimestampString;
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

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.tenants);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.tenants);
});
```

## ListUsers
You can execute the `ListUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUsersRef:
```typescript
const name = listUsersRef.operationName;
console.log(name);
```

### Variables
The `ListUsers` query has no variables.
### Return Type
Recall that executing the `ListUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUsersData {
  users: ({
    id: string;
  } & User_Key)[];
}
```
### Using `ListUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUsers } from '@dataconnect/generated';


// Call the `listUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUsersRef } from '@dataconnect/generated';


// Call the `listUsersRef()` function to get a reference to the query.
const ref = listUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUsersRef(dataConnect);

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

## ListBusinesses
You can execute the `ListBusinesses` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listBusinesses(vars: ListBusinessesVariables, options?: ExecuteQueryOptions): QueryPromise<ListBusinessesData, ListBusinessesVariables>;

interface ListBusinessesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListBusinessesVariables): QueryRef<ListBusinessesData, ListBusinessesVariables>;
}
export const listBusinessesRef: ListBusinessesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listBusinesses(dc: DataConnect, vars: ListBusinessesVariables, options?: ExecuteQueryOptions): QueryPromise<ListBusinessesData, ListBusinessesVariables>;

interface ListBusinessesRef {
  ...
  (dc: DataConnect, vars: ListBusinessesVariables): QueryRef<ListBusinessesData, ListBusinessesVariables>;
}
export const listBusinessesRef: ListBusinessesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listBusinessesRef:
```typescript
const name = listBusinessesRef.operationName;
console.log(name);
```

### Variables
The `ListBusinesses` query requires an argument of type `ListBusinessesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListBusinessesVariables {
  tenantId: string;
}
```
### Return Type
Recall that executing the `ListBusinesses` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListBusinessesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListBusinessesData {
  businesses: ({
    id: string;
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

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.businesses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.businesses);
});
```

## getUserByEmail
You can execute the `getUserByEmail` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserByEmail(vars: GetUserByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

interface GetUserByEmailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
}
export const getUserByEmailRef: GetUserByEmailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserByEmail(dc: DataConnect, vars: GetUserByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

interface GetUserByEmailRef {
  ...
  (dc: DataConnect, vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
}
export const getUserByEmailRef: GetUserByEmailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserByEmailRef:
```typescript
const name = getUserByEmailRef.operationName;
console.log(name);
```

### Variables
The `getUserByEmail` query requires an argument of type `GetUserByEmailVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserByEmailVariables {
  email: string;
}
```
### Return Type
Recall that executing the `getUserByEmail` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserByEmailData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserByEmailData {
  users: ({
    id: string;
    email: string;
    role: string;
    department?: string | null;
    phoneNumber?: string | null;
    createdAt: TimestampString;
    tenantId: string;
    businessId: string;
    fullName?: string | null;
  } & User_Key)[];
}
```
### Using `getUserByEmail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserByEmail, GetUserByEmailVariables } from '@dataconnect/generated';

// The `getUserByEmail` query requires an argument of type `GetUserByEmailVariables`:
const getUserByEmailVars: GetUserByEmailVariables = {
  email: ..., 
};

// Call the `getUserByEmail()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserByEmail(getUserByEmailVars);
// Variables can be defined inline as well.
const { data } = await getUserByEmail({ email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserByEmail(dataConnect, getUserByEmailVars);

console.log(data.users);

// Or, you can use the `Promise` API.
getUserByEmail(getUserByEmailVars).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `getUserByEmail`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserByEmailRef, GetUserByEmailVariables } from '@dataconnect/generated';

// The `getUserByEmail` query requires an argument of type `GetUserByEmailVariables`:
const getUserByEmailVars: GetUserByEmailVariables = {
  email: ..., 
};

// Call the `getUserByEmailRef()` function to get a reference to the query.
const ref = getUserByEmailRef(getUserByEmailVars);
// Variables can be defined inline as well.
const ref = getUserByEmailRef({ email: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserByEmailRef(dataConnect, getUserByEmailVars);

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

## listProductsByBusiness
You can execute the `listProductsByBusiness` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listProductsByBusiness(vars: ListProductsByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListProductsByBusinessData, ListProductsByBusinessVariables>;

interface ListProductsByBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListProductsByBusinessVariables): QueryRef<ListProductsByBusinessData, ListProductsByBusinessVariables>;
}
export const listProductsByBusinessRef: ListProductsByBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listProductsByBusiness(dc: DataConnect, vars: ListProductsByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListProductsByBusinessData, ListProductsByBusinessVariables>;

interface ListProductsByBusinessRef {
  ...
  (dc: DataConnect, vars: ListProductsByBusinessVariables): QueryRef<ListProductsByBusinessData, ListProductsByBusinessVariables>;
}
export const listProductsByBusinessRef: ListProductsByBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listProductsByBusinessRef:
```typescript
const name = listProductsByBusinessRef.operationName;
console.log(name);
```

### Variables
The `listProductsByBusiness` query requires an argument of type `ListProductsByBusinessVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListProductsByBusinessVariables {
  tenantId: string;
  businessId: string;
}
```
### Return Type
Recall that executing the `listProductsByBusiness` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListProductsByBusinessData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListProductsByBusinessData {
  products: ({
    id: string;
    name: string;
    category?: string | null;
    quantity: number;
    costPrice?: number | null;
    sellingPrice: number;
    expiryDate?: DateString | null;
    lowStockLevel?: number | null;
    createdBy: string;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
    tenantId: string;
    businessId: string;
  } & Product_Key)[];
}
```
### Using `listProductsByBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listProductsByBusiness, ListProductsByBusinessVariables } from '@dataconnect/generated';

// The `listProductsByBusiness` query requires an argument of type `ListProductsByBusinessVariables`:
const listProductsByBusinessVars: ListProductsByBusinessVariables = {
  tenantId: ..., 
  businessId: ..., 
};

// Call the `listProductsByBusiness()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listProductsByBusiness(listProductsByBusinessVars);
// Variables can be defined inline as well.
const { data } = await listProductsByBusiness({ tenantId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listProductsByBusiness(dataConnect, listProductsByBusinessVars);

console.log(data.products);

// Or, you can use the `Promise` API.
listProductsByBusiness(listProductsByBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

### Using `listProductsByBusiness`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listProductsByBusinessRef, ListProductsByBusinessVariables } from '@dataconnect/generated';

// The `listProductsByBusiness` query requires an argument of type `ListProductsByBusinessVariables`:
const listProductsByBusinessVars: ListProductsByBusinessVariables = {
  tenantId: ..., 
  businessId: ..., 
};

// Call the `listProductsByBusinessRef()` function to get a reference to the query.
const ref = listProductsByBusinessRef(listProductsByBusinessVars);
// Variables can be defined inline as well.
const ref = listProductsByBusinessRef({ tenantId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listProductsByBusinessRef(dataConnect, listProductsByBusinessVars);

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

## listCustomersByBusiness
You can execute the `listCustomersByBusiness` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listCustomersByBusiness(vars: ListCustomersByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListCustomersByBusinessData, ListCustomersByBusinessVariables>;

interface ListCustomersByBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCustomersByBusinessVariables): QueryRef<ListCustomersByBusinessData, ListCustomersByBusinessVariables>;
}
export const listCustomersByBusinessRef: ListCustomersByBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCustomersByBusiness(dc: DataConnect, vars: ListCustomersByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListCustomersByBusinessData, ListCustomersByBusinessVariables>;

interface ListCustomersByBusinessRef {
  ...
  (dc: DataConnect, vars: ListCustomersByBusinessVariables): QueryRef<ListCustomersByBusinessData, ListCustomersByBusinessVariables>;
}
export const listCustomersByBusinessRef: ListCustomersByBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCustomersByBusinessRef:
```typescript
const name = listCustomersByBusinessRef.operationName;
console.log(name);
```

### Variables
The `listCustomersByBusiness` query requires an argument of type `ListCustomersByBusinessVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListCustomersByBusinessVariables {
  tenantId: string;
  businessId: string;
}
```
### Return Type
Recall that executing the `listCustomersByBusiness` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCustomersByBusinessData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCustomersByBusinessData {
  customers: ({
    id: string;
    customerName: string;
    phoneNumber?: string | null;
    email?: string | null;
    location?: string | null;
    totalOrders?: number | null;
    totalSpent?: number | null;
    createdAt: TimestampString;
    tenantId: string;
    businessId: string;
  } & Customer_Key)[];
}
```
### Using `listCustomersByBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCustomersByBusiness, ListCustomersByBusinessVariables } from '@dataconnect/generated';

// The `listCustomersByBusiness` query requires an argument of type `ListCustomersByBusinessVariables`:
const listCustomersByBusinessVars: ListCustomersByBusinessVariables = {
  tenantId: ..., 
  businessId: ..., 
};

// Call the `listCustomersByBusiness()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCustomersByBusiness(listCustomersByBusinessVars);
// Variables can be defined inline as well.
const { data } = await listCustomersByBusiness({ tenantId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCustomersByBusiness(dataConnect, listCustomersByBusinessVars);

console.log(data.customers);

// Or, you can use the `Promise` API.
listCustomersByBusiness(listCustomersByBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.customers);
});
```

### Using `listCustomersByBusiness`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCustomersByBusinessRef, ListCustomersByBusinessVariables } from '@dataconnect/generated';

// The `listCustomersByBusiness` query requires an argument of type `ListCustomersByBusinessVariables`:
const listCustomersByBusinessVars: ListCustomersByBusinessVariables = {
  tenantId: ..., 
  businessId: ..., 
};

// Call the `listCustomersByBusinessRef()` function to get a reference to the query.
const ref = listCustomersByBusinessRef(listCustomersByBusinessVars);
// Variables can be defined inline as well.
const ref = listCustomersByBusinessRef({ tenantId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCustomersByBusinessRef(dataConnect, listCustomersByBusinessVars);

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

## listUsersByBusiness
You can execute the `listUsersByBusiness` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUsersByBusiness(vars: ListUsersByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListUsersByBusinessData, ListUsersByBusinessVariables>;

interface ListUsersByBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUsersByBusinessVariables): QueryRef<ListUsersByBusinessData, ListUsersByBusinessVariables>;
}
export const listUsersByBusinessRef: ListUsersByBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUsersByBusiness(dc: DataConnect, vars: ListUsersByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListUsersByBusinessData, ListUsersByBusinessVariables>;

interface ListUsersByBusinessRef {
  ...
  (dc: DataConnect, vars: ListUsersByBusinessVariables): QueryRef<ListUsersByBusinessData, ListUsersByBusinessVariables>;
}
export const listUsersByBusinessRef: ListUsersByBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUsersByBusinessRef:
```typescript
const name = listUsersByBusinessRef.operationName;
console.log(name);
```

### Variables
The `listUsersByBusiness` query requires an argument of type `ListUsersByBusinessVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListUsersByBusinessVariables {
  tenantId: string;
  businessId: string;
}
```
### Return Type
Recall that executing the `listUsersByBusiness` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUsersByBusinessData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUsersByBusinessData {
  users: ({
    id: string;
    email: string;
    role: string;
    department?: string | null;
    phoneNumber?: string | null;
    createdAt: TimestampString;
    tenantId: string;
    businessId: string;
    fullName?: string | null;
  } & User_Key)[];
}
```
### Using `listUsersByBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUsersByBusiness, ListUsersByBusinessVariables } from '@dataconnect/generated';

// The `listUsersByBusiness` query requires an argument of type `ListUsersByBusinessVariables`:
const listUsersByBusinessVars: ListUsersByBusinessVariables = {
  tenantId: ..., 
  businessId: ..., 
};

// Call the `listUsersByBusiness()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUsersByBusiness(listUsersByBusinessVars);
// Variables can be defined inline as well.
const { data } = await listUsersByBusiness({ tenantId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUsersByBusiness(dataConnect, listUsersByBusinessVars);

console.log(data.users);

// Or, you can use the `Promise` API.
listUsersByBusiness(listUsersByBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `listUsersByBusiness`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUsersByBusinessRef, ListUsersByBusinessVariables } from '@dataconnect/generated';

// The `listUsersByBusiness` query requires an argument of type `ListUsersByBusinessVariables`:
const listUsersByBusinessVars: ListUsersByBusinessVariables = {
  tenantId: ..., 
  businessId: ..., 
};

// Call the `listUsersByBusinessRef()` function to get a reference to the query.
const ref = listUsersByBusinessRef(listUsersByBusinessVars);
// Variables can be defined inline as well.
const ref = listUsersByBusinessRef({ tenantId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUsersByBusinessRef(dataConnect, listUsersByBusinessVars);

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

## listSuppliersByBusiness
You can execute the `listSuppliersByBusiness` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listSuppliersByBusiness(vars: ListSuppliersByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListSuppliersByBusinessData, ListSuppliersByBusinessVariables>;

interface ListSuppliersByBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListSuppliersByBusinessVariables): QueryRef<ListSuppliersByBusinessData, ListSuppliersByBusinessVariables>;
}
export const listSuppliersByBusinessRef: ListSuppliersByBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listSuppliersByBusiness(dc: DataConnect, vars: ListSuppliersByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListSuppliersByBusinessData, ListSuppliersByBusinessVariables>;

interface ListSuppliersByBusinessRef {
  ...
  (dc: DataConnect, vars: ListSuppliersByBusinessVariables): QueryRef<ListSuppliersByBusinessData, ListSuppliersByBusinessVariables>;
}
export const listSuppliersByBusinessRef: ListSuppliersByBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listSuppliersByBusinessRef:
```typescript
const name = listSuppliersByBusinessRef.operationName;
console.log(name);
```

### Variables
The `listSuppliersByBusiness` query requires an argument of type `ListSuppliersByBusinessVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListSuppliersByBusinessVariables {
  tenantId: string;
  businessId: string;
}
```
### Return Type
Recall that executing the `listSuppliersByBusiness` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListSuppliersByBusinessData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListSuppliersByBusinessData {
  suppliers: ({
    id: string;
    supplierName: string;
    phoneNumber?: string | null;
    email?: string | null;
    createdAt: TimestampString;
    tenantId: string;
    businessId: string;
  } & Supplier_Key)[];
}
```
### Using `listSuppliersByBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listSuppliersByBusiness, ListSuppliersByBusinessVariables } from '@dataconnect/generated';

// The `listSuppliersByBusiness` query requires an argument of type `ListSuppliersByBusinessVariables`:
const listSuppliersByBusinessVars: ListSuppliersByBusinessVariables = {
  tenantId: ..., 
  businessId: ..., 
};

// Call the `listSuppliersByBusiness()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listSuppliersByBusiness(listSuppliersByBusinessVars);
// Variables can be defined inline as well.
const { data } = await listSuppliersByBusiness({ tenantId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listSuppliersByBusiness(dataConnect, listSuppliersByBusinessVars);

console.log(data.suppliers);

// Or, you can use the `Promise` API.
listSuppliersByBusiness(listSuppliersByBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.suppliers);
});
```

### Using `listSuppliersByBusiness`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listSuppliersByBusinessRef, ListSuppliersByBusinessVariables } from '@dataconnect/generated';

// The `listSuppliersByBusiness` query requires an argument of type `ListSuppliersByBusinessVariables`:
const listSuppliersByBusinessVars: ListSuppliersByBusinessVariables = {
  tenantId: ..., 
  businessId: ..., 
};

// Call the `listSuppliersByBusinessRef()` function to get a reference to the query.
const ref = listSuppliersByBusinessRef(listSuppliersByBusinessVars);
// Variables can be defined inline as well.
const ref = listSuppliersByBusinessRef({ tenantId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listSuppliersByBusinessRef(dataConnect, listSuppliersByBusinessVars);

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

## listTasksByBusiness
You can execute the `listTasksByBusiness` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listTasksByBusiness(vars: ListTasksByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListTasksByBusinessData, ListTasksByBusinessVariables>;

interface ListTasksByBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTasksByBusinessVariables): QueryRef<ListTasksByBusinessData, ListTasksByBusinessVariables>;
}
export const listTasksByBusinessRef: ListTasksByBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTasksByBusiness(dc: DataConnect, vars: ListTasksByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListTasksByBusinessData, ListTasksByBusinessVariables>;

interface ListTasksByBusinessRef {
  ...
  (dc: DataConnect, vars: ListTasksByBusinessVariables): QueryRef<ListTasksByBusinessData, ListTasksByBusinessVariables>;
}
export const listTasksByBusinessRef: ListTasksByBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTasksByBusinessRef:
```typescript
const name = listTasksByBusinessRef.operationName;
console.log(name);
```

### Variables
The `listTasksByBusiness` query requires an argument of type `ListTasksByBusinessVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListTasksByBusinessVariables {
  tenantId: string;
  businessId: string;
}
```
### Return Type
Recall that executing the `listTasksByBusiness` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTasksByBusinessData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListTasksByBusinessData {
  tasks: ({
    id: string;
    title: string;
    description?: string | null;
    status: TaskStatus;
    priority?: TaskPriority | null;
    dueDate: TimestampString;
    assignedTo?: {
      id: string;
      email: string;
      role: string;
    } & User_Key;
    createdBy: string;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
    tenantId: string;
    businessId: string;
  } & Task_Key)[];
}
```
### Using `listTasksByBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTasksByBusiness, ListTasksByBusinessVariables } from '@dataconnect/generated';

// The `listTasksByBusiness` query requires an argument of type `ListTasksByBusinessVariables`:
const listTasksByBusinessVars: ListTasksByBusinessVariables = {
  tenantId: ..., 
  businessId: ..., 
};

// Call the `listTasksByBusiness()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTasksByBusiness(listTasksByBusinessVars);
// Variables can be defined inline as well.
const { data } = await listTasksByBusiness({ tenantId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTasksByBusiness(dataConnect, listTasksByBusinessVars);

console.log(data.tasks);

// Or, you can use the `Promise` API.
listTasksByBusiness(listTasksByBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.tasks);
});
```

### Using `listTasksByBusiness`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTasksByBusinessRef, ListTasksByBusinessVariables } from '@dataconnect/generated';

// The `listTasksByBusiness` query requires an argument of type `ListTasksByBusinessVariables`:
const listTasksByBusinessVars: ListTasksByBusinessVariables = {
  tenantId: ..., 
  businessId: ..., 
};

// Call the `listTasksByBusinessRef()` function to get a reference to the query.
const ref = listTasksByBusinessRef(listTasksByBusinessVars);
// Variables can be defined inline as well.
const ref = listTasksByBusinessRef({ tenantId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTasksByBusinessRef(dataConnect, listTasksByBusinessVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.tasks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.tasks);
});
```

## listTransactionsByBusiness
You can execute the `listTransactionsByBusiness` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listTransactionsByBusiness(vars: ListTransactionsByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListTransactionsByBusinessData, ListTransactionsByBusinessVariables>;

interface ListTransactionsByBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTransactionsByBusinessVariables): QueryRef<ListTransactionsByBusinessData, ListTransactionsByBusinessVariables>;
}
export const listTransactionsByBusinessRef: ListTransactionsByBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTransactionsByBusiness(dc: DataConnect, vars: ListTransactionsByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListTransactionsByBusinessData, ListTransactionsByBusinessVariables>;

interface ListTransactionsByBusinessRef {
  ...
  (dc: DataConnect, vars: ListTransactionsByBusinessVariables): QueryRef<ListTransactionsByBusinessData, ListTransactionsByBusinessVariables>;
}
export const listTransactionsByBusinessRef: ListTransactionsByBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTransactionsByBusinessRef:
```typescript
const name = listTransactionsByBusinessRef.operationName;
console.log(name);
```

### Variables
The `listTransactionsByBusiness` query requires an argument of type `ListTransactionsByBusinessVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListTransactionsByBusinessVariables {
  tenantId: string;
  businessId: string;
}
```
### Return Type
Recall that executing the `listTransactionsByBusiness` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTransactionsByBusinessData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListTransactionsByBusinessData {
  transactions: ({
    id: string;
    type: TransactionType;
    amount: number;
    date: TimestampString;
    category?: string | null;
    receiptUrl?: string | null;
    recordedBy: string;
    createdAt: TimestampString;
    tenantId: string;
    businessId: string;
  } & Transaction_Key)[];
}
```
### Using `listTransactionsByBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTransactionsByBusiness, ListTransactionsByBusinessVariables } from '@dataconnect/generated';

// The `listTransactionsByBusiness` query requires an argument of type `ListTransactionsByBusinessVariables`:
const listTransactionsByBusinessVars: ListTransactionsByBusinessVariables = {
  tenantId: ..., 
  businessId: ..., 
};

// Call the `listTransactionsByBusiness()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTransactionsByBusiness(listTransactionsByBusinessVars);
// Variables can be defined inline as well.
const { data } = await listTransactionsByBusiness({ tenantId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTransactionsByBusiness(dataConnect, listTransactionsByBusinessVars);

console.log(data.transactions);

// Or, you can use the `Promise` API.
listTransactionsByBusiness(listTransactionsByBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.transactions);
});
```

### Using `listTransactionsByBusiness`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTransactionsByBusinessRef, ListTransactionsByBusinessVariables } from '@dataconnect/generated';

// The `listTransactionsByBusiness` query requires an argument of type `ListTransactionsByBusinessVariables`:
const listTransactionsByBusinessVars: ListTransactionsByBusinessVariables = {
  tenantId: ..., 
  businessId: ..., 
};

// Call the `listTransactionsByBusinessRef()` function to get a reference to the query.
const ref = listTransactionsByBusinessRef(listTransactionsByBusinessVars);
// Variables can be defined inline as well.
const ref = listTransactionsByBusinessRef({ tenantId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTransactionsByBusinessRef(dataConnect, listTransactionsByBusinessVars);

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

## listTransactionsByType
You can execute the `listTransactionsByType` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listTransactionsByType(vars: ListTransactionsByTypeVariables, options?: ExecuteQueryOptions): QueryPromise<ListTransactionsByTypeData, ListTransactionsByTypeVariables>;

interface ListTransactionsByTypeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTransactionsByTypeVariables): QueryRef<ListTransactionsByTypeData, ListTransactionsByTypeVariables>;
}
export const listTransactionsByTypeRef: ListTransactionsByTypeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTransactionsByType(dc: DataConnect, vars: ListTransactionsByTypeVariables, options?: ExecuteQueryOptions): QueryPromise<ListTransactionsByTypeData, ListTransactionsByTypeVariables>;

interface ListTransactionsByTypeRef {
  ...
  (dc: DataConnect, vars: ListTransactionsByTypeVariables): QueryRef<ListTransactionsByTypeData, ListTransactionsByTypeVariables>;
}
export const listTransactionsByTypeRef: ListTransactionsByTypeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTransactionsByTypeRef:
```typescript
const name = listTransactionsByTypeRef.operationName;
console.log(name);
```

### Variables
The `listTransactionsByType` query requires an argument of type `ListTransactionsByTypeVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListTransactionsByTypeVariables {
  tenantId: string;
  businessId: string;
  type: TransactionType;
}
```
### Return Type
Recall that executing the `listTransactionsByType` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTransactionsByTypeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListTransactionsByTypeData {
  transactions: ({
    id: string;
    type: TransactionType;
    amount: number;
    date: TimestampString;
    category?: string | null;
    receiptUrl?: string | null;
    recordedBy: string;
    createdAt: TimestampString;
    tenantId: string;
    businessId: string;
  } & Transaction_Key)[];
}
```
### Using `listTransactionsByType`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTransactionsByType, ListTransactionsByTypeVariables } from '@dataconnect/generated';

// The `listTransactionsByType` query requires an argument of type `ListTransactionsByTypeVariables`:
const listTransactionsByTypeVars: ListTransactionsByTypeVariables = {
  tenantId: ..., 
  businessId: ..., 
  type: ..., 
};

// Call the `listTransactionsByType()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTransactionsByType(listTransactionsByTypeVars);
// Variables can be defined inline as well.
const { data } = await listTransactionsByType({ tenantId: ..., businessId: ..., type: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTransactionsByType(dataConnect, listTransactionsByTypeVars);

console.log(data.transactions);

// Or, you can use the `Promise` API.
listTransactionsByType(listTransactionsByTypeVars).then((response) => {
  const data = response.data;
  console.log(data.transactions);
});
```

### Using `listTransactionsByType`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTransactionsByTypeRef, ListTransactionsByTypeVariables } from '@dataconnect/generated';

// The `listTransactionsByType` query requires an argument of type `ListTransactionsByTypeVariables`:
const listTransactionsByTypeVars: ListTransactionsByTypeVariables = {
  tenantId: ..., 
  businessId: ..., 
  type: ..., 
};

// Call the `listTransactionsByTypeRef()` function to get a reference to the query.
const ref = listTransactionsByTypeRef(listTransactionsByTypeVars);
// Variables can be defined inline as well.
const ref = listTransactionsByTypeRef({ tenantId: ..., businessId: ..., type: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTransactionsByTypeRef(dataConnect, listTransactionsByTypeVars);

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

## listEmployeesByBusiness
You can execute the `listEmployeesByBusiness` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listEmployeesByBusiness(vars: ListEmployeesByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListEmployeesByBusinessData, ListEmployeesByBusinessVariables>;

interface ListEmployeesByBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListEmployeesByBusinessVariables): QueryRef<ListEmployeesByBusinessData, ListEmployeesByBusinessVariables>;
}
export const listEmployeesByBusinessRef: ListEmployeesByBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listEmployeesByBusiness(dc: DataConnect, vars: ListEmployeesByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListEmployeesByBusinessData, ListEmployeesByBusinessVariables>;

interface ListEmployeesByBusinessRef {
  ...
  (dc: DataConnect, vars: ListEmployeesByBusinessVariables): QueryRef<ListEmployeesByBusinessData, ListEmployeesByBusinessVariables>;
}
export const listEmployeesByBusinessRef: ListEmployeesByBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listEmployeesByBusinessRef:
```typescript
const name = listEmployeesByBusinessRef.operationName;
console.log(name);
```

### Variables
The `listEmployeesByBusiness` query requires an argument of type `ListEmployeesByBusinessVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListEmployeesByBusinessVariables {
  tenantId: string;
  businessId: string;
}
```
### Return Type
Recall that executing the `listEmployeesByBusiness` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListEmployeesByBusinessData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListEmployeesByBusinessData {
  employees: ({
    id: string;
    fullName: string;
    position: string;
    salary?: number | null;
    department?: string | null;
    startDate?: DateString | null;
    status?: string | null;
    createdAt: TimestampString;
    tenantId: string;
    businessId: string;
  } & Employee_Key)[];
}
```
### Using `listEmployeesByBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listEmployeesByBusiness, ListEmployeesByBusinessVariables } from '@dataconnect/generated';

// The `listEmployeesByBusiness` query requires an argument of type `ListEmployeesByBusinessVariables`:
const listEmployeesByBusinessVars: ListEmployeesByBusinessVariables = {
  tenantId: ..., 
  businessId: ..., 
};

// Call the `listEmployeesByBusiness()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listEmployeesByBusiness(listEmployeesByBusinessVars);
// Variables can be defined inline as well.
const { data } = await listEmployeesByBusiness({ tenantId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listEmployeesByBusiness(dataConnect, listEmployeesByBusinessVars);

console.log(data.employees);

// Or, you can use the `Promise` API.
listEmployeesByBusiness(listEmployeesByBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.employees);
});
```

### Using `listEmployeesByBusiness`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listEmployeesByBusinessRef, ListEmployeesByBusinessVariables } from '@dataconnect/generated';

// The `listEmployeesByBusiness` query requires an argument of type `ListEmployeesByBusinessVariables`:
const listEmployeesByBusinessVars: ListEmployeesByBusinessVariables = {
  tenantId: ..., 
  businessId: ..., 
};

// Call the `listEmployeesByBusinessRef()` function to get a reference to the query.
const ref = listEmployeesByBusinessRef(listEmployeesByBusinessVars);
// Variables can be defined inline as well.
const ref = listEmployeesByBusinessRef({ tenantId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listEmployeesByBusinessRef(dataConnect, listEmployeesByBusinessVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.employees);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.employees);
});
```

## listDocumentsByBusiness
You can execute the `listDocumentsByBusiness` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listDocumentsByBusiness(vars: ListDocumentsByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListDocumentsByBusinessData, ListDocumentsByBusinessVariables>;

interface ListDocumentsByBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListDocumentsByBusinessVariables): QueryRef<ListDocumentsByBusinessData, ListDocumentsByBusinessVariables>;
}
export const listDocumentsByBusinessRef: ListDocumentsByBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listDocumentsByBusiness(dc: DataConnect, vars: ListDocumentsByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListDocumentsByBusinessData, ListDocumentsByBusinessVariables>;

interface ListDocumentsByBusinessRef {
  ...
  (dc: DataConnect, vars: ListDocumentsByBusinessVariables): QueryRef<ListDocumentsByBusinessData, ListDocumentsByBusinessVariables>;
}
export const listDocumentsByBusinessRef: ListDocumentsByBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listDocumentsByBusinessRef:
```typescript
const name = listDocumentsByBusinessRef.operationName;
console.log(name);
```

### Variables
The `listDocumentsByBusiness` query requires an argument of type `ListDocumentsByBusinessVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListDocumentsByBusinessVariables {
  tenantId: string;
  businessId: string;
}
```
### Return Type
Recall that executing the `listDocumentsByBusiness` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListDocumentsByBusinessData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListDocumentsByBusinessData {
  documents: ({
    id: string;
    title: string;
    documentType: string;
    fileUrl: string;
    uploadedBy: string;
    uploadedAt: TimestampString;
    tenantId: string;
    businessId: string;
  } & Document_Key)[];
}
```
### Using `listDocumentsByBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listDocumentsByBusiness, ListDocumentsByBusinessVariables } from '@dataconnect/generated';

// The `listDocumentsByBusiness` query requires an argument of type `ListDocumentsByBusinessVariables`:
const listDocumentsByBusinessVars: ListDocumentsByBusinessVariables = {
  tenantId: ..., 
  businessId: ..., 
};

// Call the `listDocumentsByBusiness()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listDocumentsByBusiness(listDocumentsByBusinessVars);
// Variables can be defined inline as well.
const { data } = await listDocumentsByBusiness({ tenantId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listDocumentsByBusiness(dataConnect, listDocumentsByBusinessVars);

console.log(data.documents);

// Or, you can use the `Promise` API.
listDocumentsByBusiness(listDocumentsByBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.documents);
});
```

### Using `listDocumentsByBusiness`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listDocumentsByBusinessRef, ListDocumentsByBusinessVariables } from '@dataconnect/generated';

// The `listDocumentsByBusiness` query requires an argument of type `ListDocumentsByBusinessVariables`:
const listDocumentsByBusinessVars: ListDocumentsByBusinessVariables = {
  tenantId: ..., 
  businessId: ..., 
};

// Call the `listDocumentsByBusinessRef()` function to get a reference to the query.
const ref = listDocumentsByBusinessRef(listDocumentsByBusinessVars);
// Variables can be defined inline as well.
const ref = listDocumentsByBusinessRef({ tenantId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listDocumentsByBusinessRef(dataConnect, listDocumentsByBusinessVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.documents);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.documents);
});
```

## listActivityLogsByUser
You can execute the `listActivityLogsByUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listActivityLogsByUser(vars: ListActivityLogsByUserVariables, options?: ExecuteQueryOptions): QueryPromise<ListActivityLogsByUserData, ListActivityLogsByUserVariables>;

interface ListActivityLogsByUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListActivityLogsByUserVariables): QueryRef<ListActivityLogsByUserData, ListActivityLogsByUserVariables>;
}
export const listActivityLogsByUserRef: ListActivityLogsByUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listActivityLogsByUser(dc: DataConnect, vars: ListActivityLogsByUserVariables, options?: ExecuteQueryOptions): QueryPromise<ListActivityLogsByUserData, ListActivityLogsByUserVariables>;

interface ListActivityLogsByUserRef {
  ...
  (dc: DataConnect, vars: ListActivityLogsByUserVariables): QueryRef<ListActivityLogsByUserData, ListActivityLogsByUserVariables>;
}
export const listActivityLogsByUserRef: ListActivityLogsByUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listActivityLogsByUserRef:
```typescript
const name = listActivityLogsByUserRef.operationName;
console.log(name);
```

### Variables
The `listActivityLogsByUser` query requires an argument of type `ListActivityLogsByUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListActivityLogsByUserVariables {
  tenantId: string;
  businessId: string;
  userId: string;
}
```
### Return Type
Recall that executing the `listActivityLogsByUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListActivityLogsByUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListActivityLogsByUserData {
  activityLogs: ({
    id: string;
    tenantId: string;
    businessId: string;
    userId: string;
    userName: string;
    actionType: string;
    module: string;
    description?: string | null;
    recordId?: string | null;
    timestamp: TimestampString;
  } & ActivityLog_Key)[];
}
```
### Using `listActivityLogsByUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listActivityLogsByUser, ListActivityLogsByUserVariables } from '@dataconnect/generated';

// The `listActivityLogsByUser` query requires an argument of type `ListActivityLogsByUserVariables`:
const listActivityLogsByUserVars: ListActivityLogsByUserVariables = {
  tenantId: ..., 
  businessId: ..., 
  userId: ..., 
};

// Call the `listActivityLogsByUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listActivityLogsByUser(listActivityLogsByUserVars);
// Variables can be defined inline as well.
const { data } = await listActivityLogsByUser({ tenantId: ..., businessId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listActivityLogsByUser(dataConnect, listActivityLogsByUserVars);

console.log(data.activityLogs);

// Or, you can use the `Promise` API.
listActivityLogsByUser(listActivityLogsByUserVars).then((response) => {
  const data = response.data;
  console.log(data.activityLogs);
});
```

### Using `listActivityLogsByUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listActivityLogsByUserRef, ListActivityLogsByUserVariables } from '@dataconnect/generated';

// The `listActivityLogsByUser` query requires an argument of type `ListActivityLogsByUserVariables`:
const listActivityLogsByUserVars: ListActivityLogsByUserVariables = {
  tenantId: ..., 
  businessId: ..., 
  userId: ..., 
};

// Call the `listActivityLogsByUserRef()` function to get a reference to the query.
const ref = listActivityLogsByUserRef(listActivityLogsByUserVars);
// Variables can be defined inline as well.
const ref = listActivityLogsByUserRef({ tenantId: ..., businessId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listActivityLogsByUserRef(dataConnect, listActivityLogsByUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.activityLogs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.activityLogs);
});
```

## listActivityLogsByBusiness
You can execute the `listActivityLogsByBusiness` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listActivityLogsByBusiness(vars: ListActivityLogsByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListActivityLogsByBusinessData, ListActivityLogsByBusinessVariables>;

interface ListActivityLogsByBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListActivityLogsByBusinessVariables): QueryRef<ListActivityLogsByBusinessData, ListActivityLogsByBusinessVariables>;
}
export const listActivityLogsByBusinessRef: ListActivityLogsByBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listActivityLogsByBusiness(dc: DataConnect, vars: ListActivityLogsByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListActivityLogsByBusinessData, ListActivityLogsByBusinessVariables>;

interface ListActivityLogsByBusinessRef {
  ...
  (dc: DataConnect, vars: ListActivityLogsByBusinessVariables): QueryRef<ListActivityLogsByBusinessData, ListActivityLogsByBusinessVariables>;
}
export const listActivityLogsByBusinessRef: ListActivityLogsByBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listActivityLogsByBusinessRef:
```typescript
const name = listActivityLogsByBusinessRef.operationName;
console.log(name);
```

### Variables
The `listActivityLogsByBusiness` query requires an argument of type `ListActivityLogsByBusinessVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListActivityLogsByBusinessVariables {
  tenantId: string;
  businessId: string;
}
```
### Return Type
Recall that executing the `listActivityLogsByBusiness` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListActivityLogsByBusinessData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListActivityLogsByBusinessData {
  activityLogs: ({
    id: string;
    tenantId: string;
    businessId: string;
    userId: string;
    userName: string;
    actionType: string;
    module: string;
    description?: string | null;
    recordId?: string | null;
    timestamp: TimestampString;
  } & ActivityLog_Key)[];
}
```
### Using `listActivityLogsByBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listActivityLogsByBusiness, ListActivityLogsByBusinessVariables } from '@dataconnect/generated';

// The `listActivityLogsByBusiness` query requires an argument of type `ListActivityLogsByBusinessVariables`:
const listActivityLogsByBusinessVars: ListActivityLogsByBusinessVariables = {
  tenantId: ..., 
  businessId: ..., 
};

// Call the `listActivityLogsByBusiness()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listActivityLogsByBusiness(listActivityLogsByBusinessVars);
// Variables can be defined inline as well.
const { data } = await listActivityLogsByBusiness({ tenantId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listActivityLogsByBusiness(dataConnect, listActivityLogsByBusinessVars);

console.log(data.activityLogs);

// Or, you can use the `Promise` API.
listActivityLogsByBusiness(listActivityLogsByBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.activityLogs);
});
```

### Using `listActivityLogsByBusiness`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listActivityLogsByBusinessRef, ListActivityLogsByBusinessVariables } from '@dataconnect/generated';

// The `listActivityLogsByBusiness` query requires an argument of type `ListActivityLogsByBusinessVariables`:
const listActivityLogsByBusinessVars: ListActivityLogsByBusinessVariables = {
  tenantId: ..., 
  businessId: ..., 
};

// Call the `listActivityLogsByBusinessRef()` function to get a reference to the query.
const ref = listActivityLogsByBusinessRef(listActivityLogsByBusinessVars);
// Variables can be defined inline as well.
const ref = listActivityLogsByBusinessRef({ tenantId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listActivityLogsByBusinessRef(dataConnect, listActivityLogsByBusinessVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.activityLogs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.activityLogs);
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
console.log(name);
```

### Variables
The `CreateTenant` mutation requires an argument of type `CreateTenantVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTenantVariables {
  name: string;
  businessSector: string;
  location: string;
  ownerEmail: string;
  taxId?: string | null;
  logoUrl?: string | null;
  subscriptionTier?: string | null;
  status?: string | null;
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
  name: ..., 
  businessSector: ..., 
  location: ..., 
  ownerEmail: ..., 
  taxId: ..., // optional
  logoUrl: ..., // optional
  subscriptionTier: ..., // optional
  status: ..., // optional
};

// Call the `createTenant()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTenant(createTenantVars);
// Variables can be defined inline as well.
const { data } = await createTenant({ name: ..., businessSector: ..., location: ..., ownerEmail: ..., taxId: ..., logoUrl: ..., subscriptionTier: ..., status: ..., });

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
  name: ..., 
  businessSector: ..., 
  location: ..., 
  ownerEmail: ..., 
  taxId: ..., // optional
  logoUrl: ..., // optional
  subscriptionTier: ..., // optional
  status: ..., // optional
};

// Call the `createTenantRef()` function to get a reference to the mutation.
const ref = createTenantRef(createTenantVars);
// Variables can be defined inline as well.
const ref = createTenantRef({ name: ..., businessSector: ..., location: ..., ownerEmail: ..., taxId: ..., logoUrl: ..., subscriptionTier: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTenantRef(dataConnect, createTenantVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.tenant_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
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
console.log(name);
```

### Variables
The `UpdateTenant` mutation requires an argument of type `UpdateTenantVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTenantVariables {
  id: string;
  name?: string | null;
  businessSector?: string | null;
  location?: string | null;
  ownerEmail?: string | null;
  taxId?: string | null;
  logoUrl?: string | null;
  subscriptionTier?: string | null;
  status?: string | null;
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
  name: ..., // optional
  businessSector: ..., // optional
  location: ..., // optional
  ownerEmail: ..., // optional
  taxId: ..., // optional
  logoUrl: ..., // optional
  subscriptionTier: ..., // optional
  status: ..., // optional
};

// Call the `updateTenant()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTenant(updateTenantVars);
// Variables can be defined inline as well.
const { data } = await updateTenant({ id: ..., name: ..., businessSector: ..., location: ..., ownerEmail: ..., taxId: ..., logoUrl: ..., subscriptionTier: ..., status: ..., });

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
  name: ..., // optional
  businessSector: ..., // optional
  location: ..., // optional
  ownerEmail: ..., // optional
  taxId: ..., // optional
  logoUrl: ..., // optional
  subscriptionTier: ..., // optional
  status: ..., // optional
};

// Call the `updateTenantRef()` function to get a reference to the mutation.
const ref = updateTenantRef(updateTenantVars);
// Variables can be defined inline as well.
const ref = updateTenantRef({ id: ..., name: ..., businessSector: ..., location: ..., ownerEmail: ..., taxId: ..., logoUrl: ..., subscriptionTier: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTenantRef(dataConnect, updateTenantVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.tenant_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
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
console.log(name);
```

### Variables
The `DeleteTenant` mutation requires an argument of type `DeleteTenantVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteTenantVariables {
  id: string;
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

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.tenant_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
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
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  tenantId: string;
  businessId: string;
  email: string;
  role: string;
  fullName?: string | null;
  department?: string | null;
  phoneNumber?: string | null;
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
  tenantId: ..., 
  businessId: ..., 
  email: ..., 
  role: ..., 
  fullName: ..., // optional
  department: ..., // optional
  phoneNumber: ..., // optional
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ tenantId: ..., businessId: ..., email: ..., role: ..., fullName: ..., department: ..., phoneNumber: ..., });

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
  tenantId: ..., 
  businessId: ..., 
  email: ..., 
  role: ..., 
  fullName: ..., // optional
  department: ..., // optional
  phoneNumber: ..., // optional
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ tenantId: ..., businessId: ..., email: ..., role: ..., fullName: ..., department: ..., phoneNumber: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
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
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  email?: string | null;
  role?: string | null;
  fullName?: string | null;
  department?: string | null;
  phoneNumber?: string | null;
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
  tenantId: ..., // optional
  businessId: ..., // optional
  email: ..., // optional
  role: ..., // optional
  fullName: ..., // optional
  department: ..., // optional
  phoneNumber: ..., // optional
};

// Call the `updateUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUser(updateUserVars);
// Variables can be defined inline as well.
const { data } = await updateUser({ id: ..., tenantId: ..., businessId: ..., email: ..., role: ..., fullName: ..., department: ..., phoneNumber: ..., });

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
  tenantId: ..., // optional
  businessId: ..., // optional
  email: ..., // optional
  role: ..., // optional
  fullName: ..., // optional
  department: ..., // optional
  phoneNumber: ..., // optional
};

// Call the `updateUserRef()` function to get a reference to the mutation.
const ref = updateUserRef(updateUserVars);
// Variables can be defined inline as well.
const ref = updateUserRef({ id: ..., tenantId: ..., businessId: ..., email: ..., role: ..., fullName: ..., department: ..., phoneNumber: ..., });

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
  id: string;
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
  tenantId: string;
  name: string;
  location: string;
  businessType?: string | null;
  region?: string | null;
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
  tenantId: ..., 
  name: ..., 
  location: ..., 
  businessType: ..., // optional
  region: ..., // optional
};

// Call the `createBusiness()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBusiness(createBusinessVars);
// Variables can be defined inline as well.
const { data } = await createBusiness({ tenantId: ..., name: ..., location: ..., businessType: ..., region: ..., });

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
  tenantId: ..., 
  name: ..., 
  location: ..., 
  businessType: ..., // optional
  region: ..., // optional
};

// Call the `createBusinessRef()` function to get a reference to the mutation.
const ref = createBusinessRef(createBusinessVars);
// Variables can be defined inline as well.
const ref = createBusinessRef({ tenantId: ..., name: ..., location: ..., businessType: ..., region: ..., });

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
  id: string;
  tenantId?: string | null;
  name?: string | null;
  location?: string | null;
  businessType?: string | null;
  region?: string | null;
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
  tenantId: ..., // optional
  name: ..., // optional
  location: ..., // optional
  businessType: ..., // optional
  region: ..., // optional
};

// Call the `updateBusiness()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateBusiness(updateBusinessVars);
// Variables can be defined inline as well.
const { data } = await updateBusiness({ id: ..., tenantId: ..., name: ..., location: ..., businessType: ..., region: ..., });

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
  tenantId: ..., // optional
  name: ..., // optional
  location: ..., // optional
  businessType: ..., // optional
  region: ..., // optional
};

// Call the `updateBusinessRef()` function to get a reference to the mutation.
const ref = updateBusinessRef(updateBusinessVars);
// Variables can be defined inline as well.
const ref = updateBusinessRef({ id: ..., tenantId: ..., name: ..., location: ..., businessType: ..., region: ..., });

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
  id: string;
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
  tenantId: string;
  businessId: string;
  name: string;
  category?: string | null;
  quantity: number;
  costPrice?: number | null;
  sellingPrice: number;
  expiryDate?: DateString | null;
  lowStockLevel?: number | null;
  createdBy: string;
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
  tenantId: ..., 
  businessId: ..., 
  name: ..., 
  category: ..., // optional
  quantity: ..., 
  costPrice: ..., // optional
  sellingPrice: ..., 
  expiryDate: ..., // optional
  lowStockLevel: ..., // optional
  createdBy: ..., 
};

// Call the `createProduct()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProduct(createProductVars);
// Variables can be defined inline as well.
const { data } = await createProduct({ tenantId: ..., businessId: ..., name: ..., category: ..., quantity: ..., costPrice: ..., sellingPrice: ..., expiryDate: ..., lowStockLevel: ..., createdBy: ..., });

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
  tenantId: ..., 
  businessId: ..., 
  name: ..., 
  category: ..., // optional
  quantity: ..., 
  costPrice: ..., // optional
  sellingPrice: ..., 
  expiryDate: ..., // optional
  lowStockLevel: ..., // optional
  createdBy: ..., 
};

// Call the `createProductRef()` function to get a reference to the mutation.
const ref = createProductRef(createProductVars);
// Variables can be defined inline as well.
const ref = createProductRef({ tenantId: ..., businessId: ..., name: ..., category: ..., quantity: ..., costPrice: ..., sellingPrice: ..., expiryDate: ..., lowStockLevel: ..., createdBy: ..., });

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
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  name?: string | null;
  category?: string | null;
  quantity?: number | null;
  costPrice?: number | null;
  sellingPrice?: number | null;
  expiryDate?: DateString | null;
  lowStockLevel?: number | null;
  createdBy?: string | null;
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
  tenantId: ..., // optional
  businessId: ..., // optional
  name: ..., // optional
  category: ..., // optional
  quantity: ..., // optional
  costPrice: ..., // optional
  sellingPrice: ..., // optional
  expiryDate: ..., // optional
  lowStockLevel: ..., // optional
  createdBy: ..., // optional
};

// Call the `updateProduct()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProduct(updateProductVars);
// Variables can be defined inline as well.
const { data } = await updateProduct({ id: ..., tenantId: ..., businessId: ..., name: ..., category: ..., quantity: ..., costPrice: ..., sellingPrice: ..., expiryDate: ..., lowStockLevel: ..., createdBy: ..., });

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
  tenantId: ..., // optional
  businessId: ..., // optional
  name: ..., // optional
  category: ..., // optional
  quantity: ..., // optional
  costPrice: ..., // optional
  sellingPrice: ..., // optional
  expiryDate: ..., // optional
  lowStockLevel: ..., // optional
  createdBy: ..., // optional
};

// Call the `updateProductRef()` function to get a reference to the mutation.
const ref = updateProductRef(updateProductVars);
// Variables can be defined inline as well.
const ref = updateProductRef({ id: ..., tenantId: ..., businessId: ..., name: ..., category: ..., quantity: ..., costPrice: ..., sellingPrice: ..., expiryDate: ..., lowStockLevel: ..., createdBy: ..., });

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
  id: string;
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
  tenantId: string;
  businessId: string;
  type: TransactionType;
  amount: number;
  date: TimestampString;
  category?: string | null;
  receiptUrl?: string | null;
  recordedBy: string;
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
  tenantId: ..., 
  businessId: ..., 
  type: ..., 
  amount: ..., 
  date: ..., 
  category: ..., // optional
  receiptUrl: ..., // optional
  recordedBy: ..., 
};

// Call the `createTransaction()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTransaction(createTransactionVars);
// Variables can be defined inline as well.
const { data } = await createTransaction({ tenantId: ..., businessId: ..., type: ..., amount: ..., date: ..., category: ..., receiptUrl: ..., recordedBy: ..., });

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
  tenantId: ..., 
  businessId: ..., 
  type: ..., 
  amount: ..., 
  date: ..., 
  category: ..., // optional
  receiptUrl: ..., // optional
  recordedBy: ..., 
};

// Call the `createTransactionRef()` function to get a reference to the mutation.
const ref = createTransactionRef(createTransactionVars);
// Variables can be defined inline as well.
const ref = createTransactionRef({ tenantId: ..., businessId: ..., type: ..., amount: ..., date: ..., category: ..., receiptUrl: ..., recordedBy: ..., });

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
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  type?: TransactionType | null;
  amount?: number | null;
  date?: TimestampString | null;
  category?: string | null;
  receiptUrl?: string | null;
  recordedBy?: string | null;
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
  tenantId: ..., // optional
  businessId: ..., // optional
  type: ..., // optional
  amount: ..., // optional
  date: ..., // optional
  category: ..., // optional
  receiptUrl: ..., // optional
  recordedBy: ..., // optional
};

// Call the `updateTransaction()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTransaction(updateTransactionVars);
// Variables can be defined inline as well.
const { data } = await updateTransaction({ id: ..., tenantId: ..., businessId: ..., type: ..., amount: ..., date: ..., category: ..., receiptUrl: ..., recordedBy: ..., });

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
  tenantId: ..., // optional
  businessId: ..., // optional
  type: ..., // optional
  amount: ..., // optional
  date: ..., // optional
  category: ..., // optional
  receiptUrl: ..., // optional
  recordedBy: ..., // optional
};

// Call the `updateTransactionRef()` function to get a reference to the mutation.
const ref = updateTransactionRef(updateTransactionVars);
// Variables can be defined inline as well.
const ref = updateTransactionRef({ id: ..., tenantId: ..., businessId: ..., type: ..., amount: ..., date: ..., category: ..., receiptUrl: ..., recordedBy: ..., });

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
  id: string;
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

## CreateTaskComment
You can execute the `CreateTaskComment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createTaskComment(vars: CreateTaskCommentVariables): MutationPromise<CreateTaskCommentData, CreateTaskCommentVariables>;

interface CreateTaskCommentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTaskCommentVariables): MutationRef<CreateTaskCommentData, CreateTaskCommentVariables>;
}
export const createTaskCommentRef: CreateTaskCommentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTaskComment(dc: DataConnect, vars: CreateTaskCommentVariables): MutationPromise<CreateTaskCommentData, CreateTaskCommentVariables>;

interface CreateTaskCommentRef {
  ...
  (dc: DataConnect, vars: CreateTaskCommentVariables): MutationRef<CreateTaskCommentData, CreateTaskCommentVariables>;
}
export const createTaskCommentRef: CreateTaskCommentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTaskCommentRef:
```typescript
const name = createTaskCommentRef.operationName;
console.log(name);
```

### Variables
The `CreateTaskComment` mutation requires an argument of type `CreateTaskCommentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTaskCommentVariables {
  tenantId: string;
  businessId: string;
  taskId: string;
  userId: string;
  content: string;
}
```
### Return Type
Recall that executing the `CreateTaskComment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTaskCommentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTaskCommentData {
  taskComment_insert: TaskComment_Key;
}
```
### Using `CreateTaskComment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTaskComment, CreateTaskCommentVariables } from '@dataconnect/generated';

// The `CreateTaskComment` mutation requires an argument of type `CreateTaskCommentVariables`:
const createTaskCommentVars: CreateTaskCommentVariables = {
  tenantId: ..., 
  businessId: ..., 
  taskId: ..., 
  userId: ..., 
  content: ..., 
};

// Call the `createTaskComment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTaskComment(createTaskCommentVars);
// Variables can be defined inline as well.
const { data } = await createTaskComment({ tenantId: ..., businessId: ..., taskId: ..., userId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTaskComment(dataConnect, createTaskCommentVars);

console.log(data.taskComment_insert);

// Or, you can use the `Promise` API.
createTaskComment(createTaskCommentVars).then((response) => {
  const data = response.data;
  console.log(data.taskComment_insert);
});
```

### Using `CreateTaskComment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTaskCommentRef, CreateTaskCommentVariables } from '@dataconnect/generated';

// The `CreateTaskComment` mutation requires an argument of type `CreateTaskCommentVariables`:
const createTaskCommentVars: CreateTaskCommentVariables = {
  tenantId: ..., 
  businessId: ..., 
  taskId: ..., 
  userId: ..., 
  content: ..., 
};

// Call the `createTaskCommentRef()` function to get a reference to the mutation.
const ref = createTaskCommentRef(createTaskCommentVars);
// Variables can be defined inline as well.
const ref = createTaskCommentRef({ tenantId: ..., businessId: ..., taskId: ..., userId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTaskCommentRef(dataConnect, createTaskCommentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.taskComment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.taskComment_insert);
});
```

## UpdateTaskComment
You can execute the `UpdateTaskComment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateTaskComment(vars: UpdateTaskCommentVariables): MutationPromise<UpdateTaskCommentData, UpdateTaskCommentVariables>;

interface UpdateTaskCommentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTaskCommentVariables): MutationRef<UpdateTaskCommentData, UpdateTaskCommentVariables>;
}
export const updateTaskCommentRef: UpdateTaskCommentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTaskComment(dc: DataConnect, vars: UpdateTaskCommentVariables): MutationPromise<UpdateTaskCommentData, UpdateTaskCommentVariables>;

interface UpdateTaskCommentRef {
  ...
  (dc: DataConnect, vars: UpdateTaskCommentVariables): MutationRef<UpdateTaskCommentData, UpdateTaskCommentVariables>;
}
export const updateTaskCommentRef: UpdateTaskCommentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTaskCommentRef:
```typescript
const name = updateTaskCommentRef.operationName;
console.log(name);
```

### Variables
The `UpdateTaskComment` mutation requires an argument of type `UpdateTaskCommentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTaskCommentVariables {
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  taskId?: string | null;
  userId?: string | null;
  content?: string | null;
}
```
### Return Type
Recall that executing the `UpdateTaskComment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTaskCommentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTaskCommentData {
  taskComment_update?: TaskComment_Key | null;
}
```
### Using `UpdateTaskComment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTaskComment, UpdateTaskCommentVariables } from '@dataconnect/generated';

// The `UpdateTaskComment` mutation requires an argument of type `UpdateTaskCommentVariables`:
const updateTaskCommentVars: UpdateTaskCommentVariables = {
  id: ..., 
  tenantId: ..., // optional
  businessId: ..., // optional
  taskId: ..., // optional
  userId: ..., // optional
  content: ..., // optional
};

// Call the `updateTaskComment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTaskComment(updateTaskCommentVars);
// Variables can be defined inline as well.
const { data } = await updateTaskComment({ id: ..., tenantId: ..., businessId: ..., taskId: ..., userId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTaskComment(dataConnect, updateTaskCommentVars);

console.log(data.taskComment_update);

// Or, you can use the `Promise` API.
updateTaskComment(updateTaskCommentVars).then((response) => {
  const data = response.data;
  console.log(data.taskComment_update);
});
```

### Using `UpdateTaskComment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTaskCommentRef, UpdateTaskCommentVariables } from '@dataconnect/generated';

// The `UpdateTaskComment` mutation requires an argument of type `UpdateTaskCommentVariables`:
const updateTaskCommentVars: UpdateTaskCommentVariables = {
  id: ..., 
  tenantId: ..., // optional
  businessId: ..., // optional
  taskId: ..., // optional
  userId: ..., // optional
  content: ..., // optional
};

// Call the `updateTaskCommentRef()` function to get a reference to the mutation.
const ref = updateTaskCommentRef(updateTaskCommentVars);
// Variables can be defined inline as well.
const ref = updateTaskCommentRef({ id: ..., tenantId: ..., businessId: ..., taskId: ..., userId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTaskCommentRef(dataConnect, updateTaskCommentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.taskComment_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.taskComment_update);
});
```

## DeleteTaskComment
You can execute the `DeleteTaskComment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteTaskComment(vars: DeleteTaskCommentVariables): MutationPromise<DeleteTaskCommentData, DeleteTaskCommentVariables>;

interface DeleteTaskCommentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTaskCommentVariables): MutationRef<DeleteTaskCommentData, DeleteTaskCommentVariables>;
}
export const deleteTaskCommentRef: DeleteTaskCommentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteTaskComment(dc: DataConnect, vars: DeleteTaskCommentVariables): MutationPromise<DeleteTaskCommentData, DeleteTaskCommentVariables>;

interface DeleteTaskCommentRef {
  ...
  (dc: DataConnect, vars: DeleteTaskCommentVariables): MutationRef<DeleteTaskCommentData, DeleteTaskCommentVariables>;
}
export const deleteTaskCommentRef: DeleteTaskCommentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteTaskCommentRef:
```typescript
const name = deleteTaskCommentRef.operationName;
console.log(name);
```

### Variables
The `DeleteTaskComment` mutation requires an argument of type `DeleteTaskCommentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteTaskCommentVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteTaskComment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteTaskCommentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteTaskCommentData {
  taskComment_delete?: TaskComment_Key | null;
}
```
### Using `DeleteTaskComment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteTaskComment, DeleteTaskCommentVariables } from '@dataconnect/generated';

// The `DeleteTaskComment` mutation requires an argument of type `DeleteTaskCommentVariables`:
const deleteTaskCommentVars: DeleteTaskCommentVariables = {
  id: ..., 
};

// Call the `deleteTaskComment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteTaskComment(deleteTaskCommentVars);
// Variables can be defined inline as well.
const { data } = await deleteTaskComment({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteTaskComment(dataConnect, deleteTaskCommentVars);

console.log(data.taskComment_delete);

// Or, you can use the `Promise` API.
deleteTaskComment(deleteTaskCommentVars).then((response) => {
  const data = response.data;
  console.log(data.taskComment_delete);
});
```

### Using `DeleteTaskComment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteTaskCommentRef, DeleteTaskCommentVariables } from '@dataconnect/generated';

// The `DeleteTaskComment` mutation requires an argument of type `DeleteTaskCommentVariables`:
const deleteTaskCommentVars: DeleteTaskCommentVariables = {
  id: ..., 
};

// Call the `deleteTaskCommentRef()` function to get a reference to the mutation.
const ref = deleteTaskCommentRef(deleteTaskCommentVars);
// Variables can be defined inline as well.
const ref = deleteTaskCommentRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteTaskCommentRef(dataConnect, deleteTaskCommentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.taskComment_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.taskComment_delete);
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
  tenantId: string;
  businessId: string;
  fullName: string;
  position: string;
  salary?: number | null;
  department?: string | null;
  startDate?: DateString | null;
  status?: string | null;
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
  tenantId: ..., 
  businessId: ..., 
  fullName: ..., 
  position: ..., 
  salary: ..., // optional
  department: ..., // optional
  startDate: ..., // optional
  status: ..., // optional
};

// Call the `createEmployee()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createEmployee(createEmployeeVars);
// Variables can be defined inline as well.
const { data } = await createEmployee({ tenantId: ..., businessId: ..., fullName: ..., position: ..., salary: ..., department: ..., startDate: ..., status: ..., });

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
  tenantId: ..., 
  businessId: ..., 
  fullName: ..., 
  position: ..., 
  salary: ..., // optional
  department: ..., // optional
  startDate: ..., // optional
  status: ..., // optional
};

// Call the `createEmployeeRef()` function to get a reference to the mutation.
const ref = createEmployeeRef(createEmployeeVars);
// Variables can be defined inline as well.
const ref = createEmployeeRef({ tenantId: ..., businessId: ..., fullName: ..., position: ..., salary: ..., department: ..., startDate: ..., status: ..., });

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
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  fullName?: string | null;
  position?: string | null;
  salary?: number | null;
  department?: string | null;
  startDate?: DateString | null;
  status?: string | null;
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
  tenantId: ..., // optional
  businessId: ..., // optional
  fullName: ..., // optional
  position: ..., // optional
  salary: ..., // optional
  department: ..., // optional
  startDate: ..., // optional
  status: ..., // optional
};

// Call the `updateEmployee()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEmployee(updateEmployeeVars);
// Variables can be defined inline as well.
const { data } = await updateEmployee({ id: ..., tenantId: ..., businessId: ..., fullName: ..., position: ..., salary: ..., department: ..., startDate: ..., status: ..., });

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
  tenantId: ..., // optional
  businessId: ..., // optional
  fullName: ..., // optional
  position: ..., // optional
  salary: ..., // optional
  department: ..., // optional
  startDate: ..., // optional
  status: ..., // optional
};

// Call the `updateEmployeeRef()` function to get a reference to the mutation.
const ref = updateEmployeeRef(updateEmployeeVars);
// Variables can be defined inline as well.
const ref = updateEmployeeRef({ id: ..., tenantId: ..., businessId: ..., fullName: ..., position: ..., salary: ..., department: ..., startDate: ..., status: ..., });

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
  id: string;
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
  tenantId: string;
  businessId: string;
  customerName: string;
  phoneNumber?: string | null;
  email?: string | null;
  location?: string | null;
  totalOrders?: number | null;
  totalSpent?: number | null;
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
  tenantId: ..., 
  businessId: ..., 
  customerName: ..., 
  phoneNumber: ..., // optional
  email: ..., // optional
  location: ..., // optional
  totalOrders: ..., // optional
  totalSpent: ..., // optional
};

// Call the `createCustomer()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCustomer(createCustomerVars);
// Variables can be defined inline as well.
const { data } = await createCustomer({ tenantId: ..., businessId: ..., customerName: ..., phoneNumber: ..., email: ..., location: ..., totalOrders: ..., totalSpent: ..., });

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
  tenantId: ..., 
  businessId: ..., 
  customerName: ..., 
  phoneNumber: ..., // optional
  email: ..., // optional
  location: ..., // optional
  totalOrders: ..., // optional
  totalSpent: ..., // optional
};

// Call the `createCustomerRef()` function to get a reference to the mutation.
const ref = createCustomerRef(createCustomerVars);
// Variables can be defined inline as well.
const ref = createCustomerRef({ tenantId: ..., businessId: ..., customerName: ..., phoneNumber: ..., email: ..., location: ..., totalOrders: ..., totalSpent: ..., });

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
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  customerName?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  location?: string | null;
  totalOrders?: number | null;
  totalSpent?: number | null;
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
  tenantId: ..., // optional
  businessId: ..., // optional
  customerName: ..., // optional
  phoneNumber: ..., // optional
  email: ..., // optional
  location: ..., // optional
  totalOrders: ..., // optional
  totalSpent: ..., // optional
};

// Call the `updateCustomer()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCustomer(updateCustomerVars);
// Variables can be defined inline as well.
const { data } = await updateCustomer({ id: ..., tenantId: ..., businessId: ..., customerName: ..., phoneNumber: ..., email: ..., location: ..., totalOrders: ..., totalSpent: ..., });

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
  tenantId: ..., // optional
  businessId: ..., // optional
  customerName: ..., // optional
  phoneNumber: ..., // optional
  email: ..., // optional
  location: ..., // optional
  totalOrders: ..., // optional
  totalSpent: ..., // optional
};

// Call the `updateCustomerRef()` function to get a reference to the mutation.
const ref = updateCustomerRef(updateCustomerVars);
// Variables can be defined inline as well.
const ref = updateCustomerRef({ id: ..., tenantId: ..., businessId: ..., customerName: ..., phoneNumber: ..., email: ..., location: ..., totalOrders: ..., totalSpent: ..., });

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
  id: string;
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
  tenantId: string;
  businessId: string;
  supplierName: string;
  phoneNumber?: string | null;
  email?: string | null;
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
  tenantId: ..., 
  businessId: ..., 
  supplierName: ..., 
  phoneNumber: ..., // optional
  email: ..., // optional
};

// Call the `createSupplier()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSupplier(createSupplierVars);
// Variables can be defined inline as well.
const { data } = await createSupplier({ tenantId: ..., businessId: ..., supplierName: ..., phoneNumber: ..., email: ..., });

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
  tenantId: ..., 
  businessId: ..., 
  supplierName: ..., 
  phoneNumber: ..., // optional
  email: ..., // optional
};

// Call the `createSupplierRef()` function to get a reference to the mutation.
const ref = createSupplierRef(createSupplierVars);
// Variables can be defined inline as well.
const ref = createSupplierRef({ tenantId: ..., businessId: ..., supplierName: ..., phoneNumber: ..., email: ..., });

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
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  supplierName?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
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
  tenantId: ..., // optional
  businessId: ..., // optional
  supplierName: ..., // optional
  phoneNumber: ..., // optional
  email: ..., // optional
};

// Call the `updateSupplier()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateSupplier(updateSupplierVars);
// Variables can be defined inline as well.
const { data } = await updateSupplier({ id: ..., tenantId: ..., businessId: ..., supplierName: ..., phoneNumber: ..., email: ..., });

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
  tenantId: ..., // optional
  businessId: ..., // optional
  supplierName: ..., // optional
  phoneNumber: ..., // optional
  email: ..., // optional
};

// Call the `updateSupplierRef()` function to get a reference to the mutation.
const ref = updateSupplierRef(updateSupplierVars);
// Variables can be defined inline as well.
const ref = updateSupplierRef({ id: ..., tenantId: ..., businessId: ..., supplierName: ..., phoneNumber: ..., email: ..., });

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
  id: string;
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
  tenantId: string;
  businessId: string;
  title: string;
  documentType: string;
  fileUrl: string;
  uploadedBy: string;
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
  tenantId: ..., 
  businessId: ..., 
  title: ..., 
  documentType: ..., 
  fileUrl: ..., 
  uploadedBy: ..., 
};

// Call the `createDocument()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDocument(createDocumentVars);
// Variables can be defined inline as well.
const { data } = await createDocument({ tenantId: ..., businessId: ..., title: ..., documentType: ..., fileUrl: ..., uploadedBy: ..., });

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
  tenantId: ..., 
  businessId: ..., 
  title: ..., 
  documentType: ..., 
  fileUrl: ..., 
  uploadedBy: ..., 
};

// Call the `createDocumentRef()` function to get a reference to the mutation.
const ref = createDocumentRef(createDocumentVars);
// Variables can be defined inline as well.
const ref = createDocumentRef({ tenantId: ..., businessId: ..., title: ..., documentType: ..., fileUrl: ..., uploadedBy: ..., });

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
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  title?: string | null;
  documentType?: string | null;
  fileUrl?: string | null;
  uploadedBy?: string | null;
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
  tenantId: ..., // optional
  businessId: ..., // optional
  title: ..., // optional
  documentType: ..., // optional
  fileUrl: ..., // optional
  uploadedBy: ..., // optional
};

// Call the `updateDocument()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateDocument(updateDocumentVars);
// Variables can be defined inline as well.
const { data } = await updateDocument({ id: ..., tenantId: ..., businessId: ..., title: ..., documentType: ..., fileUrl: ..., uploadedBy: ..., });

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
  tenantId: ..., // optional
  businessId: ..., // optional
  title: ..., // optional
  documentType: ..., // optional
  fileUrl: ..., // optional
  uploadedBy: ..., // optional
};

// Call the `updateDocumentRef()` function to get a reference to the mutation.
const ref = updateDocumentRef(updateDocumentVars);
// Variables can be defined inline as well.
const ref = updateDocumentRef({ id: ..., tenantId: ..., businessId: ..., title: ..., documentType: ..., fileUrl: ..., uploadedBy: ..., });

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
  id: string;
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
});
```

## CreateActivityLog
You can execute the `CreateActivityLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createActivityLog(vars: CreateActivityLogVariables): MutationPromise<CreateActivityLogData, CreateActivityLogVariables>;

interface CreateActivityLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateActivityLogVariables): MutationRef<CreateActivityLogData, CreateActivityLogVariables>;
}
export const createActivityLogRef: CreateActivityLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createActivityLog(dc: DataConnect, vars: CreateActivityLogVariables): MutationPromise<CreateActivityLogData, CreateActivityLogVariables>;

interface CreateActivityLogRef {
  ...
  (dc: DataConnect, vars: CreateActivityLogVariables): MutationRef<CreateActivityLogData, CreateActivityLogVariables>;
}
export const createActivityLogRef: CreateActivityLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createActivityLogRef:
```typescript
const name = createActivityLogRef.operationName;
console.log(name);
```

### Variables
The `CreateActivityLog` mutation requires an argument of type `CreateActivityLogVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateActivityLogVariables {
  tenantId: string;
  businessId: string;
  userId: string;
  userName: string;
  actionType: string;
  module: string;
  description?: string | null;
  recordId?: string | null;
}
```
### Return Type
Recall that executing the `CreateActivityLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateActivityLogData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateActivityLogData {
  activityLog_insert: ActivityLog_Key;
}
```
### Using `CreateActivityLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createActivityLog, CreateActivityLogVariables } from '@dataconnect/generated';

// The `CreateActivityLog` mutation requires an argument of type `CreateActivityLogVariables`:
const createActivityLogVars: CreateActivityLogVariables = {
  tenantId: ..., 
  businessId: ..., 
  userId: ..., 
  userName: ..., 
  actionType: ..., 
  module: ..., 
  description: ..., // optional
  recordId: ..., // optional
};

// Call the `createActivityLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createActivityLog(createActivityLogVars);
// Variables can be defined inline as well.
const { data } = await createActivityLog({ tenantId: ..., businessId: ..., userId: ..., userName: ..., actionType: ..., module: ..., description: ..., recordId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createActivityLog(dataConnect, createActivityLogVars);

console.log(data.activityLog_insert);

// Or, you can use the `Promise` API.
createActivityLog(createActivityLogVars).then((response) => {
  const data = response.data;
  console.log(data.activityLog_insert);
});
```

### Using `CreateActivityLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createActivityLogRef, CreateActivityLogVariables } from '@dataconnect/generated';

// The `CreateActivityLog` mutation requires an argument of type `CreateActivityLogVariables`:
const createActivityLogVars: CreateActivityLogVariables = {
  tenantId: ..., 
  businessId: ..., 
  userId: ..., 
  userName: ..., 
  actionType: ..., 
  module: ..., 
  description: ..., // optional
  recordId: ..., // optional
};

// Call the `createActivityLogRef()` function to get a reference to the mutation.
const ref = createActivityLogRef(createActivityLogVars);
// Variables can be defined inline as well.
const ref = createActivityLogRef({ tenantId: ..., businessId: ..., userId: ..., userName: ..., actionType: ..., module: ..., description: ..., recordId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createActivityLogRef(dataConnect, createActivityLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.activityLog_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.activityLog_insert);
});
```

## UpdateActivityLog
You can execute the `UpdateActivityLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateActivityLog(vars: UpdateActivityLogVariables): MutationPromise<UpdateActivityLogData, UpdateActivityLogVariables>;

interface UpdateActivityLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateActivityLogVariables): MutationRef<UpdateActivityLogData, UpdateActivityLogVariables>;
}
export const updateActivityLogRef: UpdateActivityLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateActivityLog(dc: DataConnect, vars: UpdateActivityLogVariables): MutationPromise<UpdateActivityLogData, UpdateActivityLogVariables>;

interface UpdateActivityLogRef {
  ...
  (dc: DataConnect, vars: UpdateActivityLogVariables): MutationRef<UpdateActivityLogData, UpdateActivityLogVariables>;
}
export const updateActivityLogRef: UpdateActivityLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateActivityLogRef:
```typescript
const name = updateActivityLogRef.operationName;
console.log(name);
```

### Variables
The `UpdateActivityLog` mutation requires an argument of type `UpdateActivityLogVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateActivityLogVariables {
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  userId?: string | null;
  userName?: string | null;
  actionType?: string | null;
  module?: string | null;
  description?: string | null;
  recordId?: string | null;
}
```
### Return Type
Recall that executing the `UpdateActivityLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateActivityLogData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateActivityLogData {
  activityLog_update?: ActivityLog_Key | null;
}
```
### Using `UpdateActivityLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateActivityLog, UpdateActivityLogVariables } from '@dataconnect/generated';

// The `UpdateActivityLog` mutation requires an argument of type `UpdateActivityLogVariables`:
const updateActivityLogVars: UpdateActivityLogVariables = {
  id: ..., 
  tenantId: ..., // optional
  businessId: ..., // optional
  userId: ..., // optional
  userName: ..., // optional
  actionType: ..., // optional
  module: ..., // optional
  description: ..., // optional
  recordId: ..., // optional
};

// Call the `updateActivityLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateActivityLog(updateActivityLogVars);
// Variables can be defined inline as well.
const { data } = await updateActivityLog({ id: ..., tenantId: ..., businessId: ..., userId: ..., userName: ..., actionType: ..., module: ..., description: ..., recordId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateActivityLog(dataConnect, updateActivityLogVars);

console.log(data.activityLog_update);

// Or, you can use the `Promise` API.
updateActivityLog(updateActivityLogVars).then((response) => {
  const data = response.data;
  console.log(data.activityLog_update);
});
```

### Using `UpdateActivityLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateActivityLogRef, UpdateActivityLogVariables } from '@dataconnect/generated';

// The `UpdateActivityLog` mutation requires an argument of type `UpdateActivityLogVariables`:
const updateActivityLogVars: UpdateActivityLogVariables = {
  id: ..., 
  tenantId: ..., // optional
  businessId: ..., // optional
  userId: ..., // optional
  userName: ..., // optional
  actionType: ..., // optional
  module: ..., // optional
  description: ..., // optional
  recordId: ..., // optional
};

// Call the `updateActivityLogRef()` function to get a reference to the mutation.
const ref = updateActivityLogRef(updateActivityLogVars);
// Variables can be defined inline as well.
const ref = updateActivityLogRef({ id: ..., tenantId: ..., businessId: ..., userId: ..., userName: ..., actionType: ..., module: ..., description: ..., recordId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateActivityLogRef(dataConnect, updateActivityLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.activityLog_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.activityLog_update);
});
```

## DeleteActivityLog
You can execute the `DeleteActivityLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteActivityLog(vars: DeleteActivityLogVariables): MutationPromise<DeleteActivityLogData, DeleteActivityLogVariables>;

interface DeleteActivityLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteActivityLogVariables): MutationRef<DeleteActivityLogData, DeleteActivityLogVariables>;
}
export const deleteActivityLogRef: DeleteActivityLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteActivityLog(dc: DataConnect, vars: DeleteActivityLogVariables): MutationPromise<DeleteActivityLogData, DeleteActivityLogVariables>;

interface DeleteActivityLogRef {
  ...
  (dc: DataConnect, vars: DeleteActivityLogVariables): MutationRef<DeleteActivityLogData, DeleteActivityLogVariables>;
}
export const deleteActivityLogRef: DeleteActivityLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteActivityLogRef:
```typescript
const name = deleteActivityLogRef.operationName;
console.log(name);
```

### Variables
The `DeleteActivityLog` mutation requires an argument of type `DeleteActivityLogVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteActivityLogVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteActivityLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteActivityLogData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteActivityLogData {
  activityLog_delete?: ActivityLog_Key | null;
}
```
### Using `DeleteActivityLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteActivityLog, DeleteActivityLogVariables } from '@dataconnect/generated';

// The `DeleteActivityLog` mutation requires an argument of type `DeleteActivityLogVariables`:
const deleteActivityLogVars: DeleteActivityLogVariables = {
  id: ..., 
};

// Call the `deleteActivityLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteActivityLog(deleteActivityLogVars);
// Variables can be defined inline as well.
const { data } = await deleteActivityLog({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteActivityLog(dataConnect, deleteActivityLogVars);

console.log(data.activityLog_delete);

// Or, you can use the `Promise` API.
deleteActivityLog(deleteActivityLogVars).then((response) => {
  const data = response.data;
  console.log(data.activityLog_delete);
});
```

### Using `DeleteActivityLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteActivityLogRef, DeleteActivityLogVariables } from '@dataconnect/generated';

// The `DeleteActivityLog` mutation requires an argument of type `DeleteActivityLogVariables`:
const deleteActivityLogVars: DeleteActivityLogVariables = {
  id: ..., 
};

// Call the `deleteActivityLogRef()` function to get a reference to the mutation.
const ref = deleteActivityLogRef(deleteActivityLogVars);
// Variables can be defined inline as well.
const ref = deleteActivityLogRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteActivityLogRef(dataConnect, deleteActivityLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.activityLog_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.activityLog_delete);
});
```

## CreateAiQuery
You can execute the `CreateAiQuery` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createAiQuery(vars: CreateAiQueryVariables): MutationPromise<CreateAiQueryData, CreateAiQueryVariables>;

interface CreateAiQueryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAiQueryVariables): MutationRef<CreateAiQueryData, CreateAiQueryVariables>;
}
export const createAiQueryRef: CreateAiQueryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAiQuery(dc: DataConnect, vars: CreateAiQueryVariables): MutationPromise<CreateAiQueryData, CreateAiQueryVariables>;

interface CreateAiQueryRef {
  ...
  (dc: DataConnect, vars: CreateAiQueryVariables): MutationRef<CreateAiQueryData, CreateAiQueryVariables>;
}
export const createAiQueryRef: CreateAiQueryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAiQueryRef:
```typescript
const name = createAiQueryRef.operationName;
console.log(name);
```

### Variables
The `CreateAiQuery` mutation requires an argument of type `CreateAiQueryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAiQueryVariables {
  tenantId: string;
  businessId: string;
  userId: string;
  queryText: string;
  response?: string | null;
}
```
### Return Type
Recall that executing the `CreateAiQuery` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAiQueryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAiQueryData {
  aiQuery_insert: AiQuery_Key;
}
```
### Using `CreateAiQuery`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAiQuery, CreateAiQueryVariables } from '@dataconnect/generated';

// The `CreateAiQuery` mutation requires an argument of type `CreateAiQueryVariables`:
const createAiQueryVars: CreateAiQueryVariables = {
  tenantId: ..., 
  businessId: ..., 
  userId: ..., 
  queryText: ..., 
  response: ..., // optional
};

// Call the `createAiQuery()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAiQuery(createAiQueryVars);
// Variables can be defined inline as well.
const { data } = await createAiQuery({ tenantId: ..., businessId: ..., userId: ..., queryText: ..., response: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAiQuery(dataConnect, createAiQueryVars);

console.log(data.aiQuery_insert);

// Or, you can use the `Promise` API.
createAiQuery(createAiQueryVars).then((response) => {
  const data = response.data;
  console.log(data.aiQuery_insert);
});
```

### Using `CreateAiQuery`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAiQueryRef, CreateAiQueryVariables } from '@dataconnect/generated';

// The `CreateAiQuery` mutation requires an argument of type `CreateAiQueryVariables`:
const createAiQueryVars: CreateAiQueryVariables = {
  tenantId: ..., 
  businessId: ..., 
  userId: ..., 
  queryText: ..., 
  response: ..., // optional
};

// Call the `createAiQueryRef()` function to get a reference to the mutation.
const ref = createAiQueryRef(createAiQueryVars);
// Variables can be defined inline as well.
const ref = createAiQueryRef({ tenantId: ..., businessId: ..., userId: ..., queryText: ..., response: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAiQueryRef(dataConnect, createAiQueryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.aiQuery_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.aiQuery_insert);
});
```

## UpdateAiQuery
You can execute the `UpdateAiQuery` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateAiQuery(vars: UpdateAiQueryVariables): MutationPromise<UpdateAiQueryData, UpdateAiQueryVariables>;

interface UpdateAiQueryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAiQueryVariables): MutationRef<UpdateAiQueryData, UpdateAiQueryVariables>;
}
export const updateAiQueryRef: UpdateAiQueryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateAiQuery(dc: DataConnect, vars: UpdateAiQueryVariables): MutationPromise<UpdateAiQueryData, UpdateAiQueryVariables>;

interface UpdateAiQueryRef {
  ...
  (dc: DataConnect, vars: UpdateAiQueryVariables): MutationRef<UpdateAiQueryData, UpdateAiQueryVariables>;
}
export const updateAiQueryRef: UpdateAiQueryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateAiQueryRef:
```typescript
const name = updateAiQueryRef.operationName;
console.log(name);
```

### Variables
The `UpdateAiQuery` mutation requires an argument of type `UpdateAiQueryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateAiQueryVariables {
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  userId?: string | null;
  queryText?: string | null;
  response?: string | null;
}
```
### Return Type
Recall that executing the `UpdateAiQuery` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateAiQueryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateAiQueryData {
  aiQuery_update?: AiQuery_Key | null;
}
```
### Using `UpdateAiQuery`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateAiQuery, UpdateAiQueryVariables } from '@dataconnect/generated';

// The `UpdateAiQuery` mutation requires an argument of type `UpdateAiQueryVariables`:
const updateAiQueryVars: UpdateAiQueryVariables = {
  id: ..., 
  tenantId: ..., // optional
  businessId: ..., // optional
  userId: ..., // optional
  queryText: ..., // optional
  response: ..., // optional
};

// Call the `updateAiQuery()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateAiQuery(updateAiQueryVars);
// Variables can be defined inline as well.
const { data } = await updateAiQuery({ id: ..., tenantId: ..., businessId: ..., userId: ..., queryText: ..., response: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateAiQuery(dataConnect, updateAiQueryVars);

console.log(data.aiQuery_update);

// Or, you can use the `Promise` API.
updateAiQuery(updateAiQueryVars).then((response) => {
  const data = response.data;
  console.log(data.aiQuery_update);
});
```

### Using `UpdateAiQuery`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateAiQueryRef, UpdateAiQueryVariables } from '@dataconnect/generated';

// The `UpdateAiQuery` mutation requires an argument of type `UpdateAiQueryVariables`:
const updateAiQueryVars: UpdateAiQueryVariables = {
  id: ..., 
  tenantId: ..., // optional
  businessId: ..., // optional
  userId: ..., // optional
  queryText: ..., // optional
  response: ..., // optional
};

// Call the `updateAiQueryRef()` function to get a reference to the mutation.
const ref = updateAiQueryRef(updateAiQueryVars);
// Variables can be defined inline as well.
const ref = updateAiQueryRef({ id: ..., tenantId: ..., businessId: ..., userId: ..., queryText: ..., response: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateAiQueryRef(dataConnect, updateAiQueryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.aiQuery_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.aiQuery_update);
});
```

## DeleteAiQuery
You can execute the `DeleteAiQuery` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteAiQuery(vars: DeleteAiQueryVariables): MutationPromise<DeleteAiQueryData, DeleteAiQueryVariables>;

interface DeleteAiQueryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAiQueryVariables): MutationRef<DeleteAiQueryData, DeleteAiQueryVariables>;
}
export const deleteAiQueryRef: DeleteAiQueryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteAiQuery(dc: DataConnect, vars: DeleteAiQueryVariables): MutationPromise<DeleteAiQueryData, DeleteAiQueryVariables>;

interface DeleteAiQueryRef {
  ...
  (dc: DataConnect, vars: DeleteAiQueryVariables): MutationRef<DeleteAiQueryData, DeleteAiQueryVariables>;
}
export const deleteAiQueryRef: DeleteAiQueryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteAiQueryRef:
```typescript
const name = deleteAiQueryRef.operationName;
console.log(name);
```

### Variables
The `DeleteAiQuery` mutation requires an argument of type `DeleteAiQueryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteAiQueryVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteAiQuery` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteAiQueryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteAiQueryData {
  aiQuery_delete?: AiQuery_Key | null;
}
```
### Using `DeleteAiQuery`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteAiQuery, DeleteAiQueryVariables } from '@dataconnect/generated';

// The `DeleteAiQuery` mutation requires an argument of type `DeleteAiQueryVariables`:
const deleteAiQueryVars: DeleteAiQueryVariables = {
  id: ..., 
};

// Call the `deleteAiQuery()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteAiQuery(deleteAiQueryVars);
// Variables can be defined inline as well.
const { data } = await deleteAiQuery({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteAiQuery(dataConnect, deleteAiQueryVars);

console.log(data.aiQuery_delete);

// Or, you can use the `Promise` API.
deleteAiQuery(deleteAiQueryVars).then((response) => {
  const data = response.data;
  console.log(data.aiQuery_delete);
});
```

### Using `DeleteAiQuery`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteAiQueryRef, DeleteAiQueryVariables } from '@dataconnect/generated';

// The `DeleteAiQuery` mutation requires an argument of type `DeleteAiQueryVariables`:
const deleteAiQueryVars: DeleteAiQueryVariables = {
  id: ..., 
};

// Call the `deleteAiQueryRef()` function to get a reference to the mutation.
const ref = deleteAiQueryRef(deleteAiQueryVars);
// Variables can be defined inline as well.
const ref = deleteAiQueryRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteAiQueryRef(dataConnect, deleteAiQueryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.aiQuery_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.aiQuery_delete);
});
```

## CreateNotification
You can execute the `CreateNotification` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNotification(vars: CreateNotificationVariables): MutationPromise<CreateNotificationData, CreateNotificationVariables>;

interface CreateNotificationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNotificationVariables): MutationRef<CreateNotificationData, CreateNotificationVariables>;
}
export const createNotificationRef: CreateNotificationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNotification(dc: DataConnect, vars: CreateNotificationVariables): MutationPromise<CreateNotificationData, CreateNotificationVariables>;

interface CreateNotificationRef {
  ...
  (dc: DataConnect, vars: CreateNotificationVariables): MutationRef<CreateNotificationData, CreateNotificationVariables>;
}
export const createNotificationRef: CreateNotificationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNotificationRef:
```typescript
const name = createNotificationRef.operationName;
console.log(name);
```

### Variables
The `CreateNotification` mutation requires an argument of type `CreateNotificationVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNotificationVariables {
  tenantId: string;
  businessId: string;
  userId: string;
  message: string;
  isRead: boolean;
}
```
### Return Type
Recall that executing the `CreateNotification` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNotificationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNotificationData {
  notification_insert: Notification_Key;
}
```
### Using `CreateNotification`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNotification, CreateNotificationVariables } from '@dataconnect/generated';

// The `CreateNotification` mutation requires an argument of type `CreateNotificationVariables`:
const createNotificationVars: CreateNotificationVariables = {
  tenantId: ..., 
  businessId: ..., 
  userId: ..., 
  message: ..., 
  isRead: ..., 
};

// Call the `createNotification()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNotification(createNotificationVars);
// Variables can be defined inline as well.
const { data } = await createNotification({ tenantId: ..., businessId: ..., userId: ..., message: ..., isRead: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNotification(dataConnect, createNotificationVars);

console.log(data.notification_insert);

// Or, you can use the `Promise` API.
createNotification(createNotificationVars).then((response) => {
  const data = response.data;
  console.log(data.notification_insert);
});
```

### Using `CreateNotification`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNotificationRef, CreateNotificationVariables } from '@dataconnect/generated';

// The `CreateNotification` mutation requires an argument of type `CreateNotificationVariables`:
const createNotificationVars: CreateNotificationVariables = {
  tenantId: ..., 
  businessId: ..., 
  userId: ..., 
  message: ..., 
  isRead: ..., 
};

// Call the `createNotificationRef()` function to get a reference to the mutation.
const ref = createNotificationRef(createNotificationVars);
// Variables can be defined inline as well.
const ref = createNotificationRef({ tenantId: ..., businessId: ..., userId: ..., message: ..., isRead: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNotificationRef(dataConnect, createNotificationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.notification_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.notification_insert);
});
```

## UpdateNotification
You can execute the `UpdateNotification` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateNotification(vars: UpdateNotificationVariables): MutationPromise<UpdateNotificationData, UpdateNotificationVariables>;

interface UpdateNotificationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateNotificationVariables): MutationRef<UpdateNotificationData, UpdateNotificationVariables>;
}
export const updateNotificationRef: UpdateNotificationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateNotification(dc: DataConnect, vars: UpdateNotificationVariables): MutationPromise<UpdateNotificationData, UpdateNotificationVariables>;

interface UpdateNotificationRef {
  ...
  (dc: DataConnect, vars: UpdateNotificationVariables): MutationRef<UpdateNotificationData, UpdateNotificationVariables>;
}
export const updateNotificationRef: UpdateNotificationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateNotificationRef:
```typescript
const name = updateNotificationRef.operationName;
console.log(name);
```

### Variables
The `UpdateNotification` mutation requires an argument of type `UpdateNotificationVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateNotificationVariables {
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  userId?: string | null;
  message?: string | null;
  isRead?: boolean | null;
}
```
### Return Type
Recall that executing the `UpdateNotification` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateNotificationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateNotificationData {
  notification_update?: Notification_Key | null;
}
```
### Using `UpdateNotification`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateNotification, UpdateNotificationVariables } from '@dataconnect/generated';

// The `UpdateNotification` mutation requires an argument of type `UpdateNotificationVariables`:
const updateNotificationVars: UpdateNotificationVariables = {
  id: ..., 
  tenantId: ..., // optional
  businessId: ..., // optional
  userId: ..., // optional
  message: ..., // optional
  isRead: ..., // optional
};

// Call the `updateNotification()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateNotification(updateNotificationVars);
// Variables can be defined inline as well.
const { data } = await updateNotification({ id: ..., tenantId: ..., businessId: ..., userId: ..., message: ..., isRead: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateNotification(dataConnect, updateNotificationVars);

console.log(data.notification_update);

// Or, you can use the `Promise` API.
updateNotification(updateNotificationVars).then((response) => {
  const data = response.data;
  console.log(data.notification_update);
});
```

### Using `UpdateNotification`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateNotificationRef, UpdateNotificationVariables } from '@dataconnect/generated';

// The `UpdateNotification` mutation requires an argument of type `UpdateNotificationVariables`:
const updateNotificationVars: UpdateNotificationVariables = {
  id: ..., 
  tenantId: ..., // optional
  businessId: ..., // optional
  userId: ..., // optional
  message: ..., // optional
  isRead: ..., // optional
};

// Call the `updateNotificationRef()` function to get a reference to the mutation.
const ref = updateNotificationRef(updateNotificationVars);
// Variables can be defined inline as well.
const ref = updateNotificationRef({ id: ..., tenantId: ..., businessId: ..., userId: ..., message: ..., isRead: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateNotificationRef(dataConnect, updateNotificationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.notification_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.notification_update);
});
```

## DeleteNotification
You can execute the `DeleteNotification` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteNotification(vars: DeleteNotificationVariables): MutationPromise<DeleteNotificationData, DeleteNotificationVariables>;

interface DeleteNotificationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteNotificationVariables): MutationRef<DeleteNotificationData, DeleteNotificationVariables>;
}
export const deleteNotificationRef: DeleteNotificationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteNotification(dc: DataConnect, vars: DeleteNotificationVariables): MutationPromise<DeleteNotificationData, DeleteNotificationVariables>;

interface DeleteNotificationRef {
  ...
  (dc: DataConnect, vars: DeleteNotificationVariables): MutationRef<DeleteNotificationData, DeleteNotificationVariables>;
}
export const deleteNotificationRef: DeleteNotificationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteNotificationRef:
```typescript
const name = deleteNotificationRef.operationName;
console.log(name);
```

### Variables
The `DeleteNotification` mutation requires an argument of type `DeleteNotificationVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteNotificationVariables {
  id: string;
}
```
### Return Type
Recall that executing the `DeleteNotification` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteNotificationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteNotificationData {
  notification_delete?: Notification_Key | null;
}
```
### Using `DeleteNotification`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteNotification, DeleteNotificationVariables } from '@dataconnect/generated';

// The `DeleteNotification` mutation requires an argument of type `DeleteNotificationVariables`:
const deleteNotificationVars: DeleteNotificationVariables = {
  id: ..., 
};

// Call the `deleteNotification()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteNotification(deleteNotificationVars);
// Variables can be defined inline as well.
const { data } = await deleteNotification({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteNotification(dataConnect, deleteNotificationVars);

console.log(data.notification_delete);

// Or, you can use the `Promise` API.
deleteNotification(deleteNotificationVars).then((response) => {
  const data = response.data;
  console.log(data.notification_delete);
});
```

### Using `DeleteNotification`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteNotificationRef, DeleteNotificationVariables } from '@dataconnect/generated';

// The `DeleteNotification` mutation requires an argument of type `DeleteNotificationVariables`:
const deleteNotificationVars: DeleteNotificationVariables = {
  id: ..., 
};

// Call the `deleteNotificationRef()` function to get a reference to the mutation.
const ref = deleteNotificationRef(deleteNotificationVars);
// Variables can be defined inline as well.
const ref = deleteNotificationRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteNotificationRef(dataConnect, deleteNotificationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.notification_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.notification_delete);
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
  tenantId: string;
  businessId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority?: TaskPriority | null;
  dueDate: TimestampString;
  assignedToId?: string | null;
  createdBy: string;
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
  tenantId: ..., 
  businessId: ..., 
  title: ..., 
  description: ..., // optional
  status: ..., 
  priority: ..., // optional
  dueDate: ..., 
  assignedToId: ..., // optional
  createdBy: ..., 
};

// Call the `createTask()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTask(createTaskVars);
// Variables can be defined inline as well.
const { data } = await createTask({ tenantId: ..., businessId: ..., title: ..., description: ..., status: ..., priority: ..., dueDate: ..., assignedToId: ..., createdBy: ..., });

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
  tenantId: ..., 
  businessId: ..., 
  title: ..., 
  description: ..., // optional
  status: ..., 
  priority: ..., // optional
  dueDate: ..., 
  assignedToId: ..., // optional
  createdBy: ..., 
};

// Call the `createTaskRef()` function to get a reference to the mutation.
const ref = createTaskRef(createTaskVars);
// Variables can be defined inline as well.
const ref = createTaskRef({ tenantId: ..., businessId: ..., title: ..., description: ..., status: ..., priority: ..., dueDate: ..., assignedToId: ..., createdBy: ..., });

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
  id: string;
  title?: string | null;
  description?: string | null;
  status?: TaskStatus | null;
  priority?: TaskPriority | null;
  dueDate?: TimestampString | null;
  assignedToId?: string | null;
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
  title: ..., // optional
  description: ..., // optional
  status: ..., // optional
  priority: ..., // optional
  dueDate: ..., // optional
  assignedToId: ..., // optional
};

// Call the `updateTask()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTask(updateTaskVars);
// Variables can be defined inline as well.
const { data } = await updateTask({ id: ..., title: ..., description: ..., status: ..., priority: ..., dueDate: ..., assignedToId: ..., });

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
  title: ..., // optional
  description: ..., // optional
  status: ..., // optional
  priority: ..., // optional
  dueDate: ..., // optional
  assignedToId: ..., // optional
};

// Call the `updateTaskRef()` function to get a reference to the mutation.
const ref = updateTaskRef(updateTaskVars);
// Variables can be defined inline as well.
const ref = updateTaskRef({ id: ..., title: ..., description: ..., status: ..., priority: ..., dueDate: ..., assignedToId: ..., });

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
  id: string;
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

