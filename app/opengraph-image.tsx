import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * The share card: the homepage composition — headline, ribbon and the two
 * bubbles — rendered once from the site's own fonts and ribbon geometry and
 * stored as og-card.jpg. Re-render it if the hero changes.
 */
export const alt = 'CloseAgain — The conversation isn’t over.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/jpeg'

export default async function OpengraphImage() {
  const image = await readFile(join(process.cwd(), 'app', 'og-card.jpg'))
  return new Response(new Uint8Array(image), {
    headers: { 'content-type': contentType, 'cache-control': 'public, max-age=86400, immutable' },
  })
}
