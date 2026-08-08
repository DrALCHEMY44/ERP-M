library dataconnect_generated;
import 'package:firebase_data_connect/firebase_data_connect.dart';
import 'package:flutter/foundation.dart';
import 'dart:convert';
import 'package:flutter/foundation.dart';

part 'create_tenant.dart';

part 'update_tenant.dart';

part 'delete_tenant.dart';

part 'create_user.dart';

part 'update_user.dart';

part 'delete_user.dart';

part 'create_business.dart';

part 'update_business.dart';

part 'delete_business.dart';

part 'provision_employee_user.dart';

part 'complete_assigned_task.dart';

part 'create_product.dart';

part 'update_product.dart';

part 'delete_product.dart';

part 'create_transaction.dart';

part 'update_transaction.dart';

part 'delete_transaction.dart';

part 'create_task_comment.dart';

part 'update_task_comment.dart';

part 'delete_task_comment.dart';

part 'create_employee.dart';

part 'update_employee.dart';

part 'delete_employee.dart';

part 'create_customer.dart';

part 'update_customer.dart';

part 'delete_customer.dart';

part 'create_supplier.dart';

part 'update_supplier.dart';

part 'delete_supplier.dart';

part 'create_document.dart';

part 'update_document.dart';

part 'delete_document.dart';

part 'create_activity_log.dart';

part 'update_activity_log.dart';

part 'delete_activity_log.dart';

part 'create_ai_query.dart';

part 'update_ai_query.dart';

part 'delete_ai_query.dart';

part 'create_notification.dart';

part 'update_notification.dart';

part 'delete_notification.dart';

part 'create_task.dart';

part 'update_task.dart';

part 'delete_task.dart';

part 'list_tenants.dart';

part 'list_users.dart';

part 'list_businesses.dart';

part 'get_user_by_email.dart';

part 'get_business_by_id.dart';

part 'get_business_by_code.dart';

part 'get_businesses_by_name.dart';

part 'verify_employee_access.dart';

part 'verify_user_login.dart';

part 'list_products_by_business.dart';

part 'list_customers_by_business.dart';

part 'list_users_by_business.dart';

part 'list_suppliers_by_business.dart';

part 'list_tasks_by_business.dart';

part 'list_tasks_assigned_to_user.dart';

part 'list_transactions_by_business.dart';

part 'list_transactions_by_type.dart';

part 'list_employees_by_business.dart';

part 'list_documents_by_business.dart';

part 'list_activity_logs_by_user.dart';

part 'list_activity_logs_by_business.dart';

part 'get_user_by_id.dart';

part 'list_notifications.dart';



  enum TaskPriority {
    
      LOW,
    
      MEDIUM,
    
      HIGH,
    
  }
  
  String taskPrioritySerializer(EnumValue<TaskPriority> e) {
    return e.stringValue;
  }
  EnumValue<TaskPriority> taskPriorityDeserializer(dynamic data) {
    switch (data) {
      
      case 'LOW':
        return const Known(TaskPriority.LOW);
      
      case 'MEDIUM':
        return const Known(TaskPriority.MEDIUM);
      
      case 'HIGH':
        return const Known(TaskPriority.HIGH);
      
      default:
        return Unknown(data);
    }
  }
  

  enum TaskStatus {
    
      PENDING,
    
      ONGOING,
    
      COMPLETED,
    
      LATE,
    
  }
  
  String taskStatusSerializer(EnumValue<TaskStatus> e) {
    return e.stringValue;
  }
  EnumValue<TaskStatus> taskStatusDeserializer(dynamic data) {
    switch (data) {
      
      case 'PENDING':
        return const Known(TaskStatus.PENDING);
      
      case 'ONGOING':
        return const Known(TaskStatus.ONGOING);
      
      case 'COMPLETED':
        return const Known(TaskStatus.COMPLETED);
      
      case 'LATE':
        return const Known(TaskStatus.LATE);
      
      default:
        return Unknown(data);
    }
  }
  

  enum TransactionType {
    
      SALE,
    
      EXPENSE,
    
  }
  
  String transactionTypeSerializer(EnumValue<TransactionType> e) {
    return e.stringValue;
  }
  EnumValue<TransactionType> transactionTypeDeserializer(dynamic data) {
    switch (data) {
      
      case 'SALE':
        return const Known(TransactionType.SALE);
      
      case 'EXPENSE':
        return const Known(TransactionType.EXPENSE);
      
      default:
        return Unknown(data);
    }
  }
  



