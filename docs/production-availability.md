# Production availability

The deployment being marked published does not confirm that the custom domain
works. Run `node scripts/check-production.mjs` after publishing and require a
successful exit. It verifies TLS trust and expiry on both names, HTTP-to-HTTPS
and www-to-apex redirects, actual HTML, frontend bundles, all six sale languages,
the calendar and anonymous brochure access protection. It never sends email or
creates a booking. Use `Accept: text/html` when testing pages: `/` otherwise
returns the lightweight health probe, which can conceal page failures.

GitHub Actions runs the same check hourly and on manual dispatch. Failures appear
in the repository's Actions tab; email delivery depends on the account's GitHub
notification preferences. Scheduled runs are not a guarantee of uninterrupted
service and can be delayed by GitHub.

## Hosting configuration repaired on 29 October 2026

- Infomaniak: apex and www A records point to `34.111.179.208`.
- Keep the Replit TXT verification records on both names.
- Remove the obsolete apex AAAA `2600:3c01::f03c:93ff:fe7d:5c4d`.
- Replit: disconnect and reconnect only the apex after correcting DNS if SSL
  issuance is stuck. Check DNS, routing and SSL issuance separately.
- Both custom names must present valid certificates before www redirects to apex.
- Preserve all mail records (MX, SPF, DKIM and DMARC).

The repair is a hosting change, not an application-code change. On this date the
apex certificate was reissued and the complete production check passed. The
available evidence does not establish the exact date the outage began.
