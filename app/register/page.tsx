import Link from "next/link";
import { Briefcase } from "lucide-react";
import { PublicFooter } from "@/components/layout/public-footer";
import { RegisterForm } from "@/components/auth/register-form";
import { apiFetch } from "@/lib/api";

export const metadata = { title: "Daftar" };

export default async function RegisterPage() {
  const { data } = await apiFetch("/meta/institutions");
  const institutions = data.institutions;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-100 bg-white/80 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold">
              Career<span className="text-gradient">System</span>
            </span>
          </Link>
          <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-brand-700">
            Kembali ke Beranda
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-10">
        <div className="w-full max-w-lg animate-fade-up">
          <div className="card p-8">
            <h1 className="text-2xl font-extrabold">Buat Akun Baru</h1>
            <p className="mt-2 text-sm text-zinc-500">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
                Masuk di sini
              </Link>
            </p>
            <RegisterForm institutions={institutions} />
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
