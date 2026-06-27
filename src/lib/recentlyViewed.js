// src/lib/recentlyViewed.js

const PREFIX = 'resellhub_recently_viewed'
const MAX = 4

// build a per-identity key — guests and each logged-in user get separate buckets
function getKey(userId) {
  return `${PREFIX}_${userId || 'guest'}`
}

// save a product to recently viewed, scoped to current identity
export function saveRecentlyViewed(product, userId) {
  try {
    const key = getKey(userId)
    const stored = JSON.parse(localStorage.getItem(key) || '[]')
    const filtered = stored.filter(p => p._id !== product._id)
    const updated = [product, ...filtered].slice(0, MAX)
    localStorage.setItem(key, JSON.stringify(updated))
  } catch {}
}

// get recently viewed products, scoped to current identity
export function getRecentlyViewed(userId) {
  try {
    return JSON.parse(localStorage.getItem(getKey(userId)) || '[]')
  } catch {
    return []
  }
}