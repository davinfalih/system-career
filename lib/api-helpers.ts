import { getCurrentUser } from "@/lib/session";

export async function getSessionUser() {
  return getCurrentUser();
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
