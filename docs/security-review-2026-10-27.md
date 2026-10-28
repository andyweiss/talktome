# Security review — 2026-10-27

Reviewed the default branch at `a09056a`: one Dependabot advisory and 84 open
CodeQL alerts. Alert numbers below refer to
[this repository's code-scanning results](https://github.com/thepoison606/talktome/security/code-scanning).
Scanner severity is the rule's general severity; the assessments below consider
the actual callers, validation and deployment context.

Verification continued on 2026-10-28. The UUID update removes the moderate
advisory. A new low-severity `deepmerge` advisory is now reported by npm (nine
package findings from the same underlying advisory); it is separate from UUID
and is not addressed by this change.

## Dependency advisory

Dependabot #71 concerns `uuid` buffer bounds in the `v3`, `v5` and `v6` APIs.
The dependency comes from the mobile Xcode project tooling; the legacy `xcode`
package calls `v4()` without an output buffer. The affected functions are not
used on that path. Updating is still worthwhile: the override selects patched
UUID 11.x, which preserves CommonJS support. A compatibility test exercises the
actual Xcode project-ID generator. See
[GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq).

## Code-scanning assessment

| Alerts | Count | Assessment | Action |
| --- | ---: | --- | --- |
| #84 — Bridge TLS verification | 1 | **Real security issue, highest priority.** The shared Rust HTTP client accepts every certificate, including for remote servers, and sends bearer credentials. | Implement normal certificate validation plus explicit trust/pinning for self-hosted certificates. Do this as a focused Bridge change: removing the bypass alone would break existing self-signed deployments. |
| #78 — Bridge credential storage | 1 | **Real security issue.** The API key is persisted in WebView `localStorage`; the Bridge token uses the same storage even though the scanner highlights only the API key. | Move both credentials into the platform credential store and migrate existing entries. Keep ordinary server/name preferences in local storage. |
| #67–69 — Credentials in query parameters | 3 | **Real credential-exposure risk.** Legacy query authentication can place keys in proxy/access logs. The Bridge browser SSE fallback constructs such a URL. | Migrate clients to bearer headers or Socket.IO auth payloads, then retire query-key authentication with a compatibility transition. Native Bridge requests already use bearer headers. |
| #5–65 — Missing rate limiting | 61 | **Shared hardening gap, not 61 separate authentication bypasses.** There is no application-level limiter. The findings cover static/file reads, authenticated administrative operations and credential checks, which have different exposure and cost. | Prioritize failed logins/credential checks, expensive writes and command dispatch. Design limits around trusted proxy handling, shared NATs and legitimate intercom traffic; a blanket low per-IP cap could interrupt normal operation. |
| #83 — Public `node_modules` | 1 | **Unnecessary information exposure.** The entire dependency directory was served publicly. | **Fixed:** remove the static mount. Browser bundles retain their explicit public URLs; update the debug page and verify dependency paths return 404. |
| #1 — Hostname regexp | 1 | **Valid performance-hardening finding.** The trailing-dot regexp can backtrack on long dot runs followed by another character. Exploitability depends on access to hostname configuration. | **Fixed:** replace it with a linear trailing-dot scan and test long inputs. |
| #70–72 — Log format strings | 3 | **Diagnostic integrity issue.** In Node.js this is not native printf memory corruption, but percent directives in interpolated values can alter formatting of additional arguments. | **Fixed:** use constant format strings and separate arguments. Request fallback logs also omit query strings to reduce accidental credential logging. |
| #73–75 — DOM text reused as HTML | 3 | **No exploitable path established in the reviewed renderers.** Names pass through `escapeHtml`; target types are SQL literals and IDs come from integer DB columns. Inline event-handler interpolation is nevertheless brittle. | Prefer DOM creation and event listeners in a future UI hardening change. Keep these findings open until a focused data-flow/regression review confirms dismissal or replaces those sinks. |
| #76–77 — SQL injection | 2 | **False positives in these functions.** `bridgeEndpointTable()` first rejects every kind except the literal strings `user` and `feed`; that same validated kind is used in the column name. Actual values use bound parameters. | Keep the allowlist and parameter binding. Documented dismissal is appropriate; no SQL rewrite is needed for security. |
| #79 — Clear-text SSO logging | 1 | **False positive for credential disclosure.** The message prints a configured header *name* and proxy allowlist, not the header's value or a password/token. | No credential-handling change required. Treat these as ordinary deployment metadata in logs. |
| #80–82 — TLS checks in local probes | 3 | **Intentional, narrowly scoped exception.** All three calls target hard-coded `127.0.0.1`, carry no credentials and probe a local self-signed server for health/static-asset checks. | Retain the loopback restriction and bounded requests. Do not copy these options into external/authenticated clients. Documented exception/dismissal is reasonable. |
| #66 — HTML filter regexp | 1 | **False positive.** This is an assertion in `tests/mediaStatus.test.js`, not an HTML sanitizer. | No production change required. |
| #3–4 — User-controlled timer duration | 2 | **Duration is already bounded.** `parseCompanionWaitMs()` clamps to 100–10,000 ms before these timers are created. | No unbounded-duration bug demonstrated. Clearing the losing timeout when a command resolves would be useful resource hygiene; concurrent-request control belongs with the rate-limiting work. |
| #2 — Insufficient password hashing | 1 | **False positive.** This hashes a `ttm_bridge_` token generated from 32 cryptographically random bytes, not a human password. | SHA-256 and timing-safe comparison are suitable for these high-entropy tokens. Do not replace this with bcrypt merely to satisfy the password rule. |

## Recommended next changes

1. Bridge TLS trust/pinning, preserving usable self-signed local connections.
2. Bridge credential-store migration for both API keys and Bridge tokens.
3. Authentication/expensive-operation rate limits, plus migration away from
   query credentials.
4. DOM-based construction of the three flagged Admin lists and cancellation
   of command-wait timers after early completion.

These remaining items are intentionally reported as open work. This review
does not dismiss alerts or change CodeQL exclusions. The five small server
findings addressed here should be checked against the next CodeQL analysis;
the other findings remain visible for an explicit remediation or dismissal.
