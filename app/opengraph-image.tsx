import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { shareCard } from '@/lib/share'

/**
 * The share card: the homepage composition — headline, the red arrow, the
 * one-line promise and the product beats beside it — captured from the hero itself at
 * 1200×630 and stored as og-card.jpg. Re-capture it if the hero changes.
 */
export const alt = shareCard.alt
export const size = { width: shareCard.size.width, height: shareCard.size.height }
export const contentType = 'image/jpeg'

export default async function OpengraphImage() {
  const image = await readFile(join(process.cwd(), 'app', 'og-card.jpg'))
  return new Response(new Uint8Array(image), {
    headers: { 'content-type': contentType, 'cache-control': 'public, max-age=86400, immutable' },
  })
}
