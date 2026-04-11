import { redirect } from "next/navigation";
import { loginAdmin } from "@/lib/auth";

async function loginAction(formData: FormData) {
  "use server";
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  if (!email || !password) {
    redirect("/admin/login?error=missing");
  }
  const user = await loginAdmin(email, password);
  if (!user) {
    redirect("/admin/login?error=invalid");
  }
  redirect("/admin");
}

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const errorMsg =
    error === "invalid"
      ? "Invalid email or password."
      : error === "missing"
        ? "Please fill in both fields."
        : null;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="relative w-full max-w-sm rounded-[var(--radius-card)] border border-border bg-surface p-8">
        <div
          aria-hidden
          className="absolute -top-14 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full blur-2xl opacity-70 bg-gradient-to-br from-aurora-1 via-aurora-2 to-aurora-3"
        />
        <div className="relative">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-center">
            Admin sign in
          </h1>
          <p className="mt-2 text-sm text-foreground-muted text-center">
            TopLink inquiry & content console
          </p>
          <form action={loginAction} className="mt-6 space-y-3">
            <div>
              <label className="block text-xs font-medium text-foreground-muted">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground-muted">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-brand focus:outline-none"
              />
            </div>
            {errorMsg && (
              <p className="text-sm text-[color:var(--danger)]">{errorMsg}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
