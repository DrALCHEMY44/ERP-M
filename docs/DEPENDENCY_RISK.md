# Production dependency risk register

Assessment date: 2026-08-11. `npm audit --omit=dev` reports three high and six moderate package findings. No automatic Next.js 16 or Firebase Admin downgrade is approved.

| Package | Severity | Runtime reachability | SmartERP AI feature | Available mitigation | Decision |
|---|---|---|---|---|---|
| `next` | High | Direct production framework; the reported risk is inherited from its PostCSS and Sharp dependencies | Every web/API route and image optimization | Review and regression-test Next 16.3+; meanwhile restrict image sources and never process user-supplied CSS | Accept temporarily: the registry offers only a breaking major upgrade |
| `postcss` | High | Build-time CSS processing through Next; no route accepts or compiles user CSS | Web styling/build | Upgrade with reviewed Next 16.3+; keep build inputs repository-controlled | Accept temporarily: attacker-controlled `sourceMappingURL` input is absent from the demonstrated deployment |
| `sharp` | High | Reachable through Next image optimization | Firebase-authenticated business logo display and framework images | Upgrade with reviewed Next 16.3+; keep remote image allowlist narrow and reject arbitrary image sources | Accept temporarily pending major-upgrade regression testing |
| `firebase-admin` | Moderate | Direct server dependency, but finding is inherited from its bundled Google Cloud Storage client | Firebase token verification, custom tokens and Data Connect admin access | Monitor upstream; isolate use to server-only trusted inputs; assess a supported Firebase Admin upgrade when available | Accept: suggested npm fix is a breaking downgrade to 10.3.0 and Firebase Storage is not used |
| `@google-cloud/storage` | Moderate | Installed transitively by Firebase Admin; SmartERP document paths do not invoke it | No active feature; documents use S3-compatible storage | Keep Firebase Storage code absent; upgrade through a supported Firebase Admin release | Accept: dormant in this application and suggested fix is the same breaking downgrade |
| `retry-request` | Moderate | Transitive only through unused Google Cloud Storage request paths | No active feature | Same as Google Cloud Storage; do not expose caller-controlled retry URLs | Accept as dormant transitive code |
| `teeny-request` | Moderate | Transitive only through Google API/storage libraries | No direct SmartERP feature | Upgrade through supported parent releases; keep requests on SDK-constructed Google endpoints | Accept pending parent-package fix |
| `gaxios` | Moderate | Transitive Google API transport; UUID advisory is inherited | Firebase/Google server SDK calls | Upgrade through a compatible Google/Firebase dependency refresh | Accept: application never invokes vulnerable UUID buffer APIs |
| `uuid` | Moderate | Transitive; affected v3/v5/v6 buffer-output API is not called by SmartERP code | No direct feature | Do not pass caller buffers to transitive UUID functions; upgrade through parent package | Accept: vulnerable API is not runtime-reachable from application inputs |

These are package-level findings, not nine independent exploitable paths. Re-run the audit before deployment and block release if reachability changes or a compatible patched version becomes available.
