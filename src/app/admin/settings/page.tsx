"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import { Save, Globe, Phone, Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/lib/toast-context";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { settingsSchema } from "@/lib/validations";

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

export default function AdminSettingsPage() {
  const { isLoading: authLoading } = useAdminAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "صالح CNC",
    whatsapp: "01068256479",
    email: "info@saleh-cnc.com",
    facebook: "#",
    instagram: "#",
    address: "القاهرة، مصر"
  });

  const fetchSettings = React.useCallback(async () => {
    try {
      const res = await fetch("/api/settings", {
        headers: { "x-admin-auth": "true" }
      });
      const data = await res.json();
      if (data) setSettings(data);
    } catch {
      showToast("خطأ في تحميل الإعدادات", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!authLoading) {
      Promise.resolve().then(() => fetchSettings());
    }
  }, [authLoading, fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const validation = settingsSchema.safeParse(settings);
    if (!validation.success) {
      showToast(validation.error.issues[0].message, "error");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-auth": "true"
        },
        body: JSON.stringify(validation.data),
      });
      if (res.ok) {
        showToast("تم حفظ الإعدادات بنجاح", "success");
      }
    } catch {
      showToast("فشل حفظ الإعدادات", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Conditional rendering AFTER all hooks
  if (authLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-bold">جاري التحقق...</div>;

  return (
    <div className="flex min-h-screen bg-[#050505]">
      <AdminSidebar />
      
      <main className="flex-1 p-4 sm:p-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-2 text-white">إعدادات الموقع</h1>
          <p className="text-gray-400">تحكم في المعلومات الأساسية وروابط التواصل للمتجر.</p>
        </header>

        <div className="max-w-4xl">
          <form onSubmit={handleSave} className="space-y-8">
            {/* General Settings */}
            <div className="bg-slate-900 rounded-2xl sm:rounded-[32px] border border-white/5 p-4 sm:p-8 shadow-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Globe size={20} className="text-amber-500" />
                المعلومات الأساسية
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">اسم المتجر</label>
                  <input 
                    type="text" 
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">العنوان</label>
                  <input 
                    type="text" 
                    value={settings.address}
                    onChange={(e) => setSettings({...settings, address: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact Settings */}
            <div className="bg-slate-900 rounded-2xl sm:rounded-[32px] border border-white/5 p-4 sm:p-8 shadow-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare size={20} className="text-amber-500" />
                روابط التواصل
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 flex items-center gap-2"><Phone size={14} /> رقم الواتساب</label>
                  <input 
                    type="text" 
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({...settings, whatsapp: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 flex items-center gap-2"><Mail size={14} /> البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 flex items-center gap-2"><FacebookIcon /> فيسبوك</label>
                  <input 
                    type="text" 
                    value={settings.facebook}
                    onChange={(e) => setSettings({...settings, facebook: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 flex items-center gap-2"><InstagramIcon /> إنستغرام</label>
                  <input 
                    type="text" 
                    value={settings.instagram}
                    onChange={(e) => setSettings({...settings, instagram: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={isLoading || isSaving}
                className={`bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 px-12 rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-amber-500/20 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                {isSaving ? "جاري الحفظ..." : "حفظ كافة التغييرات"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