String enumSerializer(Enum e) {
  return e.name;
}



/// A sealed class representing either a known enum value or an unknown string value.
@immutable
sealed class EnumValue<T extends Enum> {
  const EnumValue();

  

  /// The string representation of the value.
  String get stringValue;
  @override
  String toString() {
    return "EnumValue($stringValue)";
  }
}

/// Represents a known, valid enum value.
class Known<T extends Enum> extends EnumValue<T> {
  /// The actual enum value.
  final T value;

  const Known(this.value);

  @override
  String get stringValue => value.name;

  @override
  String toString() {
    return "Known($stringValue)";
  }
}
/// Represents an unknown or unrecognized enum value.
class Unknown extends EnumValue<Never> {
  /// The raw string value that couldn't be mapped to a known enum.
  @override
  final String stringValue;

  const Unknown(this.stringValue);
  @override
  String toString() {
    return "Unknown($stringValue)";
  }
}

class ExampleConnector {
  
  
  CreateTenantVariablesBuilder createTenant ({required String name, required String businessSector, required String location, required String ownerEmail, }) {
    return CreateTenantVariablesBuilder(dataConnect, name: name,businessSector: businessSector,location: location,ownerEmail: ownerEmail,);
  }
  
  
  UpdateTenantVariablesBuilder updateTenant ({required String id, }) {
    return UpdateTenantVariablesBuilder(dataConnect, id: id,);
  }
  
  
  DeleteTenantVariablesBuilder deleteTenant ({required String id, }) {
    return DeleteTenantVariablesBuilder(dataConnect, id: id,);
  }
  
  
  CreateUserVariablesBuilder createUser ({required String tenantId, required String businessId, required String email, required String role, }) {
    return CreateUserVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,email: email,role: role,);
  }
  
  
  UpdateUserVariablesBuilder updateUser ({required String id, }) {
    return UpdateUserVariablesBuilder(dataConnect, id: id,);
  }
  
  
  DeleteUserVariablesBuilder deleteUser ({required String id, }) {
    return DeleteUserVariablesBuilder(dataConnect, id: id,);
  }
  
  
  CreateBusinessVariablesBuilder createBusiness ({required String tenantId, required String name, required String location, required String code, }) {
    return CreateBusinessVariablesBuilder(dataConnect, tenantId: tenantId,name: name,location: location,code: code,);
  }
  
  
  UpdateBusinessVariablesBuilder updateBusiness ({required String id, }) {
    return UpdateBusinessVariablesBuilder(dataConnect, id: id,);
  }
  
  
  DeleteBusinessVariablesBuilder deleteBusiness ({required String id, }) {
    return DeleteBusinessVariablesBuilder(dataConnect, id: id,);
  }
  
  
  ProvisionEmployeeUserVariablesBuilder provisionEmployeeUser ({required String tenantId, required String businessId, required String email, required String role, required String fullName, required String accessCode, }) {
    return ProvisionEmployeeUserVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,email: email,role: role,fullName: fullName,accessCode: accessCode,);
  }
  
  
  CompleteAssignedTaskVariablesBuilder completeAssignedTask ({required String taskId, required String userId, required String accessCode, }) {
    return CompleteAssignedTaskVariablesBuilder(dataConnect, taskId: taskId,userId: userId,accessCode: accessCode,);
  }
  
  
  CreateProductVariablesBuilder createProduct ({required String tenantId, required String businessId, required String name, required int quantity, required double sellingPrice, required String createdBy, }) {
    return CreateProductVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,name: name,quantity: quantity,sellingPrice: sellingPrice,createdBy: createdBy,);
  }
  
  
  UpdateProductVariablesBuilder updateProduct ({required String id, }) {
    return UpdateProductVariablesBuilder(dataConnect, id: id,);
  }
  
  
  DeleteProductVariablesBuilder deleteProduct ({required String id, }) {
    return DeleteProductVariablesBuilder(dataConnect, id: id,);
  }
  
  
  CreateTransactionVariablesBuilder createTransaction ({required String tenantId, required String businessId, required TransactionType type, required double amount, required Timestamp date, required String recordedBy, }) {
    return CreateTransactionVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,type: type,amount: amount,date: date,recordedBy: recordedBy,);
  }
  
  
  UpdateTransactionVariablesBuilder updateTransaction ({required String id, }) {
    return UpdateTransactionVariablesBuilder(dataConnect, id: id,);
  }
  
  
  DeleteTransactionVariablesBuilder deleteTransaction ({required String id, }) {
    return DeleteTransactionVariablesBuilder(dataConnect, id: id,);
  }
  
  
  CreateTaskCommentVariablesBuilder createTaskComment ({required String tenantId, required String businessId, required String taskId, required String userId, required String content, }) {
    return CreateTaskCommentVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,taskId: taskId,userId: userId,content: content,);
  }
  
  
  UpdateTaskCommentVariablesBuilder updateTaskComment ({required String id, }) {
    return UpdateTaskCommentVariablesBuilder(dataConnect, id: id,);
  }
  
  
  DeleteTaskCommentVariablesBuilder deleteTaskComment ({required String id, }) {
    return DeleteTaskCommentVariablesBuilder(dataConnect, id: id,);
  }
  
  
  CreateEmployeeVariablesBuilder createEmployee ({required String tenantId, required String businessId, required String fullName, required String position, }) {
    return CreateEmployeeVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,fullName: fullName,position: position,);
  }
  
  
  UpdateEmployeeVariablesBuilder updateEmployee ({required String id, }) {
    return UpdateEmployeeVariablesBuilder(dataConnect, id: id,);
  }
  
  
  DeleteEmployeeVariablesBuilder deleteEmployee ({required String id, }) {
    return DeleteEmployeeVariablesBuilder(dataConnect, id: id,);
  }
  
  
  CreateCustomerVariablesBuilder createCustomer ({required String tenantId, required String businessId, required String customerName, }) {
    return CreateCustomerVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,customerName: customerName,);
  }
  
  
  UpdateCustomerVariablesBuilder updateCustomer ({required String id, }) {
    return UpdateCustomerVariablesBuilder(dataConnect, id: id,);
  }
  
  
  DeleteCustomerVariablesBuilder deleteCustomer ({required String id, }) {
    return DeleteCustomerVariablesBuilder(dataConnect, id: id,);
  }
  
  
  CreateSupplierVariablesBuilder createSupplier ({required String tenantId, required String businessId, required String supplierName, }) {
    return CreateSupplierVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,supplierName: supplierName,);
  }
  
  
  UpdateSupplierVariablesBuilder updateSupplier ({required String id, }) {
    return UpdateSupplierVariablesBuilder(dataConnect, id: id,);
  }
  
  
  DeleteSupplierVariablesBuilder deleteSupplier ({required String id, }) {
    return DeleteSupplierVariablesBuilder(dataConnect, id: id,);
  }
  
  
  CreateDocumentVariablesBuilder createDocument ({required String tenantId, required String businessId, required String title, required String documentType, required String fileUrl, required String uploadedBy, }) {
    return CreateDocumentVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,title: title,documentType: documentType,fileUrl: fileUrl,uploadedBy: uploadedBy,);
  }
  
  
  UpdateDocumentVariablesBuilder updateDocument ({required String id, }) {
    return UpdateDocumentVariablesBuilder(dataConnect, id: id,);
  }
  
  
  DeleteDocumentVariablesBuilder deleteDocument ({required String id, }) {
    return DeleteDocumentVariablesBuilder(dataConnect, id: id,);
  }
  
  
  CreateActivityLogVariablesBuilder createActivityLog ({required String tenantId, required String businessId, required String userId, required String userName, required String actionType, required String module, }) {
    return CreateActivityLogVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,userId: userId,userName: userName,actionType: actionType,module: module,);
  }
  
  
  UpdateActivityLogVariablesBuilder updateActivityLog ({required String id, }) {
    return UpdateActivityLogVariablesBuilder(dataConnect, id: id,);
  }
  
  
  DeleteActivityLogVariablesBuilder deleteActivityLog ({required String id, }) {
    return DeleteActivityLogVariablesBuilder(dataConnect, id: id,);
  }
  
  
  CreateAiQueryVariablesBuilder createAiQuery ({required String tenantId, required String businessId, required String userId, required String queryText, }) {
    return CreateAiQueryVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,userId: userId,queryText: queryText,);
  }
  
  
  UpdateAiQueryVariablesBuilder updateAiQuery ({required String id, }) {
    return UpdateAiQueryVariablesBuilder(dataConnect, id: id,);
  }
  
  
  DeleteAiQueryVariablesBuilder deleteAiQuery ({required String id, }) {
    return DeleteAiQueryVariablesBuilder(dataConnect, id: id,);
  }
  
  
  CreateNotificationVariablesBuilder createNotification ({required String tenantId, required String businessId, required String userId, required String message, required bool isRead, }) {
    return CreateNotificationVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,userId: userId,message: message,isRead: isRead,);
  }
  
  
  UpdateNotificationVariablesBuilder updateNotification ({required String id, }) {
    return UpdateNotificationVariablesBuilder(dataConnect, id: id,);
  }
  
  
  DeleteNotificationVariablesBuilder deleteNotification ({required String id, }) {
    return DeleteNotificationVariablesBuilder(dataConnect, id: id,);
  }
  
  
  CreateTaskVariablesBuilder createTask ({required String tenantId, required String businessId, required String title, required TaskStatus status, required Timestamp dueDate, required String createdBy, }) {
    return CreateTaskVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,title: title,status: status,dueDate: dueDate,createdBy: createdBy,);
  }
  
  
  UpdateTaskVariablesBuilder updateTask ({required String id, }) {
    return UpdateTaskVariablesBuilder(dataConnect, id: id,);
  }
  
  
  DeleteTaskVariablesBuilder deleteTask ({required String id, }) {
    return DeleteTaskVariablesBuilder(dataConnect, id: id,);
  }
  
  
  ListTenantsVariablesBuilder listTenants () {
    return ListTenantsVariablesBuilder(dataConnect, );
  }
  
  
  ListUsersVariablesBuilder listUsers () {
    return ListUsersVariablesBuilder(dataConnect, );
  }
  
  
  ListBusinessesVariablesBuilder listBusinesses ({required String tenantId, }) {
    return ListBusinessesVariablesBuilder(dataConnect, tenantId: tenantId,);
  }
  
  
  GetUserByEmailVariablesBuilder getUserByEmail ({required String email, }) {
    return GetUserByEmailVariablesBuilder(dataConnect, email: email,);
  }
  
  
  GetBusinessByIdVariablesBuilder getBusinessById ({required String id, }) {
    return GetBusinessByIdVariablesBuilder(dataConnect, id: id,);
  }
  
  
  GetBusinessByCodeVariablesBuilder getBusinessByCode ({required String code, }) {
    return GetBusinessByCodeVariablesBuilder(dataConnect, code: code,);
  }
  
  
  GetBusinessesByNameVariablesBuilder getBusinessesByName ({required String name, }) {
    return GetBusinessesByNameVariablesBuilder(dataConnect, name: name,);
  }
  
  
  VerifyEmployeeAccessVariablesBuilder verifyEmployeeAccess ({required String fullName, required String role, required String accessCode, required String tenantId, required String businessId, }) {
    return VerifyEmployeeAccessVariablesBuilder(dataConnect, fullName: fullName,role: role,accessCode: accessCode,tenantId: tenantId,businessId: businessId,);
  }
  
  
  VerifyUserLoginVariablesBuilder verifyUserLogin ({required String email, required String fullName, required String role, required String accessCode, required String tenantId, required String businessId, }) {
    return VerifyUserLoginVariablesBuilder(dataConnect, email: email,fullName: fullName,role: role,accessCode: accessCode,tenantId: tenantId,businessId: businessId,);
  }
  
  
  ListProductsByBusinessVariablesBuilder listProductsByBusiness ({required String tenantId, required String businessId, }) {
    return ListProductsByBusinessVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,);
  }
  
  
  ListCustomersByBusinessVariablesBuilder listCustomersByBusiness ({required String tenantId, required String businessId, }) {
    return ListCustomersByBusinessVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,);
  }
  
  
  ListUsersByBusinessVariablesBuilder listUsersByBusiness ({required String tenantId, required String businessId, }) {
    return ListUsersByBusinessVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,);
  }
  
  
  ListSuppliersByBusinessVariablesBuilder listSuppliersByBusiness ({required String tenantId, required String businessId, }) {
    return ListSuppliersByBusinessVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,);
  }
  
  
  ListTasksByBusinessVariablesBuilder listTasksByBusiness ({required String tenantId, required String businessId, }) {
    return ListTasksByBusinessVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,);
  }
  
  
  ListTasksAssignedToUserVariablesBuilder listTasksAssignedToUser ({required String tenantId, required String businessId, required String userId, }) {
    return ListTasksAssignedToUserVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,userId: userId,);
  }
  
  
  ListTransactionsByBusinessVariablesBuilder listTransactionsByBusiness ({required String tenantId, required String businessId, }) {
    return ListTransactionsByBusinessVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,);
  }
  
  
  ListTransactionsByTypeVariablesBuilder listTransactionsByType ({required String tenantId, required String businessId, required TransactionType type, }) {
    return ListTransactionsByTypeVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,type: type,);
  }
  
  
  ListEmployeesByBusinessVariablesBuilder listEmployeesByBusiness ({required String tenantId, required String businessId, }) {
    return ListEmployeesByBusinessVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,);
  }
  
  
  ListDocumentsByBusinessVariablesBuilder listDocumentsByBusiness ({required String tenantId, required String businessId, }) {
    return ListDocumentsByBusinessVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,);
  }
  
  
  ListActivityLogsByUserVariablesBuilder listActivityLogsByUser ({required String tenantId, required String businessId, required String userId, }) {
    return ListActivityLogsByUserVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,userId: userId,);
  }
  
  
  ListActivityLogsByBusinessVariablesBuilder listActivityLogsByBusiness ({required String tenantId, required String businessId, }) {
    return ListActivityLogsByBusinessVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,);
  }
  
  
  GetUserByIdVariablesBuilder getUserById ({required String id, }) {
    return GetUserByIdVariablesBuilder(dataConnect, id: id,);
  }
  
  
  ListNotificationsVariablesBuilder listNotifications ({required String tenantId, required String businessId, required String userId, }) {
    return ListNotificationsVariablesBuilder(dataConnect, tenantId: tenantId,businessId: businessId,userId: userId,);
  }
  

  static ConnectorConfig connectorConfig = ConnectorConfig(
    'us-east4',
    'example',
    'studio-8058744913-5a601-service',
  );

  ExampleConnector({required this.dataConnect});
  static ExampleConnector get instance {
    
    CacheSettings cacheSettings = CacheSettings(
      maxAge: Duration(milliseconds:0),
      storage: CacheStorage.persistent,
    );
    
    return ExampleConnector(
        dataConnect: FirebaseDataConnect.instanceFor(
            connectorConfig: connectorConfig,
            
            cacheSettings: cacheSettings,
            
            sdkType: CallerSDKType.generated));
  }

  FirebaseDataConnect dataConnect;
}
