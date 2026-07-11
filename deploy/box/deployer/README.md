# deployer — atcr webhook → pull & restart

Tiny zero-dependency Node service. Receives atcr's **Image push** webhook, verifies the
`X-Webhook-Signature-256` HMAC, and runs `docker compose pull pds && up -d pds` on the box.
Replaces Watchtower polling with event-driven deploys.

## Install on the bag box
1. Copy this directory onto the box (e.g. `/pds/deployer`).
2. Add the `deployer` service from `../compose.snippet.yaml` to `/pds/compose.yaml`.
3. Add the Caddy route from `../Caddyfile.snippet`.
4. Set `ATCR_WEBHOOK_SECRET` in the box's environment (same value as atcr's Webhooks panel).
5. `docker compose -f /pds/compose.yaml up -d --build deployer`
6. Health check: `curl -fsS http://localhost:8787/healthz` (from inside the compose net) or hit
   `https://admin.laugh.town/hooks/atcr` with a bad body → expect `401`.

## Environment
| Var | Default | Purpose |
|-----|---------|---------|
| `ATCR_WEBHOOK_SECRET` | — (required) | HMAC signing secret; must match atcr |
| `COMPOSE_FILE` | `/pds/compose.yaml` | compose file the deploy acts on |
| `DEPLOY_SERVICE` | `pds` | service to pull & recreate |
| `DEPLOY_TAG` | `latest` | only pushes of this tag deploy |
| `PORT` | `8787` | listen port (internal) |

## ⚠️ Verify the payload filter before trusting it
The tag filter in `server.js` (the `FILTER` comment) uses best-effort field names for atcr's
payload. Point the webhook at a request bin, push one image, capture the real JSON, and confirm
`event`/`tag`/`repository`. If the tag filter is wrong, **every `:sha-*` build restarts the PDS.**

## Security
Mounts the Docker socket (root-equivalent on the host). Mitigations: not published to the host
(only Caddy reaches it), every request HMAC-verified, 1 MB body cap, `/pds` mounted read-only.
Keep the signing secret strong and rotate it if the box is ever compromised.
