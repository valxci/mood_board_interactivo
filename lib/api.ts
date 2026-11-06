import type {
  ContentResponse,
  CreateSubmissionPayload,
  Palette,
  Reference,
  Submission,
} from "./types";

export const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ?? ""
).replace(/\/$/, "");

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function assetUrl(src: string): string {
  if (!src) {
    return src;
  }
  if (/^(https?:|data:|blob:)/.test(src)) {
    return src;
  }
  if (src.startsWith("/uploads/")) {
    return `${API_BASE}${src}`;
  }  return src;
}

type RequestOptions = RequestInit & { token?: string };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, body, ...rest } = options;
  const isFormData = body instanceof FormData;

  const response = await fetch(`${API_BASE}/api${path}`, {
    ...rest,
    body,
    cache: "no-store",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    let message = "No pudimos completar la solicitud.";
    try {
      const data = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(data.message)) {
        message = data.message.join(" ");
      } else if (data.message) {
        message = data.message;
      }
    } catch {
      // La respuesta no era JSON: usamos el mensaje genérico.
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getContent(): Promise<ContentResponse> {
  return request<ContentResponse>("/content");
}

export function createSubmission(
  payload: CreateSubmissionPayload,
): Promise<{ id: string }> {
  return request<{ id: string }>("/submissions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(password: string): Promise<{ token: string }> {
  return request<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export function getSubmissions(token: string): Promise<Submission[]> {
  return request<Submission[]>("/admin/submissions", { token });
}

export function saveSubmissionNotes(
  token: string,
  id: string,
  notes: string,
): Promise<Submission> {
  return request<Submission>(`/admin/submissions/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ notes }),
  });
}

export function deleteSubmission(
  token: string,
  id: string,
): Promise<{ ok: true }> {
  return request<{ ok: true }>(`/admin/submissions/${id}`, {
    method: "DELETE",
    token,
  });
}

export function getAdminReferences(token: string): Promise<Reference[]> {
  return request<Reference[]>("/admin/references", { token });
}

export function uploadReference(
  token: string,
  formData: FormData,
): Promise<Reference> {
  return request<Reference>("/admin/references", {
    method: "POST",
    token,
    body: formData,
  });
}

export function deleteReference(
  token: string,
  id: string,
): Promise<{ ok: true }> {
  return request<{ ok: true }>(`/admin/references/${id}`, {
    method: "DELETE",
    token,
  });
}

export function getAdminPalettes(token: string): Promise<Palette[]> {
  return request<Palette[]>("/admin/palettes", { token });
}

export function createPalette(
  token: string,
  payload: { family: string; name: string; colors: { name: string; hex: string }[] },
): Promise<Palette> {
  return request<Palette>("/admin/palettes", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function deletePalette(
  token: string,
  id: string,
): Promise<{ ok: true }> {
  return request<{ ok: true }>(`/admin/palettes/${id}`, {
    method: "DELETE",
    token,
  });
}
