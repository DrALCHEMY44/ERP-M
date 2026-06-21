# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateTenant, useUpdateTenant, useDeleteTenant, useCreateUser, useUpdateUser, useDeleteUser, useCreateBusiness, useUpdateBusiness, useDeleteBusiness, useCreateProduct } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateTenant(createTenantVars);

const { data, isPending, isSuccess, isError, error } = useUpdateTenant(updateTenantVars);

const { data, isPending, isSuccess, isError, error } = useDeleteTenant(deleteTenantVars);

const { data, isPending, isSuccess, isError, error } = useCreateUser(createUserVars);

const { data, isPending, isSuccess, isError, error } = useUpdateUser(updateUserVars);

const { data, isPending, isSuccess, isError, error } = useDeleteUser(deleteUserVars);

const { data, isPending, isSuccess, isError, error } = useCreateBusiness(createBusinessVars);

const { data, isPending, isSuccess, isError, error } = useUpdateBusiness(updateBusinessVars);

const { data, isPending, isSuccess, isError, error } = useDeleteBusiness(deleteBusinessVars);

const { data, isPending, isSuccess, isError, error } = useCreateProduct(createProductVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createTenant, updateTenant, deleteTenant, createUser, updateUser, deleteUser, createBusiness, updateBusiness, deleteBusiness, createProduct } from '@dataconnect/generated';


// Operation CreateTenant:  For variables, look at type CreateTenantVars in ../index.d.ts
const { data } = await CreateTenant(dataConnect, createTenantVars);

// Operation UpdateTenant:  For variables, look at type UpdateTenantVars in ../index.d.ts
const { data } = await UpdateTenant(dataConnect, updateTenantVars);

// Operation DeleteTenant:  For variables, look at type DeleteTenantVars in ../index.d.ts
const { data } = await DeleteTenant(dataConnect, deleteTenantVars);

// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation UpdateUser:  For variables, look at type UpdateUserVars in ../index.d.ts
const { data } = await UpdateUser(dataConnect, updateUserVars);

// Operation DeleteUser:  For variables, look at type DeleteUserVars in ../index.d.ts
const { data } = await DeleteUser(dataConnect, deleteUserVars);

// Operation CreateBusiness:  For variables, look at type CreateBusinessVars in ../index.d.ts
const { data } = await CreateBusiness(dataConnect, createBusinessVars);

// Operation UpdateBusiness:  For variables, look at type UpdateBusinessVars in ../index.d.ts
const { data } = await UpdateBusiness(dataConnect, updateBusinessVars);

// Operation DeleteBusiness:  For variables, look at type DeleteBusinessVars in ../index.d.ts
const { data } = await DeleteBusiness(dataConnect, deleteBusinessVars);

// Operation CreateProduct:  For variables, look at type CreateProductVars in ../index.d.ts
const { data } = await CreateProduct(dataConnect, createProductVars);


```