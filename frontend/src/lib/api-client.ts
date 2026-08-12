const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://kubechat.duckdns.org'

export interface ApiValidationError {
  field: string
  message: string
}

interface ApiErrorResponse {
  message?: string
  errors?: ApiValidationError[]
}

export class ApiError extends Error {
  public readonly status: number
  public readonly errors: ApiValidationError[]

  constructor(
    status: number,
    message: string,
    errors: ApiValidationError[] = []
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

async function parseErrorResponse(
  response: Response
): Promise<ApiErrorResponse> {
  const text = await response.text()

  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text) as ApiErrorResponse
  } catch {
    return {}
  }
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }
  )

  if (!response.ok) {
    const body = await parseErrorResponse(response)

    throw new ApiError(
      response.status,
      body.message ??
        `API error: ${response.status}`,
      body.errors ?? []
    )
  }

  return response.json() as Promise<T>
}