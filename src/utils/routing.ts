/**
 * Parse route parameter (can be string or string array) to single string
 */
export function parseRouteParam(param: string | string[] | undefined): string {
  if (!param) return ""
  return Array.isArray(param) ? param[0] : param
}

/**
 * Parse multiple route parameters
 */
export function parseRouteParams<
  T extends Record<string, string | string[] | undefined>
>(params: T): Record<keyof T, string> {
  const result = {} as Record<keyof T, string>

  for (const key in params) {
    result[key] = parseRouteParam(params[key])
  }

  return result
}

/**
 * Build route path from segments
 */
export function buildRoutePath(...segments: (string | number)[]): string {
  return segments.filter(Boolean).join("/")
}
