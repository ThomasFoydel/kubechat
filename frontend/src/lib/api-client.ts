const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://kubechat.duckdns.org'

export async function apiClient(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}