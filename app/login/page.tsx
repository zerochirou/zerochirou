import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth_guard";
import { LoginForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Admin Login | Zerochirou",
  description: "Secure administrative login portal for managing Q&A submissions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const session = await getServerSession();

  // If already authenticated as admin, jump directly to dashboard
  if (session?.user && session.user.role === "admin") {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
