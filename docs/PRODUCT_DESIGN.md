# Product interface standards

SmartERP is a working tool for business owners, employees and platform operators.
The interface should help them read records, make decisions and complete tasks.

## Shared visual language

- Neutral canvas, white surfaces, slate text and one blue action color. Reserve
  red, amber and green for meaningful states; always pair state colors with text.
- Plain wordmark. Do not restore the removed square building logo.
- Use the shared web card/button components and Flutter AppTheme. Cards have
  light borders and 12px corners; controls use 8–10px corners. Avoid glows,
  decorative gradients and stacks of elevated panels.
- Use sentence-case labels. Web body text is 14–16px, secondary information at
  least 12px, section titles 16–20px, page titles 24–30px. Use semibold sparingly.
- Use 4px spacing increments: 12px between related controls, 16–24px within
  sections and 24–32px between sections.

## Page hierarchy

- Business dashboard: greeting and actions, headline metrics, sales/activity,
  then secondary operational metrics. Explain the reporting period and units.
- SaaS administration: page heading and actions, platform metrics, then tabs
  and records. Reuse the application shell; do not nest padded page shells.
- Mobile: respect safe areas, preserve 48px touch targets and use intrinsic-height
  metric cards. The mobile MetricGrid is shared by business and platform views.
- Use real loading, unavailable and empty states. Never imply synchronization
  with a permanent status badge, or show a failed fetch as a real zero.

## Interaction and accessibility

- Keep permissions and tenant isolation independent of presentation. Retain
  employee/manager team-code sign-in alongside account sign-in.
- Provide visible keyboard focus, descriptive action labels and readable errors
  with a separate retry action. Keep critical actions out of hover-only controls.
- Verify at phone, tablet and desktop widths, with larger text and both Flutter
  themes. Tables may scroll within their container; pages should not overflow.
- Use these standards for future screens instead of introducing new card,
  heading or navigation styles on each page.
