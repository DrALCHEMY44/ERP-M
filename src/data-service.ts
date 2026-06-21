
import {
  Connector,
  getConnector,
  Model,
  Column,
  Table,
  PrimaryColumn,
  CreateTimestamp,
  UpdateTimestamp,
  Relation,
  OneToMany,
  ManyToOne,
} from "@dataconnect/generated";

export enum SubscriptionTier {
  BASIC = "BASIC",
  PREMIUM = "PREMIUM",
  ENTERPRISE = "ENTERPRISE",
}

export enum TransactionType {
  SALE = "SALE",
  EXPENSE = "EXPENSE",
}

export enum TaskStatus {
  PENDING = "PENDING",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  LATE = "LATE",
  OVERDUE = "OVERDUE",
}

export enum TaskPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT",
}

export enum EmployeeStatus {
    ACTIVE = "ACTIVE",
    ON_LEAVE = "ON_LEAVE",
    SUSPENDED = "SUSPENDED",
    TERMINATED = "TERMINATED",
}

@Model()
export class Tenant {
  @PrimaryColumn({ type: "uuid", default: "uuidv4()" })
  id: string;

  @Column()
  name: string;

  @Column()
  businessSector: string;

  @Column()
  location: string;

  @Column({ unique: true })
  ownerEmail: string;

  @Column({ nullable: true })
  taxId?: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({ type: "enum", enum: SubscriptionTier, nullable: true })
  subscriptionTier?: SubscriptionTier;

  @CreateTimestamp()
  createdAt: string;
}

@Model()
export class User {
  @PrimaryColumn({ type: "uuid", default: "uuidv4()" })
  id: string;

  @Column({ type: "uuid" })
  tenantId: string;

  @Column({ type: "uuid" })
  businessId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  department?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @CreateTimestamp()
  createdAt: string;
}

@Model()
export class Business {
  @PrimaryColumn({ type: "uuid", default: "uuidv4()" })
  id: string;

  @Column({ type: "uuid" })
  tenantId: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  businessType?: string;

  @Column({ nullable: true })
  region?: string;

  @CreateTimestamp()
  createdAt: string;
}

@Model()
export class Product {
  @PrimaryColumn({ type: "uuid", default: "uuidv4()" })
  id: string;

  @Column({ type: "uuid" })
  tenantId: string;

  @Column({ type: "uuid" })
  businessId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "float", nullable: true })
  costPrice?: number;

  @Column({ type: "float" })
  sellingPrice: number;

  @Column({ type: "date", nullable: true })
  expiryDate?: string;

  @Column({ type: "int", nullable: true })
  lowStockLevel?: number;

  @Column({ type: "uuid" })
  createdBy: string;

  @CreateTimestamp()
  createdAt: string;

  @UpdateTimestamp()
  updatedAt?: string;
}

@Model()
export class Transaction {
  @PrimaryColumn({ type: "uuid", default: "uuidv4()" })
  id: string;

  @Column({ type: "uuid" })
  tenantId: string;

  @Column({ type: "uuid" })
  businessId: string;

  @Column({ type: "enum", enum: TransactionType })
  type: TransactionType;

  @Column({ type: "float" })
  amount: number;

  @Column({ type: "timestamp" })
  date: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ nullable: true })
  receiptUrl?: string;

  @Column({ type: "uuid" })
  recordedBy: string;

  @CreateTimestamp()
  createdAt: string;
}

@Model()
export class Task {
  @PrimaryColumn({ type: "uuid", default: "uuidv4()" })
  id: string;

  @Column({ type: "uuid" })
  tenantId: string;

  @Column({ type: "uuid" })
  businessId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "enum", enum: TaskStatus })
  status: TaskStatus;

  @Column({ type: "enum", enum: TaskPriority, nullable: true })
  priority?: TaskPriority;

  @Column({ type: "timestamp" })
  dueDate: string;

  @ManyToOne(() => User)
  assignedTo?: User;

  @Column({ type: "uuid" })
  createdBy: string;

  @CreateTimestamp()
  createdAt: string;

  @UpdateTimestamp()
  updatedAt?: string;
}

@Model()
export class TaskComment {
  @PrimaryColumn({ type: "uuid", default: "uuidv4()" })
  id: string;

  @Column({ type: "uuid" })
  tenantId: string;

  @Column({ type: "uuid" })
  businessId: string;

  @ManyToOne(() => Task)
  task: Task;

  @ManyToOne(() => User)
  user: User;

  @Column()
  content: string;

  @CreateTimestamp()
  createdAt: string;
}

@Model()
export class Employee {
  @PrimaryColumn({ type: "uuid", default: "uuidv4()" })
  id: string;

