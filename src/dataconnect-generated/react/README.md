# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect-generated/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@dataconnect/generated/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
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

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `example`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `example` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## ListTenants
You can execute the `ListTenants` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListTenants(dc: DataConnect, options?: useDataConnectQueryOptions<ListTenantsData>): UseDataConnectQueryResult<ListTenantsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListTenants(options?: useDataConnectQueryOptions<ListTenantsData>): UseDataConnectQueryResult<ListTenantsData, undefined>;
```

### Variables
The `ListTenants` Query has no variables.
### Return Type
Recall that calling the `ListTenants` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListTenants` Query is of type `ListTenantsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListTenantsData {
  tenants: ({
    id: UUIDString;
    name: string;
    businessSector: string;
  } & Tenant_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListTenants`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListTenants } from '@dataconnect/generated/react'

export default function ListTenantsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListTenants();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListTenants(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListTenants(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListTenants(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.tenants);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListUsers
You can execute the `ListUsers` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListUsers(dc: DataConnect, vars: ListUsersVariables, options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, ListUsersVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListUsers(vars: ListUsersVariables, options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, ListUsersVariables>;
```

### Variables
The `ListUsers` Query requires an argument of type `ListUsersVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListUsersVariables {
  tenantId: UUIDString;
}
```
### Return Type
Recall that calling the `ListUsers` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListUsers` Query is of type `ListUsersData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListUsersData {
  users: ({
    id: UUIDString;
    email: string;
    role: string;
  } & User_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListUsers`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListUsersVariables } from '@dataconnect/generated';
import { useListUsers } from '@dataconnect/generated/react'

export default function ListUsersComponent() {
  // The `useListUsers` Query hook requires an argument of type `ListUsersVariables`:
  const listUsersVars: ListUsersVariables = {
    tenantId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListUsers(listUsersVars);
  // Variables can be defined inline as well.
  const query = useListUsers({ tenantId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListUsers(dataConnect, listUsersVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListUsers(listUsersVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListUsers(dataConnect, listUsersVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.users);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListBusinesses
You can execute the `ListBusinesses` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListBusinesses(dc: DataConnect, vars: ListBusinessesVariables, options?: useDataConnectQueryOptions<ListBusinessesData>): UseDataConnectQueryResult<ListBusinessesData, ListBusinessesVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListBusinesses(vars: ListBusinessesVariables, options?: useDataConnectQueryOptions<ListBusinessesData>): UseDataConnectQueryResult<ListBusinessesData, ListBusinessesVariables>;
```

### Variables
The `ListBusinesses` Query requires an argument of type `ListBusinessesVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListBusinessesVariables {
  tenantId: UUIDString;
}
```
### Return Type
Recall that calling the `ListBusinesses` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListBusinesses` Query is of type `ListBusinessesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListBusinessesData {
  businesses: ({
    id: UUIDString;
    name: string;
    location: string;
  } & Business_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListBusinesses`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListBusinessesVariables } from '@dataconnect/generated';
import { useListBusinesses } from '@dataconnect/generated/react'

export default function ListBusinessesComponent() {
  // The `useListBusinesses` Query hook requires an argument of type `ListBusinessesVariables`:
  const listBusinessesVars: ListBusinessesVariables = {
    tenantId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListBusinesses(listBusinessesVars);
  // Variables can be defined inline as well.
  const query = useListBusinesses({ tenantId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListBusinesses(dataConnect, listBusinessesVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListBusinesses(listBusinessesVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListBusinesses(dataConnect, listBusinessesVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.businesses);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListProducts
You can execute the `ListProducts` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListProducts(dc: DataConnect, vars: ListProductsVariables, options?: useDataConnectQueryOptions<ListProductsData>): UseDataConnectQueryResult<ListProductsData, ListProductsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListProducts(vars: ListProductsVariables, options?: useDataConnectQueryOptions<ListProductsData>): UseDataConnectQueryResult<ListProductsData, ListProductsVariables>;
```

### Variables
The `ListProducts` Query requires an argument of type `ListProductsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListProductsVariables {
  businessId: UUIDString;
}
```
### Return Type
Recall that calling the `ListProducts` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListProducts` Query is of type `ListProductsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListProductsData {
  products: ({
    id: UUIDString;
    name: string;
    sellingPrice: number;
  } & Product_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListProducts`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListProductsVariables } from '@dataconnect/generated';
import { useListProducts } from '@dataconnect/generated/react'

export default function ListProductsComponent() {
  // The `useListProducts` Query hook requires an argument of type `ListProductsVariables`:
  const listProductsVars: ListProductsVariables = {
    businessId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListProducts(listProductsVars);
  // Variables can be defined inline as well.
  const query = useListProducts({ businessId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListProducts(dataConnect, listProductsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListProducts(listProductsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListProducts(dataConnect, listProductsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.products);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListTransactions
You can execute the `ListTransactions` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListTransactions(dc: DataConnect, vars: ListTransactionsVariables, options?: useDataConnectQueryOptions<ListTransactionsData>): UseDataConnectQueryResult<ListTransactionsData, ListTransactionsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListTransactions(vars: ListTransactionsVariables, options?: useDataConnectQueryOptions<ListTransactionsData>): UseDataConnectQueryResult<ListTransactionsData, ListTransactionsVariables>;
```

### Variables
The `ListTransactions` Query requires an argument of type `ListTransactionsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListTransactionsVariables {
  businessId: UUIDString;
}
```
### Return Type
Recall that calling the `ListTransactions` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListTransactions` Query is of type `ListTransactionsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListTransactionsData {
  transactions: ({
    id: UUIDString;
    type: string;
    amount: number;
  } & Transaction_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListTransactions`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListTransactionsVariables } from '@dataconnect/generated';
import { useListTransactions } from '@dataconnect/generated/react'

export default function ListTransactionsComponent() {
  // The `useListTransactions` Query hook requires an argument of type `ListTransactionsVariables`:
  const listTransactionsVars: ListTransactionsVariables = {
    businessId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListTransactions(listTransactionsVars);
  // Variables can be defined inline as well.
  const query = useListTransactions({ businessId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListTransactions(dataConnect, listTransactionsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListTransactions(listTransactionsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListTransactions(dataConnect, listTransactionsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.transactions);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListTasks
You can execute the `ListTasks` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListTasks(dc: DataConnect, vars: ListTasksVariables, options?: useDataConnectQueryOptions<ListTasksData>): UseDataConnectQueryResult<ListTasksData, ListTasksVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListTasks(vars: ListTasksVariables, options?: useDataConnectQueryOptions<ListTasksData>): UseDataConnectQueryResult<ListTasksData, ListTasksVariables>;
```

### Variables
The `ListTasks` Query requires an argument of type `ListTasksVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListTasksVariables {
  businessId: UUIDString;
}
```
### Return Type
Recall that calling the `ListTasks` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListTasks` Query is of type `ListTasksData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListTasksData {
  tasks: ({
    id: UUIDString;
    title: string;
    status: string;
  } & Task_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListTasks`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListTasksVariables } from '@dataconnect/generated';
import { useListTasks } from '@dataconnect/generated/react'

export default function ListTasksComponent() {
  // The `useListTasks` Query hook requires an argument of type `ListTasksVariables`:
  const listTasksVars: ListTasksVariables = {
    businessId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListTasks(listTasksVars);
  // Variables can be defined inline as well.
  const query = useListTasks({ businessId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListTasks(dataConnect, listTasksVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListTasks(listTasksVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListTasks(dataConnect, listTasksVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.tasks);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListEmployees
You can execute the `ListEmployees` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListEmployees(dc: DataConnect, vars: ListEmployeesVariables, options?: useDataConnectQueryOptions<ListEmployeesData>): UseDataConnectQueryResult<ListEmployeesData, ListEmployeesVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListEmployees(vars: ListEmployeesVariables, options?: useDataConnectQueryOptions<ListEmployeesData>): UseDataConnectQueryResult<ListEmployeesData, ListEmployeesVariables>;
```

### Variables
The `ListEmployees` Query requires an argument of type `ListEmployeesVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListEmployeesVariables {
  businessId: UUIDString;
}
```
### Return Type
Recall that calling the `ListEmployees` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListEmployees` Query is of type `ListEmployeesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListEmployeesData {
  employees: ({
    id: UUIDString;
    fullName: string;
  } & Employee_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListEmployees`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListEmployeesVariables } from '@dataconnect/generated';
import { useListEmployees } from '@dataconnect/generated/react'

export default function ListEmployeesComponent() {
  // The `useListEmployees` Query hook requires an argument of type `ListEmployeesVariables`:
  const listEmployeesVars: ListEmployeesVariables = {
    businessId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListEmployees(listEmployeesVars);
  // Variables can be defined inline as well.
  const query = useListEmployees({ businessId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListEmployees(dataConnect, listEmployeesVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListEmployees(listEmployeesVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListEmployees(dataConnect, listEmployeesVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.employees);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListCustomers
You can execute the `ListCustomers` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListCustomers(dc: DataConnect, vars: ListCustomersVariables, options?: useDataConnectQueryOptions<ListCustomersData>): UseDataConnectQueryResult<ListCustomersData, ListCustomersVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListCustomers(vars: ListCustomersVariables, options?: useDataConnectQueryOptions<ListCustomersData>): UseDataConnectQueryResult<ListCustomersData, ListCustomersVariables>;
```

### Variables
The `ListCustomers` Query requires an argument of type `ListCustomersVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListCustomersVariables {
  businessId: UUIDString;
}
```
### Return Type
Recall that calling the `ListCustomers` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListCustomers` Query is of type `ListCustomersData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListCustomersData {
  customers: ({
    id: UUIDString;
    customerName: string;
  } & Customer_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListCustomers`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListCustomersVariables } from '@dataconnect/generated';
import { useListCustomers } from '@dataconnect/generated/react'

export default function ListCustomersComponent() {
  // The `useListCustomers` Query hook requires an argument of type `ListCustomersVariables`:
  const listCustomersVars: ListCustomersVariables = {
    businessId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListCustomers(listCustomersVars);
  // Variables can be defined inline as well.
  const query = useListCustomers({ businessId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListCustomers(dataConnect, listCustomersVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListCustomers(listCustomersVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListCustomers(dataConnect, listCustomersVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.customers);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListSuppliers
You can execute the `ListSuppliers` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListSuppliers(dc: DataConnect, vars: ListSuppliersVariables, options?: useDataConnectQueryOptions<ListSuppliersData>): UseDataConnectQueryResult<ListSuppliersData, ListSuppliersVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListSuppliers(vars: ListSuppliersVariables, options?: useDataConnectQueryOptions<ListSuppliersData>): UseDataConnectQueryResult<ListSuppliersData, ListSuppliersVariables>;
```

### Variables
The `ListSuppliers` Query requires an argument of type `ListSuppliersVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListSuppliersVariables {
  businessId: UUIDString;
}
```
### Return Type
Recall that calling the `ListSuppliers` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListSuppliers` Query is of type `ListSuppliersData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListSuppliersData {
  suppliers: ({
    id: UUIDString;
    supplierName: string;
  } & Supplier_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListSuppliers`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListSuppliersVariables } from '@dataconnect/generated';
import { useListSuppliers } from '@dataconnect/generated/react'

export default function ListSuppliersComponent() {
  // The `useListSuppliers` Query hook requires an argument of type `ListSuppliersVariables`:
  const listSuppliersVars: ListSuppliersVariables = {
    businessId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListSuppliers(listSuppliersVars);
  // Variables can be defined inline as well.
  const query = useListSuppliers({ businessId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListSuppliers(dataConnect, listSuppliersVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListSuppliers(listSuppliersVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListSuppliers(dataConnect, listSuppliersVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.suppliers);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListDocuments
You can execute the `ListDocuments` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListDocuments(dc: DataConnect, vars: ListDocumentsVariables, options?: useDataConnectQueryOptions<ListDocumentsData>): UseDataConnectQueryResult<ListDocumentsData, ListDocumentsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListDocuments(vars: ListDocumentsVariables, options?: useDataConnectQueryOptions<ListDocumentsData>): UseDataConnectQueryResult<ListDocumentsData, ListDocumentsVariables>;
```

### Variables
The `ListDocuments` Query requires an argument of type `ListDocumentsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListDocumentsVariables {
  businessId: UUIDString;
}
```
### Return Type
Recall that calling the `ListDocuments` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListDocuments` Query is of type `ListDocumentsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListDocumentsData {
  documents: ({
    id: UUIDString;
    title: string;
  } & Document_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListDocuments`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListDocumentsVariables } from '@dataconnect/generated';
import { useListDocuments } from '@dataconnect/generated/react'

export default function ListDocumentsComponent() {
  // The `useListDocuments` Query hook requires an argument of type `ListDocumentsVariables`:
  const listDocumentsVars: ListDocumentsVariables = {
    businessId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListDocuments(listDocumentsVars);
  // Variables can be defined inline as well.
  const query = useListDocuments({ businessId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListDocuments(dataConnect, listDocumentsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListDocuments(listDocumentsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListDocuments(dataConnect, listDocumentsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.documents);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `example` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## CreateTenant
You can execute the `CreateTenant` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateTenant(options?: useDataConnectMutationOptions<CreateTenantData, FirebaseError, CreateTenantVariables>): UseDataConnectMutationResult<CreateTenantData, CreateTenantVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateTenant(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTenantData, FirebaseError, CreateTenantVariables>): UseDataConnectMutationResult<CreateTenantData, CreateTenantVariables>;
```

### Variables
The `CreateTenant` Mutation requires an argument of type `CreateTenantVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateTenant` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateTenant` Mutation is of type `CreateTenantData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateTenantData {
  tenant_insert: Tenant_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateTenant`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateTenantVariables } from '@dataconnect/generated';
import { useCreateTenant } from '@dataconnect/generated/react'

export default function CreateTenantComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateTenant();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateTenant(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateTenant(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateTenant(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateTenant` Mutation requires an argument of type `CreateTenantVariables`:
  const createTenantVars: CreateTenantVariables = {
    data: ..., 
  };
  mutation.mutate(createTenantVars);
  // Variables can be defined inline as well.
  mutation.mutate({ data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createTenantVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.tenant_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateTenant
You can execute the `UpdateTenant` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateTenant(options?: useDataConnectMutationOptions<UpdateTenantData, FirebaseError, UpdateTenantVariables>): UseDataConnectMutationResult<UpdateTenantData, UpdateTenantVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateTenant(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTenantData, FirebaseError, UpdateTenantVariables>): UseDataConnectMutationResult<UpdateTenantData, UpdateTenantVariables>;
```

### Variables
The `UpdateTenant` Mutation requires an argument of type `UpdateTenantVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpdateTenant` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateTenant` Mutation is of type `UpdateTenantData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateTenantData {
  tenant_update?: Tenant_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateTenant`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateTenantVariables } from '@dataconnect/generated';
import { useUpdateTenant } from '@dataconnect/generated/react'

export default function UpdateTenantComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateTenant();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateTenant(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateTenant(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateTenant(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateTenant` Mutation requires an argument of type `UpdateTenantVariables`:
  const updateTenantVars: UpdateTenantVariables = {
    id: ..., 
    data: ..., 
  };
  mutation.mutate(updateTenantVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateTenantVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.tenant_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteTenant
You can execute the `DeleteTenant` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteTenant(options?: useDataConnectMutationOptions<DeleteTenantData, FirebaseError, DeleteTenantVariables>): UseDataConnectMutationResult<DeleteTenantData, DeleteTenantVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteTenant(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTenantData, FirebaseError, DeleteTenantVariables>): UseDataConnectMutationResult<DeleteTenantData, DeleteTenantVariables>;
```

### Variables
The `DeleteTenant` Mutation requires an argument of type `DeleteTenantVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteTenantVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteTenant` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteTenant` Mutation is of type `DeleteTenantData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteTenantData {
  tenant_delete?: Tenant_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteTenant`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteTenantVariables } from '@dataconnect/generated';
import { useDeleteTenant } from '@dataconnect/generated/react'

export default function DeleteTenantComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteTenant();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteTenant(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteTenant(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteTenant(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteTenant` Mutation requires an argument of type `DeleteTenantVariables`:
  const deleteTenantVars: DeleteTenantVariables = {
    id: ..., 
  };
  mutation.mutate(deleteTenantVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteTenantVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.tenant_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateUser
You can execute the `CreateUser` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
```

### Variables
The `CreateUser` Mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateUser` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateUser` Mutation is of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateUserData {
  user_insert: User_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateUser`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateUserVariables } from '@dataconnect/generated';
import { useCreateUser } from '@dataconnect/generated/react'

export default function CreateUserComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateUser();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateUser(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateUser(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateUser(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateUser` Mutation requires an argument of type `CreateUserVariables`:
  const createUserVars: CreateUserVariables = {
    data: ..., 
  };
  mutation.mutate(createUserVars);
  // Variables can be defined inline as well.
  mutation.mutate({ data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createUserVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.user_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateUser
You can execute the `UpdateUser` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateUser(options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, UpdateUserVariables>): UseDataConnectMutationResult<UpdateUserData, UpdateUserVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, UpdateUserVariables>): UseDataConnectMutationResult<UpdateUserData, UpdateUserVariables>;
```

### Variables
The `UpdateUser` Mutation requires an argument of type `UpdateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpdateUser` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateUser` Mutation is of type `UpdateUserData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateUserData {
  user_update?: User_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateUser`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateUserVariables } from '@dataconnect/generated';
import { useUpdateUser } from '@dataconnect/generated/react'

export default function UpdateUserComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateUser();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateUser(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateUser(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateUser(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateUser` Mutation requires an argument of type `UpdateUserVariables`:
  const updateUserVars: UpdateUserVariables = {
    id: ..., 
    data: ..., 
  };
  mutation.mutate(updateUserVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateUserVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.user_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteUser
You can execute the `DeleteUser` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteUser(options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, DeleteUserVariables>): UseDataConnectMutationResult<DeleteUserData, DeleteUserVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteUser(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, DeleteUserVariables>): UseDataConnectMutationResult<DeleteUserData, DeleteUserVariables>;
```

### Variables
The `DeleteUser` Mutation requires an argument of type `DeleteUserVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteUserVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteUser` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteUser` Mutation is of type `DeleteUserData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteUser`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteUserVariables } from '@dataconnect/generated';
import { useDeleteUser } from '@dataconnect/generated/react'

export default function DeleteUserComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteUser();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteUser(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteUser(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteUser(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteUser` Mutation requires an argument of type `DeleteUserVariables`:
  const deleteUserVars: DeleteUserVariables = {
    id: ..., 
  };
  mutation.mutate(deleteUserVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteUserVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.user_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateBusiness
You can execute the `CreateBusiness` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateBusiness(options?: useDataConnectMutationOptions<CreateBusinessData, FirebaseError, CreateBusinessVariables>): UseDataConnectMutationResult<CreateBusinessData, CreateBusinessVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateBusiness(dc: DataConnect, options?: useDataConnectMutationOptions<CreateBusinessData, FirebaseError, CreateBusinessVariables>): UseDataConnectMutationResult<CreateBusinessData, CreateBusinessVariables>;
```

### Variables
The `CreateBusiness` Mutation requires an argument of type `CreateBusinessVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateBusiness` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateBusiness` Mutation is of type `CreateBusinessData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateBusinessData {
  business_insert: Business_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateBusiness`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateBusinessVariables } from '@dataconnect/generated';
import { useCreateBusiness } from '@dataconnect/generated/react'

export default function CreateBusinessComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateBusiness();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateBusiness(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateBusiness(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateBusiness(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateBusiness` Mutation requires an argument of type `CreateBusinessVariables`:
  const createBusinessVars: CreateBusinessVariables = {
    data: ..., 
  };
  mutation.mutate(createBusinessVars);
  // Variables can be defined inline as well.
  mutation.mutate({ data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createBusinessVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.business_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateBusiness
You can execute the `UpdateBusiness` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateBusiness(options?: useDataConnectMutationOptions<UpdateBusinessData, FirebaseError, UpdateBusinessVariables>): UseDataConnectMutationResult<UpdateBusinessData, UpdateBusinessVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateBusiness(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateBusinessData, FirebaseError, UpdateBusinessVariables>): UseDataConnectMutationResult<UpdateBusinessData, UpdateBusinessVariables>;
```

### Variables
The `UpdateBusiness` Mutation requires an argument of type `UpdateBusinessVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpdateBusiness` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateBusiness` Mutation is of type `UpdateBusinessData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateBusinessData {
  business_update?: Business_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateBusiness`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateBusinessVariables } from '@dataconnect/generated';
import { useUpdateBusiness } from '@dataconnect/generated/react'

export default function UpdateBusinessComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateBusiness();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateBusiness(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateBusiness(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateBusiness(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateBusiness` Mutation requires an argument of type `UpdateBusinessVariables`:
  const updateBusinessVars: UpdateBusinessVariables = {
    id: ..., 
    data: ..., 
  };
  mutation.mutate(updateBusinessVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateBusinessVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.business_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteBusiness
You can execute the `DeleteBusiness` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteBusiness(options?: useDataConnectMutationOptions<DeleteBusinessData, FirebaseError, DeleteBusinessVariables>): UseDataConnectMutationResult<DeleteBusinessData, DeleteBusinessVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteBusiness(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteBusinessData, FirebaseError, DeleteBusinessVariables>): UseDataConnectMutationResult<DeleteBusinessData, DeleteBusinessVariables>;
```

### Variables
The `DeleteBusiness` Mutation requires an argument of type `DeleteBusinessVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteBusinessVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteBusiness` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteBusiness` Mutation is of type `DeleteBusinessData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteBusinessData {
  business_delete?: Business_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteBusiness`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteBusinessVariables } from '@dataconnect/generated';
import { useDeleteBusiness } from '@dataconnect/generated/react'

export default function DeleteBusinessComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteBusiness();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteBusiness(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteBusiness(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteBusiness(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteBusiness` Mutation requires an argument of type `DeleteBusinessVariables`:
  const deleteBusinessVars: DeleteBusinessVariables = {
    id: ..., 
  };
  mutation.mutate(deleteBusinessVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteBusinessVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.business_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateProduct
You can execute the `CreateProduct` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateProduct(options?: useDataConnectMutationOptions<CreateProductData, FirebaseError, CreateProductVariables>): UseDataConnectMutationResult<CreateProductData, CreateProductVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateProduct(dc: DataConnect, options?: useDataConnectMutationOptions<CreateProductData, FirebaseError, CreateProductVariables>): UseDataConnectMutationResult<CreateProductData, CreateProductVariables>;
```

### Variables
The `CreateProduct` Mutation requires an argument of type `CreateProductVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateProduct` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateProduct` Mutation is of type `CreateProductData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateProductData {
  product_insert: Product_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateProduct`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateProductVariables } from '@dataconnect/generated';
import { useCreateProduct } from '@dataconnect/generated/react'

export default function CreateProductComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateProduct();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateProduct(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateProduct(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateProduct(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateProduct` Mutation requires an argument of type `CreateProductVariables`:
  const createProductVars: CreateProductVariables = {
    data: ..., 
  };
  mutation.mutate(createProductVars);
  // Variables can be defined inline as well.
  mutation.mutate({ data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createProductVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.product_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateProduct
You can execute the `UpdateProduct` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateProduct(options?: useDataConnectMutationOptions<UpdateProductData, FirebaseError, UpdateProductVariables>): UseDataConnectMutationResult<UpdateProductData, UpdateProductVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateProduct(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateProductData, FirebaseError, UpdateProductVariables>): UseDataConnectMutationResult<UpdateProductData, UpdateProductVariables>;
```

### Variables
The `UpdateProduct` Mutation requires an argument of type `UpdateProductVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpdateProduct` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateProduct` Mutation is of type `UpdateProductData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateProductData {
  product_update?: Product_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateProduct`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateProductVariables } from '@dataconnect/generated';
import { useUpdateProduct } from '@dataconnect/generated/react'

export default function UpdateProductComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateProduct();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateProduct(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateProduct(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateProduct(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateProduct` Mutation requires an argument of type `UpdateProductVariables`:
  const updateProductVars: UpdateProductVariables = {
    id: ..., 
    data: ..., 
  };
  mutation.mutate(updateProductVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateProductVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.product_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteProduct
You can execute the `DeleteProduct` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteProduct(options?: useDataConnectMutationOptions<DeleteProductData, FirebaseError, DeleteProductVariables>): UseDataConnectMutationResult<DeleteProductData, DeleteProductVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteProduct(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteProductData, FirebaseError, DeleteProductVariables>): UseDataConnectMutationResult<DeleteProductData, DeleteProductVariables>;
```

### Variables
The `DeleteProduct` Mutation requires an argument of type `DeleteProductVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteProductVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteProduct` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteProduct` Mutation is of type `DeleteProductData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteProductData {
  product_delete?: Product_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteProduct`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteProductVariables } from '@dataconnect/generated';
import { useDeleteProduct } from '@dataconnect/generated/react'

export default function DeleteProductComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteProduct();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteProduct(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteProduct(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteProduct(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteProduct` Mutation requires an argument of type `DeleteProductVariables`:
  const deleteProductVars: DeleteProductVariables = {
    id: ..., 
  };
  mutation.mutate(deleteProductVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteProductVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.product_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateTransaction
You can execute the `CreateTransaction` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateTransaction(options?: useDataConnectMutationOptions<CreateTransactionData, FirebaseError, CreateTransactionVariables>): UseDataConnectMutationResult<CreateTransactionData, CreateTransactionVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateTransaction(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTransactionData, FirebaseError, CreateTransactionVariables>): UseDataConnectMutationResult<CreateTransactionData, CreateTransactionVariables>;
```

### Variables
The `CreateTransaction` Mutation requires an argument of type `CreateTransactionVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateTransaction` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateTransaction` Mutation is of type `CreateTransactionData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateTransactionData {
  transaction_insert: Transaction_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateTransaction`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateTransactionVariables } from '@dataconnect/generated';
import { useCreateTransaction } from '@dataconnect/generated/react'

export default function CreateTransactionComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateTransaction();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateTransaction(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateTransaction(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateTransaction(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateTransaction` Mutation requires an argument of type `CreateTransactionVariables`:
  const createTransactionVars: CreateTransactionVariables = {
    data: ..., 
  };
  mutation.mutate(createTransactionVars);
  // Variables can be defined inline as well.
  mutation.mutate({ data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createTransactionVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.transaction_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateTransaction
You can execute the `UpdateTransaction` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateTransaction(options?: useDataConnectMutationOptions<UpdateTransactionData, FirebaseError, UpdateTransactionVariables>): UseDataConnectMutationResult<UpdateTransactionData, UpdateTransactionVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateTransaction(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTransactionData, FirebaseError, UpdateTransactionVariables>): UseDataConnectMutationResult<UpdateTransactionData, UpdateTransactionVariables>;
```

### Variables
The `UpdateTransaction` Mutation requires an argument of type `UpdateTransactionVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpdateTransaction` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateTransaction` Mutation is of type `UpdateTransactionData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateTransactionData {
  transaction_update?: Transaction_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateTransaction`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateTransactionVariables } from '@dataconnect/generated';
import { useUpdateTransaction } from '@dataconnect/generated/react'

export default function UpdateTransactionComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateTransaction();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateTransaction(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateTransaction(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateTransaction(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateTransaction` Mutation requires an argument of type `UpdateTransactionVariables`:
  const updateTransactionVars: UpdateTransactionVariables = {
    id: ..., 
    data: ..., 
  };
  mutation.mutate(updateTransactionVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateTransactionVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.transaction_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteTransaction
You can execute the `DeleteTransaction` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteTransaction(options?: useDataConnectMutationOptions<DeleteTransactionData, FirebaseError, DeleteTransactionVariables>): UseDataConnectMutationResult<DeleteTransactionData, DeleteTransactionVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteTransaction(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTransactionData, FirebaseError, DeleteTransactionVariables>): UseDataConnectMutationResult<DeleteTransactionData, DeleteTransactionVariables>;
```

### Variables
The `DeleteTransaction` Mutation requires an argument of type `DeleteTransactionVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteTransactionVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteTransaction` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteTransaction` Mutation is of type `DeleteTransactionData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteTransactionData {
  transaction_delete?: Transaction_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteTransaction`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteTransactionVariables } from '@dataconnect/generated';
import { useDeleteTransaction } from '@dataconnect/generated/react'

export default function DeleteTransactionComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteTransaction();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteTransaction(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteTransaction(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteTransaction(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteTransaction` Mutation requires an argument of type `DeleteTransactionVariables`:
  const deleteTransactionVars: DeleteTransactionVariables = {
    id: ..., 
  };
  mutation.mutate(deleteTransactionVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteTransactionVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.transaction_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateTask
You can execute the `CreateTask` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateTask(options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateTask(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;
```

### Variables
The `CreateTask` Mutation requires an argument of type `CreateTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateTask` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateTask` Mutation is of type `CreateTaskData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateTaskData {
  task_insert: Task_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateTask`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateTaskVariables } from '@dataconnect/generated';
import { useCreateTask } from '@dataconnect/generated/react'

export default function CreateTaskComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateTask();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateTask(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateTask(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateTask(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateTask` Mutation requires an argument of type `CreateTaskVariables`:
  const createTaskVars: CreateTaskVariables = {
    data: ..., 
  };
  mutation.mutate(createTaskVars);
  // Variables can be defined inline as well.
  mutation.mutate({ data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createTaskVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.task_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateTask
You can execute the `UpdateTask` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateTask(options?: useDataConnectMutationOptions<UpdateTaskData, FirebaseError, UpdateTaskVariables>): UseDataConnectMutationResult<UpdateTaskData, UpdateTaskVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateTask(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTaskData, FirebaseError, UpdateTaskVariables>): UseDataConnectMutationResult<UpdateTaskData, UpdateTaskVariables>;
```

### Variables
The `UpdateTask` Mutation requires an argument of type `UpdateTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpdateTask` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateTask` Mutation is of type `UpdateTaskData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateTaskData {
  task_update?: Task_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateTask`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateTaskVariables } from '@dataconnect/generated';
import { useUpdateTask } from '@dataconnect/generated/react'

export default function UpdateTaskComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateTask();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateTask(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateTask(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateTask(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateTask` Mutation requires an argument of type `UpdateTaskVariables`:
  const updateTaskVars: UpdateTaskVariables = {
    id: ..., 
    data: ..., 
  };
  mutation.mutate(updateTaskVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateTaskVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.task_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteTask
You can execute the `DeleteTask` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteTask(options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteTask(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;
```

### Variables
The `DeleteTask` Mutation requires an argument of type `DeleteTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteTaskVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteTask` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteTask` Mutation is of type `DeleteTaskData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteTaskData {
  task_delete?: Task_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteTask`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteTaskVariables } from '@dataconnect/generated';
import { useDeleteTask } from '@dataconnect/generated/react'

export default function DeleteTaskComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteTask();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteTask(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteTask(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteTask(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteTask` Mutation requires an argument of type `DeleteTaskVariables`:
  const deleteTaskVars: DeleteTaskVariables = {
    id: ..., 
  };
  mutation.mutate(deleteTaskVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteTaskVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.task_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateEmployee
You can execute the `CreateEmployee` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateEmployee(options?: useDataConnectMutationOptions<CreateEmployeeData, FirebaseError, CreateEmployeeVariables>): UseDataConnectMutationResult<CreateEmployeeData, CreateEmployeeVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateEmployee(dc: DataConnect, options?: useDataConnectMutationOptions<CreateEmployeeData, FirebaseError, CreateEmployeeVariables>): UseDataConnectMutationResult<CreateEmployeeData, CreateEmployeeVariables>;
```

### Variables
The `CreateEmployee` Mutation requires an argument of type `CreateEmployeeVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateEmployee` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateEmployee` Mutation is of type `CreateEmployeeData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateEmployeeData {
  employee_insert: Employee_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateEmployee`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateEmployeeVariables } from '@dataconnect/generated';
import { useCreateEmployee } from '@dataconnect/generated/react'

export default function CreateEmployeeComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateEmployee();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateEmployee(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateEmployee(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateEmployee(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateEmployee` Mutation requires an argument of type `CreateEmployeeVariables`:
  const createEmployeeVars: CreateEmployeeVariables = {
    data: ..., 
  };
  mutation.mutate(createEmployeeVars);
  // Variables can be defined inline as well.
  mutation.mutate({ data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createEmployeeVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.employee_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateEmployee
You can execute the `UpdateEmployee` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateEmployee(options?: useDataConnectMutationOptions<UpdateEmployeeData, FirebaseError, UpdateEmployeeVariables>): UseDataConnectMutationResult<UpdateEmployeeData, UpdateEmployeeVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateEmployee(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEmployeeData, FirebaseError, UpdateEmployeeVariables>): UseDataConnectMutationResult<UpdateEmployeeData, UpdateEmployeeVariables>;
```

### Variables
The `UpdateEmployee` Mutation requires an argument of type `UpdateEmployeeVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpdateEmployee` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateEmployee` Mutation is of type `UpdateEmployeeData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateEmployeeData {
  employee_update?: Employee_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateEmployee`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateEmployeeVariables } from '@dataconnect/generated';
import { useUpdateEmployee } from '@dataconnect/generated/react'

export default function UpdateEmployeeComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateEmployee();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateEmployee(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEmployee(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateEmployee(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateEmployee` Mutation requires an argument of type `UpdateEmployeeVariables`:
  const updateEmployeeVars: UpdateEmployeeVariables = {
    id: ..., 
    data: ..., 
  };
  mutation.mutate(updateEmployeeVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateEmployeeVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.employee_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteEmployee
You can execute the `DeleteEmployee` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteEmployee(options?: useDataConnectMutationOptions<DeleteEmployeeData, FirebaseError, DeleteEmployeeVariables>): UseDataConnectMutationResult<DeleteEmployeeData, DeleteEmployeeVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteEmployee(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteEmployeeData, FirebaseError, DeleteEmployeeVariables>): UseDataConnectMutationResult<DeleteEmployeeData, DeleteEmployeeVariables>;
```

### Variables
The `DeleteEmployee` Mutation requires an argument of type `DeleteEmployeeVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteEmployeeVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteEmployee` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteEmployee` Mutation is of type `DeleteEmployeeData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteEmployeeData {
  employee_delete?: Employee_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteEmployee`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteEmployeeVariables } from '@dataconnect/generated';
import { useDeleteEmployee } from '@dataconnect/generated/react'

export default function DeleteEmployeeComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteEmployee();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteEmployee(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteEmployee(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteEmployee(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteEmployee` Mutation requires an argument of type `DeleteEmployeeVariables`:
  const deleteEmployeeVars: DeleteEmployeeVariables = {
    id: ..., 
  };
  mutation.mutate(deleteEmployeeVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteEmployeeVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.employee_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateCustomer
You can execute the `CreateCustomer` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateCustomer(options?: useDataConnectMutationOptions<CreateCustomerData, FirebaseError, CreateCustomerVariables>): UseDataConnectMutationResult<CreateCustomerData, CreateCustomerVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateCustomer(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCustomerData, FirebaseError, CreateCustomerVariables>): UseDataConnectMutationResult<CreateCustomerData, CreateCustomerVariables>;
```

### Variables
The `CreateCustomer` Mutation requires an argument of type `CreateCustomerVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateCustomer` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateCustomer` Mutation is of type `CreateCustomerData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateCustomerData {
  customer_insert: Customer_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateCustomer`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateCustomerVariables } from '@dataconnect/generated';
import { useCreateCustomer } from '@dataconnect/generated/react'

export default function CreateCustomerComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateCustomer();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateCustomer(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateCustomer(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateCustomer(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateCustomer` Mutation requires an argument of type `CreateCustomerVariables`:
  const createCustomerVars: CreateCustomerVariables = {
    data: ..., 
  };
  mutation.mutate(createCustomerVars);
  // Variables can be defined inline as well.
  mutation.mutate({ data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createCustomerVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.customer_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateCustomer
You can execute the `UpdateCustomer` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateCustomer(options?: useDataConnectMutationOptions<UpdateCustomerData, FirebaseError, UpdateCustomerVariables>): UseDataConnectMutationResult<UpdateCustomerData, UpdateCustomerVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateCustomer(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateCustomerData, FirebaseError, UpdateCustomerVariables>): UseDataConnectMutationResult<UpdateCustomerData, UpdateCustomerVariables>;
```

### Variables
The `UpdateCustomer` Mutation requires an argument of type `UpdateCustomerVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpdateCustomer` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateCustomer` Mutation is of type `UpdateCustomerData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateCustomerData {
  customer_update?: Customer_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateCustomer`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateCustomerVariables } from '@dataconnect/generated';
import { useUpdateCustomer } from '@dataconnect/generated/react'

export default function UpdateCustomerComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateCustomer();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateCustomer(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateCustomer(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateCustomer(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateCustomer` Mutation requires an argument of type `UpdateCustomerVariables`:
  const updateCustomerVars: UpdateCustomerVariables = {
    id: ..., 
    data: ..., 
  };
  mutation.mutate(updateCustomerVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateCustomerVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.customer_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteCustomer
You can execute the `DeleteCustomer` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteCustomer(options?: useDataConnectMutationOptions<DeleteCustomerData, FirebaseError, DeleteCustomerVariables>): UseDataConnectMutationResult<DeleteCustomerData, DeleteCustomerVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteCustomer(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteCustomerData, FirebaseError, DeleteCustomerVariables>): UseDataConnectMutationResult<DeleteCustomerData, DeleteCustomerVariables>;
```

### Variables
The `DeleteCustomer` Mutation requires an argument of type `DeleteCustomerVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteCustomerVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteCustomer` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteCustomer` Mutation is of type `DeleteCustomerData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteCustomerData {
  customer_delete?: Customer_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteCustomer`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteCustomerVariables } from '@dataconnect/generated';
import { useDeleteCustomer } from '@dataconnect/generated/react'

export default function DeleteCustomerComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteCustomer();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteCustomer(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteCustomer(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteCustomer(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteCustomer` Mutation requires an argument of type `DeleteCustomerVariables`:
  const deleteCustomerVars: DeleteCustomerVariables = {
    id: ..., 
  };
  mutation.mutate(deleteCustomerVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteCustomerVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.customer_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateSupplier
You can execute the `CreateSupplier` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateSupplier(options?: useDataConnectMutationOptions<CreateSupplierData, FirebaseError, CreateSupplierVariables>): UseDataConnectMutationResult<CreateSupplierData, CreateSupplierVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateSupplier(dc: DataConnect, options?: useDataConnectMutationOptions<CreateSupplierData, FirebaseError, CreateSupplierVariables>): UseDataConnectMutationResult<CreateSupplierData, CreateSupplierVariables>;
```

### Variables
The `CreateSupplier` Mutation requires an argument of type `CreateSupplierVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateSupplier` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateSupplier` Mutation is of type `CreateSupplierData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateSupplierData {
  supplier_insert: Supplier_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateSupplier`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateSupplierVariables } from '@dataconnect/generated';
import { useCreateSupplier } from '@dataconnect/generated/react'

export default function CreateSupplierComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateSupplier();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateSupplier(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateSupplier(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateSupplier(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateSupplier` Mutation requires an argument of type `CreateSupplierVariables`:
  const createSupplierVars: CreateSupplierVariables = {
    data: ..., 
  };
  mutation.mutate(createSupplierVars);
  // Variables can be defined inline as well.
  mutation.mutate({ data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createSupplierVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.supplier_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateSupplier
You can execute the `UpdateSupplier` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateSupplier(options?: useDataConnectMutationOptions<UpdateSupplierData, FirebaseError, UpdateSupplierVariables>): UseDataConnectMutationResult<UpdateSupplierData, UpdateSupplierVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateSupplier(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateSupplierData, FirebaseError, UpdateSupplierVariables>): UseDataConnectMutationResult<UpdateSupplierData, UpdateSupplierVariables>;
```

### Variables
The `UpdateSupplier` Mutation requires an argument of type `UpdateSupplierVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpdateSupplier` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateSupplier` Mutation is of type `UpdateSupplierData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateSupplierData {
  supplier_update?: Supplier_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateSupplier`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateSupplierVariables } from '@dataconnect/generated';
import { useUpdateSupplier } from '@dataconnect/generated/react'

export default function UpdateSupplierComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateSupplier();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateSupplier(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateSupplier(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateSupplier(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateSupplier` Mutation requires an argument of type `UpdateSupplierVariables`:
  const updateSupplierVars: UpdateSupplierVariables = {
    id: ..., 
    data: ..., 
  };
  mutation.mutate(updateSupplierVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateSupplierVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.supplier_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteSupplier
You can execute the `DeleteSupplier` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteSupplier(options?: useDataConnectMutationOptions<DeleteSupplierData, FirebaseError, DeleteSupplierVariables>): UseDataConnectMutationResult<DeleteSupplierData, DeleteSupplierVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteSupplier(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteSupplierData, FirebaseError, DeleteSupplierVariables>): UseDataConnectMutationResult<DeleteSupplierData, DeleteSupplierVariables>;
```

### Variables
The `DeleteSupplier` Mutation requires an argument of type `DeleteSupplierVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteSupplierVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteSupplier` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteSupplier` Mutation is of type `DeleteSupplierData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteSupplierData {
  supplier_delete?: Supplier_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteSupplier`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteSupplierVariables } from '@dataconnect/generated';
import { useDeleteSupplier } from '@dataconnect/generated/react'

export default function DeleteSupplierComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteSupplier();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteSupplier(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteSupplier(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteSupplier(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteSupplier` Mutation requires an argument of type `DeleteSupplierVariables`:
  const deleteSupplierVars: DeleteSupplierVariables = {
    id: ..., 
  };
  mutation.mutate(deleteSupplierVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteSupplierVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.supplier_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateDocument
You can execute the `CreateDocument` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateDocument(options?: useDataConnectMutationOptions<CreateDocumentData, FirebaseError, CreateDocumentVariables>): UseDataConnectMutationResult<CreateDocumentData, CreateDocumentVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateDocument(dc: DataConnect, options?: useDataConnectMutationOptions<CreateDocumentData, FirebaseError, CreateDocumentVariables>): UseDataConnectMutationResult<CreateDocumentData, CreateDocumentVariables>;
```

### Variables
The `CreateDocument` Mutation requires an argument of type `CreateDocumentVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateDocument` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateDocument` Mutation is of type `CreateDocumentData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateDocumentData {
  document_insert: Document_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateDocument`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateDocumentVariables } from '@dataconnect/generated';
import { useCreateDocument } from '@dataconnect/generated/react'

export default function CreateDocumentComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateDocument();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateDocument(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateDocument(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateDocument(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateDocument` Mutation requires an argument of type `CreateDocumentVariables`:
  const createDocumentVars: CreateDocumentVariables = {
    data: ..., 
  };
  mutation.mutate(createDocumentVars);
  // Variables can be defined inline as well.
  mutation.mutate({ data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createDocumentVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.document_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateDocument
You can execute the `UpdateDocument` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateDocument(options?: useDataConnectMutationOptions<UpdateDocumentData, FirebaseError, UpdateDocumentVariables>): UseDataConnectMutationResult<UpdateDocumentData, UpdateDocumentVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateDocument(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateDocumentData, FirebaseError, UpdateDocumentVariables>): UseDataConnectMutationResult<UpdateDocumentData, UpdateDocumentVariables>;
```

### Variables
The `UpdateDocument` Mutation requires an argument of type `UpdateDocumentVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpdateDocument` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateDocument` Mutation is of type `UpdateDocumentData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateDocumentData {
  document_update?: Document_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateDocument`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateDocumentVariables } from '@dataconnect/generated';
import { useUpdateDocument } from '@dataconnect/generated/react'

export default function UpdateDocumentComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateDocument();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateDocument(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateDocument(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateDocument(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateDocument` Mutation requires an argument of type `UpdateDocumentVariables`:
  const updateDocumentVars: UpdateDocumentVariables = {
    id: ..., 
    data: ..., 
  };
  mutation.mutate(updateDocumentVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., data: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateDocumentVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.document_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteDocument
You can execute the `DeleteDocument` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteDocument(options?: useDataConnectMutationOptions<DeleteDocumentData, FirebaseError, DeleteDocumentVariables>): UseDataConnectMutationResult<DeleteDocumentData, DeleteDocumentVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteDocument(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteDocumentData, FirebaseError, DeleteDocumentVariables>): UseDataConnectMutationResult<DeleteDocumentData, DeleteDocumentVariables>;
```

### Variables
The `DeleteDocument` Mutation requires an argument of type `DeleteDocumentVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteDocumentVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteDocument` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteDocument` Mutation is of type `DeleteDocumentData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteDocumentData {
  document_delete?: Document_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteDocument`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteDocumentVariables } from '@dataconnect/generated';
import { useDeleteDocument } from '@dataconnect/generated/react'

export default function DeleteDocumentComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteDocument();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteDocument(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteDocument(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteDocument(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteDocument` Mutation requires an argument of type `DeleteDocumentVariables`:
  const deleteDocumentVars: DeleteDocumentVariables = {
    id: ..., 
  };
  mutation.mutate(deleteDocumentVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteDocumentVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.document_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

