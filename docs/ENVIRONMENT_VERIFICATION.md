# Local environment verification

Verification date: 2026-08-11.

| Check | Result | Evidence/limitation |
|---|---|---|
| Java 21 | PASS | Workspace-local Eclipse Temurin `21.0.12+8` at `.tools/jdk21`; existing system Java was not changed |
| Firebase CLI | PASS | `firebase-tools` 15.26.0 explicitly targeted local-only `demo-smarterp-ai-defence-local` |
| Firestore rules parse/startup | PASS | Standard Firestore emulator loaded `backend/firestore.rules`, ran the verification command and exited 0 |
| Firestore behavioral assertions | NOT RUN | No rules-unit-test fixture exists; startup proves syntax/loading, not all allow/deny cases |
| Official Flutter stable | IN PROGRESS | Authorized workspace-local 3.44.4 archive; system Snap package remains untouched |
| ESLint | PASS with warnings | 0 errors, 80 warnings: 79 cosmetic and 1 maintenance/performance |
| Production dependency audit | REVIEWED | 3 high and 6 moderate; see `DEPENDENCY_RISK.md` |

The local Java and emulator archives live under ignored `.tools/` paths and are
not part of the checkpoint. Repeat Firebase verification with:

```bash
FIREBASE_EMULATORS_PATH="$PWD/.tools/firebase-emulators" \
JAVA_HOME="$PWD/.tools/jdk21" \
PATH="$PWD/.tools/jdk21/bin:$PATH" \
npx -y firebase-tools@latest emulators:exec \
  --only firestore \
  --project demo-smarterp-ai-defence-local \
  --config backend/firebase.json \
  "node -e 'console.log(\"rules-command-ran\")'"
```
