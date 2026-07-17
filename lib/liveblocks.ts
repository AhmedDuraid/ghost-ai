import { Liveblocks } from "@liveblocks/node"

const CURSOR_COLOR_PALETTE = [
  "#52A8FF",
  "#BF7AF0",
  "#FF990A",
  "#FF6166",
  "#F75F8F",
  "#62C073",
  "#0AC7B4",
  "#00C8D4",
] as const

declare global {
  // eslint-disable-next-line no-var
  var __ghostLiveblocks__: Liveblocks | undefined
}

function hashString(value: string) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }

  return hash
}

export function getCursorColorForUserId(userId: string) {
  const colorIndex = hashString(userId) % CURSOR_COLOR_PALETTE.length

  return CURSOR_COLOR_PALETTE[colorIndex]
}

function createLiveblocksClient() {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY

  if (!secret) {
    throw new Error("LIVEBLOCKS_SECRET_KEY is required")
  }

  return new Liveblocks({
    secret,
  })
}

export function getLiveblocksClient() {
  if (globalThis.__ghostLiveblocks__) {
    return globalThis.__ghostLiveblocks__
  }

  const client = createLiveblocksClient()

  if (process.env.NODE_ENV !== "production") {
    globalThis.__ghostLiveblocks__ = client
  }

  return client
}
