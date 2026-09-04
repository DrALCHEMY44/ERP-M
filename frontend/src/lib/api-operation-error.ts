export class ApiOperationError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiOperationError"
    this.status = status
  }
}
