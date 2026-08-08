# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createTenant, createBusiness, createProduct, updateProduct, deleteProduct, createTransaction, createTask, updateTask, deleteTask, createEmployee } from '@smarterp/dataconnect';


// Operation CreateTenant:  For variables, look at type CreateTenantVars in ../index.d.ts
const { data } = await CreateTenant(dataConnect, createTenantVars);

// Operation CreateBusiness:  For variables, look at type CreateBusinessVars in ../index.d.ts
const { data } = await CreateBusiness(dataConnect, createBusinessVars);

// Operation CreateProduct:  For variables, look at type CreateProductVars in ../index.d.ts
const { data } = await CreateProduct(dataConnect, createProductVars);

// Operation UpdateProduct:  For variables, look at type UpdateProductVars in ../index.d.ts
const { data } = await UpdateProduct(dataConnect, updateProductVars);

// Operation DeleteProduct:  For variables, look at type DeleteProductVars in ../index.d.ts
const { data } = await DeleteProduct(dataConnect, deleteProductVars);

// Operation CreateTransaction:  For variables, look at type CreateTransactionVars in ../index.d.ts
const { data } = await CreateTransaction(dataConnect, createTransactionVars);

// Operation CreateTask:  For variables, look at type CreateTaskVars in ../index.d.ts
const { data } = await CreateTask(dataConnect, createTaskVars);

// Operation UpdateTask:  For variables, look at type UpdateTaskVars in ../index.d.ts
const { data } = await UpdateTask(dataConnect, updateTaskVars);

// Operation DeleteTask:  For variables, look at type DeleteTaskVars in ../index.d.ts
const { data } = await DeleteTask(dataConnect, deleteTaskVars);

// Operation CreateEmployee:  For variables, look at type CreateEmployeeVars in ../index.d.ts
const { data } = await CreateEmployee(dataConnect, createEmployeeVars);


```