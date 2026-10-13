import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function getServerSession() {
  try {
    const headerList = await headers();
    const session = await auth.api.getSession({
      headers: headerList,
    });
    return session;
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }
  return session;
}
