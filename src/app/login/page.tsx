"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useToast } from "@/lib/toast-context";
import { loginSchema } from "@/lib/validations";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = loginSchema.safeParse({ username, password });
    if (!validation.success) {
      showToast(validation.error.issues[0].message, "error");
      return;
    }

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      showToast("تم تسجيل الدخول بنجاح", "success");
      router.push("/admin");
    } else {
      showToast("بيانات الدخول غير صحيحة", "error");
    }
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem("isAdmin") === "true") {
      router.replace("/admin");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass p-8 md:p-10 rounded-3xl shadow-2xl border border-white/10">
          <div className="text-center mb-10">
            <Link href="/" className="text-3xl font-bold flex items-center justify-center gap-2 mb-4">
              <span className="text-amber-500">صالح</span>
              <span className="text-white">CNC</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
            <p className="text-gray-400 mt-2">يرجى تسجيل الدخول للمتابعة</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 mr-2">اسم المستخدم</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pr-12 pl-4 outline-none focus:border-amber-500 transition-colors"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 mr-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pr-12 pl-4 outline-none focus:border-amber-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
            >
              تسجيل الدخول
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm">
              العودة للمتجر
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
