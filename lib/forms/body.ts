/**
 * Reads a request body as text, but never more than `limit` bytes of it.
 *
 * A declared Content-Length can be missing or wrong (chunked uploads), so the
 * cap is enforced on the bytes actually received: reading stops, and the
 * stream is cancelled, as soon as the body grows past the limit.
 */
export async function readTextWithin(
  body: ReadableStream<Uint8Array> | null,
  limit: number,
): Promise<string | null> {
  if (!body) return ''
  const reader = body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > limit) {
      await reader.cancel().catch(() => undefined)
      return null
    }
    chunks.push(value)
  }
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(bytes)
}
