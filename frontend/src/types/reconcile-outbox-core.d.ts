declare module "../../../scripts/reconcile-outbox-core.mjs" {
  export function isAuthorizedReconciliationRequest(request: Request, secret: string | undefined): boolean
  export function reconcileOutbox(input: { dc: unknown; sql: unknown; now?: () => Date }): Promise<{
    examined: number
    delivered: number
    failed: number
  }>
}
