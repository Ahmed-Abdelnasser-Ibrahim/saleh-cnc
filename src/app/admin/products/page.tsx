"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import { Plus, Search, Edit2, Trash2, X, Upload, Save } from "lucide-react";
import { Product } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/lib/toast-context";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { productSchema } from "@/lib/validations";

import Image from "next/image";

export default function AdminProductsPage() {
  const { isLoading: authLoading } = useAdminAuth();
  const { showToast, confirm } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    category: "ديكور",
    image: "/images/p-1.jpg",
    badge: "",
    description: ""
  });

  const fetchProducts = React.useCallback(async () => {
    try {
      const res = await fetch("/api/products", {
        headers: { "x-admin-auth": "true" }
      });
      const data = await res.json();
      setProducts(data || []);
    } catch {
      showToast("خطأ في تحميل المنتجات", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!authLoading) {
      Promise.resolve().then(() => fetchProducts());
    }
  }, [authLoading, fetchProducts]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({ name: "", price: 0, category: "ديكور", image: "/images/p-1.jpg", badge: "", description: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      badge: product.badge || "",
      description: product.description || ""
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
        showToast("تم رفع الصورة بنجاح", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const validation = productSchema.safeParse(formData);
    if (!validation.success) {
      showToast(validation.error.issues[0].message, "error");
      return;
    }

    try {
      if (editingProduct) {
        const res = await fetch("/api/products", {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "x-admin-auth": "true"
          },
          body: JSON.stringify({ ...validation.data, id: editingProduct.id }),
        });
        if (res.ok) showToast("تم تحديث المنتج بنجاح", "success");
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-admin-auth": "true"
          },
          body: JSON.stringify(validation.data),
        });
        if (res.ok) showToast("تم إضافة المنتج بنجاح", "success");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch {
      showToast("فشلت العملية", "error");
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-auth": "true"
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        showToast("تم حذف المنتج بنجاح", "success");
        fetchProducts();
      } else {
        const errData = await res.json();
        showToast(errData.error || "فشل الحذف", "error");
      }
    } catch {
      showToast("فشل الحذف - تأكد من اتصالك", "error");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Conditional rendering AFTER all hooks
  if (authLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-bold">جاري التحقق...</div>;

  return (
    <div className="flex min-h-screen bg-[#050505]">
      <AdminSidebar />
      
      <main className="flex-1 p-4 sm:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">إدارة المنتجات</h1>
            <p className="text-gray-400">تحكم في كتالوج المنتجات الخاص بك، أضف، عدل، أو احذف.</p>
          </div>
          <button 
            onClick={handleOpenAdd}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
          >
            <Plus size={20} />
            إضافة منتج جديد
          </button>
        </header>

        {/* Products Table */}
        <div className="bg-slate-900 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-white/[0.02]">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-12 pl-4 outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="text-gray-500 text-sm bg-white/[0.01]">
                  <th className="p-6 font-medium">المنتج</th>
                  <th className="p-6 font-medium">التصنيف</th>
                  <th className="p-6 font-medium">السعر</th>
                  <th className="p-6 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-20 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                        جاري تحميل المنتجات...
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length > 0 ? (
                  <AnimatePresence>
                    {filteredProducts.map((p) => (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/10">
                              <Image src={p.image} alt={p.name} fill className="object-cover" />
                            </div>
                            <span className="font-bold text-white group-hover:text-amber-500 transition-colors">{p.name}</span>
                          </div>
                        </td>
                        <td className="p-6 text-gray-400">{p.category}</td>
                        <td className="p-6 font-bold text-white">{p.price} ج.م</td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={async () => {
                                const confirmed = await confirm({
                                  title: "حذف المنتج",
                                  message: `هل أنت متأكد من حذف المنتج "${p.name}"؟ لا يمكن التراجع عن هذا الإجراء.`,
                                  confirmText: "نعم، حذف المنتج",
                                  cancelText: "إلغاء",
                                  type: "danger"
                                });
                                if (confirmed) handleDelete(p.id);
                              }}
                              className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                ) : (
                  <tr>
                    <td colSpan={4} className="p-20 text-center text-gray-500">
                      لم يتم العثور على أي منتجات.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal (Add/Edit) */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-slate-900 border border-white/10 rounded-[32px] w-full max-w-lg overflow-y-auto max-h-[90vh] shadow-2xl no-scrollbar"
              >
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <h2 className="text-2xl font-bold">{editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">اسم المنتج</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">وصف المنتج</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-amber-500 resize-none"
                      placeholder="أدخل وصف المنتج هنا..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">السعر (ج.م)</label>
                      <input 
                        type="number" 
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">التصنيف</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-amber-500"
                      >
                        <option>ديكور</option>
                        <option>ساعات</option>
                        <option>هدايا</option>
                        <option>إضاءة</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">صورة المنتج</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-amber-500/50 transition-colors bg-white/5">
                        {formData.image ? (
                          <div className="flex flex-col items-center">
                            <Image src={formData.image} alt="Preview" width={80} height={80} className="w-20 h-20 object-cover rounded-xl mb-2" unoptimized />
                            <span className="text-xs text-amber-500">تم اختيار صورة ✅</span>
                          </div>
                        ) : (
                          <>
                            <Upload size={32} className="mx-auto mb-2 text-gray-500 group-hover:text-amber-500 transition-colors" />
                            <p className="text-sm text-gray-500">اضغط لرفع صورة من جهازك</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {editingProduct ? "تحديث التغييرات" : "حفظ المنتج الجديد"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
