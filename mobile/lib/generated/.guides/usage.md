# Basic Usage

```dart
ExampleConnector.instance.CreateTenant(createTenantVariables).execute();
ExampleConnector.instance.UpdateTenant(updateTenantVariables).execute();
ExampleConnector.instance.DeleteTenant(deleteTenantVariables).execute();
ExampleConnector.instance.CreateUser(createUserVariables).execute();
ExampleConnector.instance.UpdateUser(updateUserVariables).execute();
ExampleConnector.instance.DeleteUser(deleteUserVariables).execute();
ExampleConnector.instance.CreateBusiness(createBusinessVariables).execute();
ExampleConnector.instance.UpdateBusiness(updateBusinessVariables).execute();
ExampleConnector.instance.DeleteBusiness(deleteBusinessVariables).execute();
ExampleConnector.instance.ProvisionEmployeeUser(provisionEmployeeUserVariables).execute();

```

## Optional Fields

Some operations may have optional fields. In these cases, the Flutter SDK exposes a builder method, and will have to be set separately.

Optional fields can be discovered based on classes that have `Optional` object types.

This is an example of a mutation with an optional field:

```dart
await ExampleConnector.instance.UpdateTask({ ... })
.title(...)
.execute();
```

Note: the above example is a mutation, but the same logic applies to query operations as well. Additionally, `createMovie` is an example, and may not be available to the user.

