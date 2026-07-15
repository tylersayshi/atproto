import { Router } from 'express'
import { sql } from 'kysely'
import { AppContext } from './context.js'

export const createRouter = (ctx: AppContext): Router => {
  const router = Router()

  router.get('/', function (req, res) {
    res.type('text/plain')
    res.send(`
 _                   _       _
| | __ _ _   _  __ _| |__   | |_ _____      ___ __
| |/ _\` | | | |/ _\` | '_ \\  | __/ _ \\ \\ /\\ / / '_ \\
| | (_| | |_| | (_| | | | | | || (_) \\ V  V /| | | |
|_|\\__,_|\\__,_|\\__, |_| |_|  \\__\\___/ \\_/\\_/ |_| |_|
               |___/

a place for your comedy stuff on the internet

This is an AT Protocol Personal Data Server (aka, an atproto PDS)

Most API routes are under /xrpc/

      Home: https://laugh.town
      Code: https://github.com/bluesky-social/atproto
 Self-Host: https://github.com/bluesky-social/pds
  Protocol: https://atproto.com
`)
  })

  router.get('/robots.txt', function (req, res) {
    res.type('text/plain')
    res.send(
      '# Hello!\n\n# Crawling the public API is allowed\nUser-agent: *\nAllow: /',
    )
  })

  router.get('/xrpc/_health', async function (req, res) {
    const { version } = ctx.cfg.service
    try {
      await sql`select 1`.execute(ctx.accountManager.db.db)
    } catch (err) {
      req.log.error({ err }, 'failed health check')
      res.status(503).send({ version, error: 'Service Unavailable' })
      return
    }
    res.send({ version })
  })

  return router
}
