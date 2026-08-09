export function retryDelaySeconds(attempts) {
  return Math.min(3600, 2 ** Math.min(attempts, 10))
}

export async function reconcileBatch(events, deliver, update, now = () => new Date()) {
  const summary = { examined: events.length, delivered: 0, failed: 0 }
  for (const event of events) {
    if (new Date(event.nextAttemptAt).getTime() > now().getTime()) continue
    try {
      await deliver(event)
      await update(event, {
        status: "DELIVERED",
        attempts: event.attempts + 1,
        nextAttemptAt: now().toISOString(),
        deliveredAt: now().toISOString(),
      })
      summary.delivered++
    } catch (error) {
      const attempts = event.attempts + 1
      await update(event, {
        status: "FAILED",
        attempts,
        nextAttemptAt: new Date(now().getTime() + retryDelaySeconds(attempts) * 1000).toISOString(),
        lastError: String(error).slice(0, 1000),
      })
      summary.failed++
    }
  }
  return summary
}
