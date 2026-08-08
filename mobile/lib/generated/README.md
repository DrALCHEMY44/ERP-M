# dataconnect_generated SDK

## Installation
```sh
flutter pub get firebase_data_connect
flutterfire configure
```
For more information, see [Flutter for Firebase installation documentation](https://firebase.google.com/docs/data-connect/flutter-sdk#use-core).

## Data Connect instance
Each connector creates a static class, with an instance of the `DataConnect` class that can be used to connect to your Data Connect backend and call operations.

### Connecting to the emulator

```dart
String host = 'localhost'; // or your host name
int port = 9399; // or your port number
ExampleConnector.instance.dataConnect.useDataConnectEmulator(host, port);
```

You can also call queries and mutations by using the connector class.
## Queries

### ListTenants
#### Required Arguments
```dart
// No required arguments
ExampleConnector.instance.listTenants().execute();
```



#### Return Type
`execute()` returns a `QueryResult<ListTenantsData, void>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.listTenants();
ListTenantsData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
final ref = ExampleConnector.instance.listTenants().ref();
ref.execute();

ref.subscribe(...);
```


### ListUsers
#### Required Arguments
```dart
// No required arguments
ExampleConnector.instance.listUsers().execute();
```



#### Return Type
`execute()` returns a `QueryResult<ListUsersData, void>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.listUsers();
ListUsersData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
final ref = ExampleConnector.instance.listUsers().ref();
ref.execute();

ref.subscribe(...);
```


### ListBusinesses
#### Required Arguments
```dart
String tenantId = ...;
ExampleConnector.instance.listBusinesses(
  tenantId: tenantId,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<ListBusinessesData, ListBusinessesVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.listBusinesses(
  tenantId: tenantId,
);
ListBusinessesData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;

final ref = ExampleConnector.instance.listBusinesses(
  tenantId: tenantId,
).ref();
ref.execute();

ref.subscribe(...);
```


### getUserByEmail
#### Required Arguments
```dart
String email = ...;
ExampleConnector.instance.getUserByEmail(
  email: email,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<getUserByEmailData, getUserByEmailVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.getUserByEmail(
  email: email,
);
getUserByEmailData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String email = ...;

final ref = ExampleConnector.instance.getUserByEmail(
  email: email,
).ref();
ref.execute();

ref.subscribe(...);
```


### getBusinessById
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.getBusinessById(
  id: id,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<getBusinessByIdData, getBusinessByIdVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.getBusinessById(
  id: id,
);
getBusinessByIdData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.getBusinessById(
  id: id,
).ref();
ref.execute();

ref.subscribe(...);
```


### getBusinessByCode
#### Required Arguments
```dart
String code = ...;
ExampleConnector.instance.getBusinessByCode(
  code: code,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<getBusinessByCodeData, getBusinessByCodeVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.getBusinessByCode(
  code: code,
);
getBusinessByCodeData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String code = ...;

final ref = ExampleConnector.instance.getBusinessByCode(
  code: code,
).ref();
ref.execute();

ref.subscribe(...);
```


### getBusinessesByName
#### Required Arguments
```dart
String name = ...;
ExampleConnector.instance.getBusinessesByName(
  name: name,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<getBusinessesByNameData, getBusinessesByNameVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.getBusinessesByName(
  name: name,
);
getBusinessesByNameData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String name = ...;

final ref = ExampleConnector.instance.getBusinessesByName(
  name: name,
).ref();
ref.execute();

ref.subscribe(...);
```


### verifyEmployeeAccess
#### Required Arguments
```dart
String fullName = ...;
String role = ...;
String accessCode = ...;
String tenantId = ...;
String businessId = ...;
ExampleConnector.instance.verifyEmployeeAccess(
  fullName: fullName,
  role: role,
  accessCode: accessCode,
  tenantId: tenantId,
  businessId: businessId,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<verifyEmployeeAccessData, verifyEmployeeAccessVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.verifyEmployeeAccess(
  fullName: fullName,
  role: role,
  accessCode: accessCode,
  tenantId: tenantId,
  businessId: businessId,
);
verifyEmployeeAccessData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String fullName = ...;
String role = ...;
String accessCode = ...;
String tenantId = ...;
String businessId = ...;

final ref = ExampleConnector.instance.verifyEmployeeAccess(
  fullName: fullName,
  role: role,
  accessCode: accessCode,
  tenantId: tenantId,
  businessId: businessId,
).ref();
ref.execute();

ref.subscribe(...);
```


### verifyUserLogin
#### Required Arguments
```dart
String email = ...;
String fullName = ...;
String role = ...;
String accessCode = ...;
String tenantId = ...;
String businessId = ...;
ExampleConnector.instance.verifyUserLogin(
  email: email,
  fullName: fullName,
  role: role,
  accessCode: accessCode,
  tenantId: tenantId,
  businessId: businessId,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<verifyUserLoginData, verifyUserLoginVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.verifyUserLogin(
  email: email,
  fullName: fullName,
  role: role,
  accessCode: accessCode,
  tenantId: tenantId,
  businessId: businessId,
);
verifyUserLoginData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String email = ...;
String fullName = ...;
String role = ...;
String accessCode = ...;
String tenantId = ...;
String businessId = ...;

final ref = ExampleConnector.instance.verifyUserLogin(
  email: email,
  fullName: fullName,
  role: role,
  accessCode: accessCode,
  tenantId: tenantId,
  businessId: businessId,
).ref();
ref.execute();

ref.subscribe(...);
```


### listProductsByBusiness
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
ExampleConnector.instance.listProductsByBusiness(
  tenantId: tenantId,
  businessId: businessId,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<listProductsByBusinessData, listProductsByBusinessVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.listProductsByBusiness(
  tenantId: tenantId,
  businessId: businessId,
);
listProductsByBusinessData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;

final ref = ExampleConnector.instance.listProductsByBusiness(
  tenantId: tenantId,
  businessId: businessId,
).ref();
ref.execute();

ref.subscribe(...);
```


### listCustomersByBusiness
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
ExampleConnector.instance.listCustomersByBusiness(
  tenantId: tenantId,
  businessId: businessId,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<listCustomersByBusinessData, listCustomersByBusinessVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.listCustomersByBusiness(
  tenantId: tenantId,
  businessId: businessId,
);
listCustomersByBusinessData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;

final ref = ExampleConnector.instance.listCustomersByBusiness(
  tenantId: tenantId,
  businessId: businessId,
).ref();
ref.execute();

ref.subscribe(...);
```


### listUsersByBusiness
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
ExampleConnector.instance.listUsersByBusiness(
  tenantId: tenantId,
  businessId: businessId,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<listUsersByBusinessData, listUsersByBusinessVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.listUsersByBusiness(
  tenantId: tenantId,
  businessId: businessId,
);
listUsersByBusinessData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;

final ref = ExampleConnector.instance.listUsersByBusiness(
  tenantId: tenantId,
  businessId: businessId,
).ref();
ref.execute();

ref.subscribe(...);
```


### listSuppliersByBusiness
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
ExampleConnector.instance.listSuppliersByBusiness(
  tenantId: tenantId,
  businessId: businessId,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<listSuppliersByBusinessData, listSuppliersByBusinessVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.listSuppliersByBusiness(
  tenantId: tenantId,
  businessId: businessId,
);
listSuppliersByBusinessData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;

final ref = ExampleConnector.instance.listSuppliersByBusiness(
  tenantId: tenantId,
  businessId: businessId,
).ref();
ref.execute();

ref.subscribe(...);
```


### listTasksByBusiness
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
ExampleConnector.instance.listTasksByBusiness(
  tenantId: tenantId,
  businessId: businessId,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<listTasksByBusinessData, listTasksByBusinessVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.listTasksByBusiness(
  tenantId: tenantId,
  businessId: businessId,
);
listTasksByBusinessData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;

final ref = ExampleConnector.instance.listTasksByBusiness(
  tenantId: tenantId,
  businessId: businessId,
).ref();
ref.execute();

ref.subscribe(...);
```


### listTasksAssignedToUser
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
String userId = ...;
ExampleConnector.instance.listTasksAssignedToUser(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<listTasksAssignedToUserData, listTasksAssignedToUserVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.listTasksAssignedToUser(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
);
listTasksAssignedToUserData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;
String userId = ...;

final ref = ExampleConnector.instance.listTasksAssignedToUser(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
).ref();
ref.execute();

ref.subscribe(...);
```


### listTransactionsByBusiness
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
ExampleConnector.instance.listTransactionsByBusiness(
  tenantId: tenantId,
  businessId: businessId,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<listTransactionsByBusinessData, listTransactionsByBusinessVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.listTransactionsByBusiness(
  tenantId: tenantId,
  businessId: businessId,
);
listTransactionsByBusinessData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;

final ref = ExampleConnector.instance.listTransactionsByBusiness(
  tenantId: tenantId,
  businessId: businessId,
).ref();
ref.execute();

ref.subscribe(...);
```


### listTransactionsByType
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
TransactionType type = ...;
ExampleConnector.instance.listTransactionsByType(
  tenantId: tenantId,
  businessId: businessId,
  type: type,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<listTransactionsByTypeData, listTransactionsByTypeVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.listTransactionsByType(
  tenantId: tenantId,
  businessId: businessId,
  type: type,
);
listTransactionsByTypeData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;
TransactionType type = ...;

final ref = ExampleConnector.instance.listTransactionsByType(
  tenantId: tenantId,
  businessId: businessId,
  type: type,
).ref();
ref.execute();

ref.subscribe(...);
```


### listEmployeesByBusiness
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
ExampleConnector.instance.listEmployeesByBusiness(
  tenantId: tenantId,
  businessId: businessId,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<listEmployeesByBusinessData, listEmployeesByBusinessVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.listEmployeesByBusiness(
  tenantId: tenantId,
  businessId: businessId,
);
listEmployeesByBusinessData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;

final ref = ExampleConnector.instance.listEmployeesByBusiness(
  tenantId: tenantId,
  businessId: businessId,
).ref();
ref.execute();

ref.subscribe(...);
```


### listDocumentsByBusiness
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
ExampleConnector.instance.listDocumentsByBusiness(
  tenantId: tenantId,
  businessId: businessId,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<listDocumentsByBusinessData, listDocumentsByBusinessVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.listDocumentsByBusiness(
  tenantId: tenantId,
  businessId: businessId,
);
listDocumentsByBusinessData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;

final ref = ExampleConnector.instance.listDocumentsByBusiness(
  tenantId: tenantId,
  businessId: businessId,
).ref();
ref.execute();

ref.subscribe(...);
```


### listActivityLogsByUser
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
String userId = ...;
ExampleConnector.instance.listActivityLogsByUser(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<listActivityLogsByUserData, listActivityLogsByUserVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.listActivityLogsByUser(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
);
listActivityLogsByUserData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;
String userId = ...;

final ref = ExampleConnector.instance.listActivityLogsByUser(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
).ref();
ref.execute();

ref.subscribe(...);
```


### listActivityLogsByBusiness
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
ExampleConnector.instance.listActivityLogsByBusiness(
  tenantId: tenantId,
  businessId: businessId,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<listActivityLogsByBusinessData, listActivityLogsByBusinessVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.listActivityLogsByBusiness(
  tenantId: tenantId,
  businessId: businessId,
);
listActivityLogsByBusinessData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;

final ref = ExampleConnector.instance.listActivityLogsByBusiness(
  tenantId: tenantId,
  businessId: businessId,
).ref();
ref.execute();

ref.subscribe(...);
```


### getUserById
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.getUserById(
  id: id,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<getUserByIdData, getUserByIdVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.getUserById(
  id: id,
);
getUserByIdData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.getUserById(
  id: id,
).ref();
ref.execute();

ref.subscribe(...);
```


### listNotifications
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
String userId = ...;
ExampleConnector.instance.listNotifications(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
).execute();
```



#### Return Type
`execute()` returns a `QueryResult<listNotificationsData, listNotificationsVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

/// Result of a query request. Created to hold extra variables in the future.
class QueryResult<Data, Variables> extends OperationResult<Data, Variables> {
  QueryResult(super.dataConnect, super.data, super.ref);
}

final result = await ExampleConnector.instance.listNotifications(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
);
listNotificationsData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;
String userId = ...;

final ref = ExampleConnector.instance.listNotifications(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
).ref();
ref.execute();

ref.subscribe(...);
```

## Mutations

### CreateTenant
#### Required Arguments
```dart
String name = ...;
String businessSector = ...;
String location = ...;
String ownerEmail = ...;
ExampleConnector.instance.createTenant(
  name: name,
  businessSector: businessSector,
  location: location,
  ownerEmail: ownerEmail,
).execute();
```

#### Optional Arguments
We return a builder for each query. For CreateTenant, we created `CreateTenantBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class CreateTenantVariablesBuilder {
  ...
   CreateTenantVariablesBuilder taxId(String? t) {
   _taxId.value = t;
   return this;
  }
  CreateTenantVariablesBuilder logoUrl(String? t) {
   _logoUrl.value = t;
   return this;
  }
  CreateTenantVariablesBuilder subscriptionTier(String? t) {
   _subscriptionTier.value = t;
   return this;
  }
  CreateTenantVariablesBuilder status(String? t) {
   _status.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.createTenant(
  name: name,
  businessSector: businessSector,
  location: location,
  ownerEmail: ownerEmail,
)
.taxId(taxId)
.logoUrl(logoUrl)
.subscriptionTier(subscriptionTier)
.status(status)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<CreateTenantData, CreateTenantVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.createTenant(
  name: name,
  businessSector: businessSector,
  location: location,
  ownerEmail: ownerEmail,
);
CreateTenantData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String name = ...;
String businessSector = ...;
String location = ...;
String ownerEmail = ...;

final ref = ExampleConnector.instance.createTenant(
  name: name,
  businessSector: businessSector,
  location: location,
  ownerEmail: ownerEmail,
).ref();
ref.execute();
```


### UpdateTenant
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.updateTenant(
  id: id,
).execute();
```

#### Optional Arguments
We return a builder for each query. For UpdateTenant, we created `UpdateTenantBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class UpdateTenantVariablesBuilder {
  ...
   UpdateTenantVariablesBuilder name(String? t) {
   _name.value = t;
   return this;
  }
  UpdateTenantVariablesBuilder businessSector(String? t) {
   _businessSector.value = t;
   return this;
  }
  UpdateTenantVariablesBuilder location(String? t) {
   _location.value = t;
   return this;
  }
  UpdateTenantVariablesBuilder ownerEmail(String? t) {
   _ownerEmail.value = t;
   return this;
  }
  UpdateTenantVariablesBuilder taxId(String? t) {
   _taxId.value = t;
   return this;
  }
  UpdateTenantVariablesBuilder logoUrl(String? t) {
   _logoUrl.value = t;
   return this;
  }
  UpdateTenantVariablesBuilder subscriptionTier(String? t) {
   _subscriptionTier.value = t;
   return this;
  }
  UpdateTenantVariablesBuilder status(String? t) {
   _status.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.updateTenant(
  id: id,
)
.name(name)
.businessSector(businessSector)
.location(location)
.ownerEmail(ownerEmail)
.taxId(taxId)
.logoUrl(logoUrl)
.subscriptionTier(subscriptionTier)
.status(status)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<UpdateTenantData, UpdateTenantVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.updateTenant(
  id: id,
);
UpdateTenantData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.updateTenant(
  id: id,
).ref();
ref.execute();
```


### DeleteTenant
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.deleteTenant(
  id: id,
).execute();
```



#### Return Type
`execute()` returns a `OperationResult<DeleteTenantData, DeleteTenantVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.deleteTenant(
  id: id,
);
DeleteTenantData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.deleteTenant(
  id: id,
).ref();
ref.execute();
```


### CreateUser
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
String email = ...;
String role = ...;
ExampleConnector.instance.createUser(
  tenantId: tenantId,
  businessId: businessId,
  email: email,
  role: role,
).execute();
```

#### Optional Arguments
We return a builder for each query. For CreateUser, we created `CreateUserBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class CreateUserVariablesBuilder {
  ...
   CreateUserVariablesBuilder fullName(String? t) {
   _fullName.value = t;
   return this;
  }
  CreateUserVariablesBuilder department(String? t) {
   _department.value = t;
   return this;
  }
  CreateUserVariablesBuilder phoneNumber(String? t) {
   _phoneNumber.value = t;
   return this;
  }
  CreateUserVariablesBuilder accessCode(String? t) {
   _accessCode.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.createUser(
  tenantId: tenantId,
  businessId: businessId,
  email: email,
  role: role,
)
.fullName(fullName)
.department(department)
.phoneNumber(phoneNumber)
.accessCode(accessCode)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<CreateUserData, CreateUserVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.createUser(
  tenantId: tenantId,
  businessId: businessId,
  email: email,
  role: role,
);
CreateUserData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;
String email = ...;
String role = ...;

final ref = ExampleConnector.instance.createUser(
  tenantId: tenantId,
  businessId: businessId,
  email: email,
  role: role,
).ref();
ref.execute();
```


### UpdateUser
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.updateUser(
  id: id,
).execute();
```

#### Optional Arguments
We return a builder for each query. For UpdateUser, we created `UpdateUserBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class UpdateUserVariablesBuilder {
  ...
   UpdateUserVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateUserVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateUserVariablesBuilder email(String? t) {
   _email.value = t;
   return this;
  }
  UpdateUserVariablesBuilder role(String? t) {
   _role.value = t;
   return this;
  }
  UpdateUserVariablesBuilder fullName(String? t) {
   _fullName.value = t;
   return this;
  }
  UpdateUserVariablesBuilder department(String? t) {
   _department.value = t;
   return this;
  }
  UpdateUserVariablesBuilder phoneNumber(String? t) {
   _phoneNumber.value = t;
   return this;
  }
  UpdateUserVariablesBuilder accessCode(String? t) {
   _accessCode.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.updateUser(
  id: id,
)
.tenantId(tenantId)
.businessId(businessId)
.email(email)
.role(role)
.fullName(fullName)
.department(department)
.phoneNumber(phoneNumber)
.accessCode(accessCode)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<UpdateUserData, UpdateUserVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.updateUser(
  id: id,
);
UpdateUserData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.updateUser(
  id: id,
).ref();
ref.execute();
```


### DeleteUser
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.deleteUser(
  id: id,
).execute();
```



#### Return Type
`execute()` returns a `OperationResult<DeleteUserData, DeleteUserVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.deleteUser(
  id: id,
);
DeleteUserData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.deleteUser(
  id: id,
).ref();
ref.execute();
```


### CreateBusiness
#### Required Arguments
```dart
String tenantId = ...;
String name = ...;
String location = ...;
String code = ...;
ExampleConnector.instance.createBusiness(
  tenantId: tenantId,
  name: name,
  location: location,
  code: code,
).execute();
```

#### Optional Arguments
We return a builder for each query. For CreateBusiness, we created `CreateBusinessBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class CreateBusinessVariablesBuilder {
  ...
   CreateBusinessVariablesBuilder businessType(String? t) {
   _businessType.value = t;
   return this;
  }
  CreateBusinessVariablesBuilder region(String? t) {
   _region.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.createBusiness(
  tenantId: tenantId,
  name: name,
  location: location,
  code: code,
)
.businessType(businessType)
.region(region)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<CreateBusinessData, CreateBusinessVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.createBusiness(
  tenantId: tenantId,
  name: name,
  location: location,
  code: code,
);
CreateBusinessData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String name = ...;
String location = ...;
String code = ...;

final ref = ExampleConnector.instance.createBusiness(
  tenantId: tenantId,
  name: name,
  location: location,
  code: code,
).ref();
ref.execute();
```


### UpdateBusiness
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.updateBusiness(
  id: id,
).execute();
```

#### Optional Arguments
We return a builder for each query. For UpdateBusiness, we created `UpdateBusinessBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class UpdateBusinessVariablesBuilder {
  ...
   UpdateBusinessVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateBusinessVariablesBuilder name(String? t) {
   _name.value = t;
   return this;
  }
  UpdateBusinessVariablesBuilder location(String? t) {
   _location.value = t;
   return this;
  }
  UpdateBusinessVariablesBuilder businessType(String? t) {
   _businessType.value = t;
   return this;
  }
  UpdateBusinessVariablesBuilder region(String? t) {
   _region.value = t;
   return this;
  }
  UpdateBusinessVariablesBuilder code(String? t) {
   _code.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.updateBusiness(
  id: id,
)
.tenantId(tenantId)
.name(name)
.location(location)
.businessType(businessType)
.region(region)
.code(code)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<UpdateBusinessData, UpdateBusinessVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.updateBusiness(
  id: id,
);
UpdateBusinessData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.updateBusiness(
  id: id,
).ref();
ref.execute();
```


### DeleteBusiness
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.deleteBusiness(
  id: id,
).execute();
```



#### Return Type
`execute()` returns a `OperationResult<DeleteBusinessData, DeleteBusinessVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.deleteBusiness(
  id: id,
);
DeleteBusinessData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.deleteBusiness(
  id: id,
).ref();
ref.execute();
```


### ProvisionEmployeeUser
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
String email = ...;
String role = ...;
String fullName = ...;
String accessCode = ...;
ExampleConnector.instance.provisionEmployeeUser(
  tenantId: tenantId,
  businessId: businessId,
  email: email,
  role: role,
  fullName: fullName,
  accessCode: accessCode,
).execute();
```

#### Optional Arguments
We return a builder for each query. For ProvisionEmployeeUser, we created `ProvisionEmployeeUserBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class ProvisionEmployeeUserVariablesBuilder {
  ...
   ProvisionEmployeeUserVariablesBuilder department(String? t) {
   _department.value = t;
   return this;
  }
  ProvisionEmployeeUserVariablesBuilder phoneNumber(String? t) {
   _phoneNumber.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.provisionEmployeeUser(
  tenantId: tenantId,
  businessId: businessId,
  email: email,
  role: role,
  fullName: fullName,
  accessCode: accessCode,
)
.department(department)
.phoneNumber(phoneNumber)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<ProvisionEmployeeUserData, ProvisionEmployeeUserVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.provisionEmployeeUser(
  tenantId: tenantId,
  businessId: businessId,
  email: email,
  role: role,
  fullName: fullName,
  accessCode: accessCode,
);
ProvisionEmployeeUserData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;
String email = ...;
String role = ...;
String fullName = ...;
String accessCode = ...;

final ref = ExampleConnector.instance.provisionEmployeeUser(
  tenantId: tenantId,
  businessId: businessId,
  email: email,
  role: role,
  fullName: fullName,
  accessCode: accessCode,
).ref();
ref.execute();
```


### CompleteAssignedTask
#### Required Arguments
```dart
String taskId = ...;
String userId = ...;
String accessCode = ...;
ExampleConnector.instance.completeAssignedTask(
  taskId: taskId,
  userId: userId,
  accessCode: accessCode,
).execute();
```



#### Return Type
`execute()` returns a `OperationResult<CompleteAssignedTaskData, CompleteAssignedTaskVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.completeAssignedTask(
  taskId: taskId,
  userId: userId,
  accessCode: accessCode,
);
CompleteAssignedTaskData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String taskId = ...;
String userId = ...;
String accessCode = ...;

final ref = ExampleConnector.instance.completeAssignedTask(
  taskId: taskId,
  userId: userId,
  accessCode: accessCode,
).ref();
ref.execute();
```


### CreateProduct
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
String name = ...;
int quantity = ...;
double sellingPrice = ...;
String createdBy = ...;
ExampleConnector.instance.createProduct(
  tenantId: tenantId,
  businessId: businessId,
  name: name,
  quantity: quantity,
  sellingPrice: sellingPrice,
  createdBy: createdBy,
).execute();
```

#### Optional Arguments
We return a builder for each query. For CreateProduct, we created `CreateProductBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class CreateProductVariablesBuilder {
  ...
   CreateProductVariablesBuilder category(String? t) {
   _category.value = t;
   return this;
  }
  CreateProductVariablesBuilder costPrice(double? t) {
   _costPrice.value = t;
   return this;
  }
  CreateProductVariablesBuilder expiryDate(DateTime? t) {
   _expiryDate.value = t;
   return this;
  }
  CreateProductVariablesBuilder lowStockLevel(int? t) {
   _lowStockLevel.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.createProduct(
  tenantId: tenantId,
  businessId: businessId,
  name: name,
  quantity: quantity,
  sellingPrice: sellingPrice,
  createdBy: createdBy,
)
.category(category)
.costPrice(costPrice)
.expiryDate(expiryDate)
.lowStockLevel(lowStockLevel)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<CreateProductData, CreateProductVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.createProduct(
  tenantId: tenantId,
  businessId: businessId,
  name: name,
  quantity: quantity,
  sellingPrice: sellingPrice,
  createdBy: createdBy,
);
CreateProductData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;
String name = ...;
int quantity = ...;
double sellingPrice = ...;
String createdBy = ...;

final ref = ExampleConnector.instance.createProduct(
  tenantId: tenantId,
  businessId: businessId,
  name: name,
  quantity: quantity,
  sellingPrice: sellingPrice,
  createdBy: createdBy,
).ref();
ref.execute();
```


### UpdateProduct
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.updateProduct(
  id: id,
).execute();
```

#### Optional Arguments
We return a builder for each query. For UpdateProduct, we created `UpdateProductBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class UpdateProductVariablesBuilder {
  ...
   UpdateProductVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateProductVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateProductVariablesBuilder name(String? t) {
   _name.value = t;
   return this;
  }
  UpdateProductVariablesBuilder category(String? t) {
   _category.value = t;
   return this;
  }
  UpdateProductVariablesBuilder quantity(int? t) {
   _quantity.value = t;
   return this;
  }
  UpdateProductVariablesBuilder costPrice(double? t) {
   _costPrice.value = t;
   return this;
  }
  UpdateProductVariablesBuilder sellingPrice(double? t) {
   _sellingPrice.value = t;
   return this;
  }
  UpdateProductVariablesBuilder expiryDate(DateTime? t) {
   _expiryDate.value = t;
   return this;
  }
  UpdateProductVariablesBuilder lowStockLevel(int? t) {
   _lowStockLevel.value = t;
   return this;
  }
  UpdateProductVariablesBuilder createdBy(String? t) {
   _createdBy.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.updateProduct(
  id: id,
)
.tenantId(tenantId)
.businessId(businessId)
.name(name)
.category(category)
.quantity(quantity)
.costPrice(costPrice)
.sellingPrice(sellingPrice)
.expiryDate(expiryDate)
.lowStockLevel(lowStockLevel)
.createdBy(createdBy)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<UpdateProductData, UpdateProductVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.updateProduct(
  id: id,
);
UpdateProductData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.updateProduct(
  id: id,
).ref();
ref.execute();
```


### DeleteProduct
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.deleteProduct(
  id: id,
).execute();
```



#### Return Type
`execute()` returns a `OperationResult<DeleteProductData, DeleteProductVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.deleteProduct(
  id: id,
);
DeleteProductData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.deleteProduct(
  id: id,
).ref();
ref.execute();
```


### CreateTransaction
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
TransactionType type = ...;
double amount = ...;
Timestamp date = ...;
String recordedBy = ...;
ExampleConnector.instance.createTransaction(
  tenantId: tenantId,
  businessId: businessId,
  type: type,
  amount: amount,
  date: date,
  recordedBy: recordedBy,
).execute();
```

#### Optional Arguments
We return a builder for each query. For CreateTransaction, we created `CreateTransactionBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class CreateTransactionVariablesBuilder {
  ...
   CreateTransactionVariablesBuilder category(String? t) {
   _category.value = t;
   return this;
  }
  CreateTransactionVariablesBuilder receiptUrl(String? t) {
   _receiptUrl.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.createTransaction(
  tenantId: tenantId,
  businessId: businessId,
  type: type,
  amount: amount,
  date: date,
  recordedBy: recordedBy,
)
.category(category)
.receiptUrl(receiptUrl)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<CreateTransactionData, CreateTransactionVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.createTransaction(
  tenantId: tenantId,
  businessId: businessId,
  type: type,
  amount: amount,
  date: date,
  recordedBy: recordedBy,
);
CreateTransactionData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;
TransactionType type = ...;
double amount = ...;
Timestamp date = ...;
String recordedBy = ...;

final ref = ExampleConnector.instance.createTransaction(
  tenantId: tenantId,
  businessId: businessId,
  type: type,
  amount: amount,
  date: date,
  recordedBy: recordedBy,
).ref();
ref.execute();
```


### UpdateTransaction
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.updateTransaction(
  id: id,
).execute();
```

#### Optional Arguments
We return a builder for each query. For UpdateTransaction, we created `UpdateTransactionBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class UpdateTransactionVariablesBuilder {
  ...
   UpdateTransactionVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateTransactionVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateTransactionVariablesBuilder type(TransactionType? t) {
   _type.value = t;
   return this;
  }
  UpdateTransactionVariablesBuilder amount(double? t) {
   _amount.value = t;
   return this;
  }
  UpdateTransactionVariablesBuilder date(Timestamp? t) {
   _date.value = t;
   return this;
  }
  UpdateTransactionVariablesBuilder category(String? t) {
   _category.value = t;
   return this;
  }
  UpdateTransactionVariablesBuilder receiptUrl(String? t) {
   _receiptUrl.value = t;
   return this;
  }
  UpdateTransactionVariablesBuilder recordedBy(String? t) {
   _recordedBy.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.updateTransaction(
  id: id,
)
.tenantId(tenantId)
.businessId(businessId)
.type(type)
.amount(amount)
.date(date)
.category(category)
.receiptUrl(receiptUrl)
.recordedBy(recordedBy)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<UpdateTransactionData, UpdateTransactionVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.updateTransaction(
  id: id,
);
UpdateTransactionData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.updateTransaction(
  id: id,
).ref();
ref.execute();
```


### DeleteTransaction
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.deleteTransaction(
  id: id,
).execute();
```



#### Return Type
`execute()` returns a `OperationResult<DeleteTransactionData, DeleteTransactionVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.deleteTransaction(
  id: id,
);
DeleteTransactionData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.deleteTransaction(
  id: id,
).ref();
ref.execute();
```


### CreateTaskComment
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
String taskId = ...;
String userId = ...;
String content = ...;
ExampleConnector.instance.createTaskComment(
  tenantId: tenantId,
  businessId: businessId,
  taskId: taskId,
  userId: userId,
  content: content,
).execute();
```



#### Return Type
`execute()` returns a `OperationResult<CreateTaskCommentData, CreateTaskCommentVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.createTaskComment(
  tenantId: tenantId,
  businessId: businessId,
  taskId: taskId,
  userId: userId,
  content: content,
);
CreateTaskCommentData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;
String taskId = ...;
String userId = ...;
String content = ...;

final ref = ExampleConnector.instance.createTaskComment(
  tenantId: tenantId,
  businessId: businessId,
  taskId: taskId,
  userId: userId,
  content: content,
).ref();
ref.execute();
```


### UpdateTaskComment
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.updateTaskComment(
  id: id,
).execute();
```

#### Optional Arguments
We return a builder for each query. For UpdateTaskComment, we created `UpdateTaskCommentBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class UpdateTaskCommentVariablesBuilder {
  ...
   UpdateTaskCommentVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateTaskCommentVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateTaskCommentVariablesBuilder taskId(String? t) {
   _taskId.value = t;
   return this;
  }
  UpdateTaskCommentVariablesBuilder userId(String? t) {
   _userId.value = t;
   return this;
  }
  UpdateTaskCommentVariablesBuilder content(String? t) {
   _content.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.updateTaskComment(
  id: id,
)
.tenantId(tenantId)
.businessId(businessId)
.taskId(taskId)
.userId(userId)
.content(content)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<UpdateTaskCommentData, UpdateTaskCommentVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.updateTaskComment(
  id: id,
);
UpdateTaskCommentData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.updateTaskComment(
  id: id,
).ref();
ref.execute();
```


### DeleteTaskComment
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.deleteTaskComment(
  id: id,
).execute();
```



#### Return Type
`execute()` returns a `OperationResult<DeleteTaskCommentData, DeleteTaskCommentVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.deleteTaskComment(
  id: id,
);
DeleteTaskCommentData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.deleteTaskComment(
  id: id,
).ref();
ref.execute();
```


### CreateEmployee
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
String fullName = ...;
String position = ...;
ExampleConnector.instance.createEmployee(
  tenantId: tenantId,
  businessId: businessId,
  fullName: fullName,
  position: position,
).execute();
```

#### Optional Arguments
We return a builder for each query. For CreateEmployee, we created `CreateEmployeeBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class CreateEmployeeVariablesBuilder {
  ...
   CreateEmployeeVariablesBuilder role(String? t) {
   _role.value = t;
   return this;
  }
  CreateEmployeeVariablesBuilder salary(double? t) {
   _salary.value = t;
   return this;
  }
  CreateEmployeeVariablesBuilder department(String? t) {
   _department.value = t;
   return this;
  }
  CreateEmployeeVariablesBuilder startDate(DateTime? t) {
   _startDate.value = t;
   return this;
  }
  CreateEmployeeVariablesBuilder status(String? t) {
   _status.value = t;
   return this;
  }
  CreateEmployeeVariablesBuilder code(String? t) {
   _code.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.createEmployee(
  tenantId: tenantId,
  businessId: businessId,
  fullName: fullName,
  position: position,
)
.role(role)
.salary(salary)
.department(department)
.startDate(startDate)
.status(status)
.code(code)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<CreateEmployeeData, CreateEmployeeVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.createEmployee(
  tenantId: tenantId,
  businessId: businessId,
  fullName: fullName,
  position: position,
);
CreateEmployeeData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;
String fullName = ...;
String position = ...;

final ref = ExampleConnector.instance.createEmployee(
  tenantId: tenantId,
  businessId: businessId,
  fullName: fullName,
  position: position,
).ref();
ref.execute();
```


### UpdateEmployee
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.updateEmployee(
  id: id,
).execute();
```

#### Optional Arguments
We return a builder for each query. For UpdateEmployee, we created `UpdateEmployeeBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class UpdateEmployeeVariablesBuilder {
  ...
   UpdateEmployeeVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateEmployeeVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateEmployeeVariablesBuilder fullName(String? t) {
   _fullName.value = t;
   return this;
  }
  UpdateEmployeeVariablesBuilder position(String? t) {
   _position.value = t;
   return this;
  }
  UpdateEmployeeVariablesBuilder role(String? t) {
   _role.value = t;
   return this;
  }
  UpdateEmployeeVariablesBuilder salary(double? t) {
   _salary.value = t;
   return this;
  }
  UpdateEmployeeVariablesBuilder department(String? t) {
   _department.value = t;
   return this;
  }
  UpdateEmployeeVariablesBuilder startDate(DateTime? t) {
   _startDate.value = t;
   return this;
  }
  UpdateEmployeeVariablesBuilder status(String? t) {
   _status.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.updateEmployee(
  id: id,
)
.tenantId(tenantId)
.businessId(businessId)
.fullName(fullName)
.position(position)
.role(role)
.salary(salary)
.department(department)
.startDate(startDate)
.status(status)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<UpdateEmployeeData, UpdateEmployeeVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.updateEmployee(
  id: id,
);
UpdateEmployeeData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.updateEmployee(
  id: id,
).ref();
ref.execute();
```


### DeleteEmployee
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.deleteEmployee(
  id: id,
).execute();
```



#### Return Type
`execute()` returns a `OperationResult<DeleteEmployeeData, DeleteEmployeeVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.deleteEmployee(
  id: id,
);
DeleteEmployeeData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.deleteEmployee(
  id: id,
).ref();
ref.execute();
```


### CreateCustomer
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
String customerName = ...;
ExampleConnector.instance.createCustomer(
  tenantId: tenantId,
  businessId: businessId,
  customerName: customerName,
).execute();
```

#### Optional Arguments
We return a builder for each query. For CreateCustomer, we created `CreateCustomerBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class CreateCustomerVariablesBuilder {
  ...
   CreateCustomerVariablesBuilder phoneNumber(String? t) {
   _phoneNumber.value = t;
   return this;
  }
  CreateCustomerVariablesBuilder email(String? t) {
   _email.value = t;
   return this;
  }
  CreateCustomerVariablesBuilder location(String? t) {
   _location.value = t;
   return this;
  }
  CreateCustomerVariablesBuilder totalOrders(int? t) {
   _totalOrders.value = t;
   return this;
  }
  CreateCustomerVariablesBuilder totalSpent(double? t) {
   _totalSpent.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.createCustomer(
  tenantId: tenantId,
  businessId: businessId,
  customerName: customerName,
)
.phoneNumber(phoneNumber)
.email(email)
.location(location)
.totalOrders(totalOrders)
.totalSpent(totalSpent)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<CreateCustomerData, CreateCustomerVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.createCustomer(
  tenantId: tenantId,
  businessId: businessId,
  customerName: customerName,
);
CreateCustomerData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;
String customerName = ...;

final ref = ExampleConnector.instance.createCustomer(
  tenantId: tenantId,
  businessId: businessId,
  customerName: customerName,
).ref();
ref.execute();
```


### UpdateCustomer
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.updateCustomer(
  id: id,
).execute();
```

#### Optional Arguments
We return a builder for each query. For UpdateCustomer, we created `UpdateCustomerBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class UpdateCustomerVariablesBuilder {
  ...
   UpdateCustomerVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateCustomerVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateCustomerVariablesBuilder customerName(String? t) {
   _customerName.value = t;
   return this;
  }
  UpdateCustomerVariablesBuilder phoneNumber(String? t) {
   _phoneNumber.value = t;
   return this;
  }
  UpdateCustomerVariablesBuilder email(String? t) {
   _email.value = t;
   return this;
  }
  UpdateCustomerVariablesBuilder location(String? t) {
   _location.value = t;
   return this;
  }
  UpdateCustomerVariablesBuilder totalOrders(int? t) {
   _totalOrders.value = t;
   return this;
  }
  UpdateCustomerVariablesBuilder totalSpent(double? t) {
   _totalSpent.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.updateCustomer(
  id: id,
)
.tenantId(tenantId)
.businessId(businessId)
.customerName(customerName)
.phoneNumber(phoneNumber)
.email(email)
.location(location)
.totalOrders(totalOrders)
.totalSpent(totalSpent)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<UpdateCustomerData, UpdateCustomerVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.updateCustomer(
  id: id,
);
UpdateCustomerData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.updateCustomer(
  id: id,
).ref();
ref.execute();
```


### DeleteCustomer
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.deleteCustomer(
  id: id,
).execute();
```



#### Return Type
`execute()` returns a `OperationResult<DeleteCustomerData, DeleteCustomerVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.deleteCustomer(
  id: id,
);
DeleteCustomerData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.deleteCustomer(
  id: id,
).ref();
ref.execute();
```


### CreateSupplier
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
String supplierName = ...;
ExampleConnector.instance.createSupplier(
  tenantId: tenantId,
  businessId: businessId,
  supplierName: supplierName,
).execute();
```

#### Optional Arguments
We return a builder for each query. For CreateSupplier, we created `CreateSupplierBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class CreateSupplierVariablesBuilder {
  ...
   CreateSupplierVariablesBuilder phoneNumber(String? t) {
   _phoneNumber.value = t;
   return this;
  }
  CreateSupplierVariablesBuilder email(String? t) {
   _email.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.createSupplier(
  tenantId: tenantId,
  businessId: businessId,
  supplierName: supplierName,
)
.phoneNumber(phoneNumber)
.email(email)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<CreateSupplierData, CreateSupplierVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.createSupplier(
  tenantId: tenantId,
  businessId: businessId,
  supplierName: supplierName,
);
CreateSupplierData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;
String supplierName = ...;

final ref = ExampleConnector.instance.createSupplier(
  tenantId: tenantId,
  businessId: businessId,
  supplierName: supplierName,
).ref();
ref.execute();
```


### UpdateSupplier
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.updateSupplier(
  id: id,
).execute();
```

#### Optional Arguments
We return a builder for each query. For UpdateSupplier, we created `UpdateSupplierBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class UpdateSupplierVariablesBuilder {
  ...
   UpdateSupplierVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateSupplierVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateSupplierVariablesBuilder supplierName(String? t) {
   _supplierName.value = t;
   return this;
  }
  UpdateSupplierVariablesBuilder phoneNumber(String? t) {
   _phoneNumber.value = t;
   return this;
  }
  UpdateSupplierVariablesBuilder email(String? t) {
   _email.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.updateSupplier(
  id: id,
)
.tenantId(tenantId)
.businessId(businessId)
.supplierName(supplierName)
.phoneNumber(phoneNumber)
.email(email)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<UpdateSupplierData, UpdateSupplierVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.updateSupplier(
  id: id,
);
UpdateSupplierData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.updateSupplier(
  id: id,
).ref();
ref.execute();
```


### DeleteSupplier
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.deleteSupplier(
  id: id,
).execute();
```



#### Return Type
`execute()` returns a `OperationResult<DeleteSupplierData, DeleteSupplierVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.deleteSupplier(
  id: id,
);
DeleteSupplierData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.deleteSupplier(
  id: id,
).ref();
ref.execute();
```


### CreateDocument
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
String title = ...;
String documentType = ...;
String fileUrl = ...;
String uploadedBy = ...;
ExampleConnector.instance.createDocument(
  tenantId: tenantId,
  businessId: businessId,
  title: title,
  documentType: documentType,
  fileUrl: fileUrl,
  uploadedBy: uploadedBy,
).execute();
```



#### Return Type
`execute()` returns a `OperationResult<CreateDocumentData, CreateDocumentVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.createDocument(
  tenantId: tenantId,
  businessId: businessId,
  title: title,
  documentType: documentType,
  fileUrl: fileUrl,
  uploadedBy: uploadedBy,
);
CreateDocumentData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;
String title = ...;
String documentType = ...;
String fileUrl = ...;
String uploadedBy = ...;

final ref = ExampleConnector.instance.createDocument(
  tenantId: tenantId,
  businessId: businessId,
  title: title,
  documentType: documentType,
  fileUrl: fileUrl,
  uploadedBy: uploadedBy,
).ref();
ref.execute();
```


### UpdateDocument
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.updateDocument(
  id: id,
).execute();
```

#### Optional Arguments
We return a builder for each query. For UpdateDocument, we created `UpdateDocumentBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class UpdateDocumentVariablesBuilder {
  ...
   UpdateDocumentVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateDocumentVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateDocumentVariablesBuilder title(String? t) {
   _title.value = t;
   return this;
  }
  UpdateDocumentVariablesBuilder documentType(String? t) {
   _documentType.value = t;
   return this;
  }
  UpdateDocumentVariablesBuilder fileUrl(String? t) {
   _fileUrl.value = t;
   return this;
  }
  UpdateDocumentVariablesBuilder uploadedBy(String? t) {
   _uploadedBy.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.updateDocument(
  id: id,
)
.tenantId(tenantId)
.businessId(businessId)
.title(title)
.documentType(documentType)
.fileUrl(fileUrl)
.uploadedBy(uploadedBy)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<UpdateDocumentData, UpdateDocumentVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.updateDocument(
  id: id,
);
UpdateDocumentData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.updateDocument(
  id: id,
).ref();
ref.execute();
```


### DeleteDocument
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.deleteDocument(
  id: id,
).execute();
```



#### Return Type
`execute()` returns a `OperationResult<DeleteDocumentData, DeleteDocumentVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.deleteDocument(
  id: id,
);
DeleteDocumentData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.deleteDocument(
  id: id,
).ref();
ref.execute();
```


### CreateActivityLog
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
String userId = ...;
String userName = ...;
String actionType = ...;
String module = ...;
ExampleConnector.instance.createActivityLog(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
  userName: userName,
  actionType: actionType,
  module: module,
).execute();
```

#### Optional Arguments
We return a builder for each query. For CreateActivityLog, we created `CreateActivityLogBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class CreateActivityLogVariablesBuilder {
  ...
   CreateActivityLogVariablesBuilder description(String? t) {
   _description.value = t;
   return this;
  }
  CreateActivityLogVariablesBuilder recordId(String? t) {
   _recordId.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.createActivityLog(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
  userName: userName,
  actionType: actionType,
  module: module,
)
.description(description)
.recordId(recordId)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<CreateActivityLogData, CreateActivityLogVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.createActivityLog(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
  userName: userName,
  actionType: actionType,
  module: module,
);
CreateActivityLogData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;
String userId = ...;
String userName = ...;
String actionType = ...;
String module = ...;

final ref = ExampleConnector.instance.createActivityLog(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
  userName: userName,
  actionType: actionType,
  module: module,
).ref();
ref.execute();
```


### UpdateActivityLog
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.updateActivityLog(
  id: id,
).execute();
```

#### Optional Arguments
We return a builder for each query. For UpdateActivityLog, we created `UpdateActivityLogBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class UpdateActivityLogVariablesBuilder {
  ...
   UpdateActivityLogVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateActivityLogVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateActivityLogVariablesBuilder userId(String? t) {
   _userId.value = t;
   return this;
  }
  UpdateActivityLogVariablesBuilder userName(String? t) {
   _userName.value = t;
   return this;
  }
  UpdateActivityLogVariablesBuilder actionType(String? t) {
   _actionType.value = t;
   return this;
  }
  UpdateActivityLogVariablesBuilder module(String? t) {
   _module.value = t;
   return this;
  }
  UpdateActivityLogVariablesBuilder description(String? t) {
   _description.value = t;
   return this;
  }
  UpdateActivityLogVariablesBuilder recordId(String? t) {
   _recordId.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.updateActivityLog(
  id: id,
)
.tenantId(tenantId)
.businessId(businessId)
.userId(userId)
.userName(userName)
.actionType(actionType)
.module(module)
.description(description)
.recordId(recordId)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<UpdateActivityLogData, UpdateActivityLogVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.updateActivityLog(
  id: id,
);
UpdateActivityLogData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.updateActivityLog(
  id: id,
).ref();
ref.execute();
```


### DeleteActivityLog
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.deleteActivityLog(
  id: id,
).execute();
```



#### Return Type
`execute()` returns a `OperationResult<DeleteActivityLogData, DeleteActivityLogVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.deleteActivityLog(
  id: id,
);
DeleteActivityLogData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.deleteActivityLog(
  id: id,
).ref();
ref.execute();
```


### CreateAiQuery
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
String userId = ...;
String queryText = ...;
ExampleConnector.instance.createAiQuery(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
  queryText: queryText,
).execute();
```

#### Optional Arguments
We return a builder for each query. For CreateAiQuery, we created `CreateAiQueryBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class CreateAiQueryVariablesBuilder {
  ...
   CreateAiQueryVariablesBuilder response(String? t) {
   _response.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.createAiQuery(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
  queryText: queryText,
)
.response(response)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<CreateAiQueryData, CreateAiQueryVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.createAiQuery(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
  queryText: queryText,
);
CreateAiQueryData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;
String userId = ...;
String queryText = ...;

final ref = ExampleConnector.instance.createAiQuery(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
  queryText: queryText,
).ref();
ref.execute();
```


### UpdateAiQuery
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.updateAiQuery(
  id: id,
).execute();
```

#### Optional Arguments
We return a builder for each query. For UpdateAiQuery, we created `UpdateAiQueryBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class UpdateAiQueryVariablesBuilder {
  ...
   UpdateAiQueryVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateAiQueryVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateAiQueryVariablesBuilder userId(String? t) {
   _userId.value = t;
   return this;
  }
  UpdateAiQueryVariablesBuilder queryText(String? t) {
   _queryText.value = t;
   return this;
  }
  UpdateAiQueryVariablesBuilder response(String? t) {
   _response.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.updateAiQuery(
  id: id,
)
.tenantId(tenantId)
.businessId(businessId)
.userId(userId)
.queryText(queryText)
.response(response)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<UpdateAiQueryData, UpdateAiQueryVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.updateAiQuery(
  id: id,
);
UpdateAiQueryData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.updateAiQuery(
  id: id,
).ref();
ref.execute();
```


### DeleteAiQuery
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.deleteAiQuery(
  id: id,
).execute();
```



#### Return Type
`execute()` returns a `OperationResult<DeleteAiQueryData, DeleteAiQueryVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.deleteAiQuery(
  id: id,
);
DeleteAiQueryData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.deleteAiQuery(
  id: id,
).ref();
ref.execute();
```


### CreateNotification
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
String userId = ...;
String message = ...;
bool isRead = ...;
ExampleConnector.instance.createNotification(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
  message: message,
  isRead: isRead,
).execute();
```



#### Return Type
`execute()` returns a `OperationResult<CreateNotificationData, CreateNotificationVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.createNotification(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
  message: message,
  isRead: isRead,
);
CreateNotificationData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;
String userId = ...;
String message = ...;
bool isRead = ...;

final ref = ExampleConnector.instance.createNotification(
  tenantId: tenantId,
  businessId: businessId,
  userId: userId,
  message: message,
  isRead: isRead,
).ref();
ref.execute();
```


### UpdateNotification
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.updateNotification(
  id: id,
).execute();
```

#### Optional Arguments
We return a builder for each query. For UpdateNotification, we created `UpdateNotificationBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class UpdateNotificationVariablesBuilder {
  ...
   UpdateNotificationVariablesBuilder tenantId(String? t) {
   _tenantId.value = t;
   return this;
  }
  UpdateNotificationVariablesBuilder businessId(String? t) {
   _businessId.value = t;
   return this;
  }
  UpdateNotificationVariablesBuilder userId(String? t) {
   _userId.value = t;
   return this;
  }
  UpdateNotificationVariablesBuilder message(String? t) {
   _message.value = t;
   return this;
  }
  UpdateNotificationVariablesBuilder isRead(bool? t) {
   _isRead.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.updateNotification(
  id: id,
)
.tenantId(tenantId)
.businessId(businessId)
.userId(userId)
.message(message)
.isRead(isRead)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<UpdateNotificationData, UpdateNotificationVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.updateNotification(
  id: id,
);
UpdateNotificationData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.updateNotification(
  id: id,
).ref();
ref.execute();
```


### DeleteNotification
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.deleteNotification(
  id: id,
).execute();
```



#### Return Type
`execute()` returns a `OperationResult<DeleteNotificationData, DeleteNotificationVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.deleteNotification(
  id: id,
);
DeleteNotificationData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.deleteNotification(
  id: id,
).ref();
ref.execute();
```


### CreateTask
#### Required Arguments
```dart
String tenantId = ...;
String businessId = ...;
String title = ...;
TaskStatus status = ...;
Timestamp dueDate = ...;
String createdBy = ...;
ExampleConnector.instance.createTask(
  tenantId: tenantId,
  businessId: businessId,
  title: title,
  status: status,
  dueDate: dueDate,
  createdBy: createdBy,
).execute();
```

#### Optional Arguments
We return a builder for each query. For CreateTask, we created `CreateTaskBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class CreateTaskVariablesBuilder {
  ...
   CreateTaskVariablesBuilder description(String? t) {
   _description.value = t;
   return this;
  }
  CreateTaskVariablesBuilder priority(TaskPriority? t) {
   _priority.value = t;
   return this;
  }
  CreateTaskVariablesBuilder assignedToId(String? t) {
   _assignedToId.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.createTask(
  tenantId: tenantId,
  businessId: businessId,
  title: title,
  status: status,
  dueDate: dueDate,
  createdBy: createdBy,
)
.description(description)
.priority(priority)
.assignedToId(assignedToId)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<CreateTaskData, CreateTaskVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.createTask(
  tenantId: tenantId,
  businessId: businessId,
  title: title,
  status: status,
  dueDate: dueDate,
  createdBy: createdBy,
);
CreateTaskData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String tenantId = ...;
String businessId = ...;
String title = ...;
TaskStatus status = ...;
Timestamp dueDate = ...;
String createdBy = ...;

final ref = ExampleConnector.instance.createTask(
  tenantId: tenantId,
  businessId: businessId,
  title: title,
  status: status,
  dueDate: dueDate,
  createdBy: createdBy,
).ref();
ref.execute();
```


### UpdateTask
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.updateTask(
  id: id,
).execute();
```

#### Optional Arguments
We return a builder for each query. For UpdateTask, we created `UpdateTaskBuilder`. For queries and mutations with optional parameters, we return a builder class.
The builder pattern allows Data Connect to distinguish between fields that haven't been set and fields that have been set to null. A field can be set by calling its respective setter method like below:
```dart
class UpdateTaskVariablesBuilder {
  ...
   UpdateTaskVariablesBuilder title(String? t) {
   _title.value = t;
   return this;
  }
  UpdateTaskVariablesBuilder description(String? t) {
   _description.value = t;
   return this;
  }
  UpdateTaskVariablesBuilder status(TaskStatus? t) {
   _status.value = t;
   return this;
  }
  UpdateTaskVariablesBuilder priority(TaskPriority? t) {
   _priority.value = t;
   return this;
  }
  UpdateTaskVariablesBuilder dueDate(Timestamp? t) {
   _dueDate.value = t;
   return this;
  }
  UpdateTaskVariablesBuilder assignedToId(String? t) {
   _assignedToId.value = t;
   return this;
  }

  ...
}
ExampleConnector.instance.updateTask(
  id: id,
)
.title(title)
.description(description)
.status(status)
.priority(priority)
.dueDate(dueDate)
.assignedToId(assignedToId)
.execute();
```

#### Return Type
`execute()` returns a `OperationResult<UpdateTaskData, UpdateTaskVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.updateTask(
  id: id,
);
UpdateTaskData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.updateTask(
  id: id,
).ref();
ref.execute();
```


### DeleteTask
#### Required Arguments
```dart
String id = ...;
ExampleConnector.instance.deleteTask(
  id: id,
).execute();
```



#### Return Type
`execute()` returns a `OperationResult<DeleteTaskData, DeleteTaskVariables>`
```dart
/// Result of an Operation Request (query/mutation).
class OperationResult<Data, Variables> {
  OperationResult(this.dataConnect, this.data, this.ref);
  Data data;
  OperationRef<Data, Variables> ref;
  FirebaseDataConnect dataConnect;
}

final result = await ExampleConnector.instance.deleteTask(
  id: id,
);
DeleteTaskData data = result.data;
final ref = result.ref;
```

#### Getting the Ref
Each builder returns an `execute` function, which is a helper function that creates a `Ref` object, and executes the underlying operation.
An example of how to use the `Ref` object is shown below:
```dart
String id = ...;

final ref = ExampleConnector.instance.deleteTask(
  id: id,
).ref();
ref.execute();
```