  @Column({ type: "uuid" })
  tenantId: string;

  @Column({ type: "uuid" })
  businessId: string;

  @Column()
  fullName: string;

  @Column()
  position: string;

  @Column({ type: "float", nullable: true })
  salary?: number;

  @Column({ nullable: true })
  department?: string;

  @Column({ type: "date", nullable: true })
  startDate?: string;

  @Column({ type: "enum", enum: EmployeeStatus, nullable: true })
  status?: EmployeeStatus;

  @CreateTimestamp()
  createdAt: string;
}

@Model()
export class Customer {
  @PrimaryColumn({ type: "uuid", default: "uuidv4()" })
  id: string;

  @Column({ type: "uuid" })
  tenantId: string;

  @Column({ type: "uuid" })
  businessId: string;

  @Column()
  customerName: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  email?: string;

  @CreateTimestamp()
  createdAt: string;
}

@Model()
export class Supplier {
  @PrimaryColumn({ type: "uuid", default: "uuidv4()" })
  id: string;

  @Column({ type: "uuid" })
  tenantId: string;

  @Column({ type: "uuid" })
  businessId: string;

  @Column()
  supplierName: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  email?: string;

  @CreateTimestamp()
  createdAt: string;
}

@Model()
export class Document {
  @PrimaryColumn({ type: "uuid", default: "uuidv4()" })
  id: string;

  @Column({ type: "uuid" })
  tenantId: string;

  @Column({ type: "uuid" })
  businessId: string;

  @Column()
  title: string;

  @Column()
  documentType: string;

  @Column()
  fileUrl: string;

  @Column({ type: "uuid" })
  uploadedBy: string;

  @CreateTimestamp()
  uploadedAt: string;
}

@Model()
export class ActivityLog {
  @PrimaryColumn({ type: "uuid", default: "uuidv4()" })
  id: string;

  @Column({ type: "uuid" })
  tenantId: string;

  @Column({ type: "uuid" })
  businessId: string;

  @Column({ type: "uuid" })
  userId: string;

  @Column()
  userName: string;

  @Column()
  actionType: string;

  @Column()
  module: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "uuid", nullable: true })
  recordId?: string;

  @CreateTimestamp()
  timestamp: string;
}

@Model()
export class AIQuery {
  @PrimaryColumn({ type: "uuid", default: "uuidv4()" })
  id: string;

  @Column({ type: "uuid" })
  tenantId: string;

  @Column({ type: "uuid" })
  businessId: string;

  @Column({ type: "uuid" })
  userId: string;

  @Column()
  queryText: string;

  @Column({ nullable: true })
  response?: string;

  @CreateTimestamp()
  timestamp: string;
}

@Model()
export class Notification {
  @PrimaryColumn({ type: "uuid", default: "uuidv4()" })
  id: string;

  @Column({ type: "uuid" })
  tenantId: string;

  @Column({ type: "uuid" })
  businessId: string;

  @Column({ type: "uuid" })
  userId: string;

  @Column()
  message: string;

  @Column({ type: "boolean", default: "false" })
  isRead: boolean;

  @CreateTimestamp()
  createdAt: string;
}

class DataService {
  private connector: Connector;

  constructor() {
    this.connector = getConnector();
  }

  public get Tenant(): Table<Tenant> {
    return this.connector.table("Tenant", Tenant);
  }

  public get User(): Table<User> {
    return this.connector.table("User", User);
  }

  public get Business(): Table<Business> {
    return this.connector.table("Business", Business);
  }

  public get Product(): Table<Product> {
    return this.connector.table("Product", Product);
  }

  public get Transaction(): Table<Transaction> {
    return this.connector.table("Transaction", Transaction);
  }

  public get Task(): Table<Task> {
    return this.connector.table("Task", Task);
  }

  public get TaskComment(): Table<TaskComment> {
    return this.connector.table("TaskComment", TaskComment);
  }

  public get Employee(): Table<Employee> {
    return this.connector.table("Employee", Employee);
  }

  public get Customer(): Table<Customer> {
    return this.connector.table("Customer", Customer);
  }

  public get Supplier(): Table<Supplier> {
    return this.connector.table("Supplier", Supplier);
  }

  public get Document(): Table<Document> {
    return this.connector.table("Document", Document);
  }

  public get ActivityLog(): Table<ActivityLog> {
    return this.connector.table("ActivityLog", ActivityLog);
  }

  public get AIQuery(): Table<AIQuery> {
    return this.connector.table("AIQuery", AIQuery);
  }

  public get Notification(): Table<Notification> {
    return this.connector.table("Notification", Notification);
  }
}

export const dataService = new DataService();
