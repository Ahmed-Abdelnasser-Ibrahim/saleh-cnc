"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import { Search, Eye, Trash2, CheckCircle, Clock, X, Phone, User, MapPin, Package, FileSpreadsheet, ShoppingBag, CreditCard, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/lib/toast-context";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import Image from "next/image";
import { paymentConfig } from "@/config/payment";

import { Order } from "@/lib/data";

interface OrderWithPayment extends Order {
  paymentMethod: string;
  paymentProof?: string;
}

export default function AdminOrdersPage() {
  const { isLoading: authLoading } = useAdminAuth();
  const [orders, setOrders] = useState<OrderWithPayment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderWithPayment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast, confirm } = useToast();

  const fetchOrders = React.useCallback(async () => {
    try {
      const res = await fetch("/api/orders", {
        headers: { "x-admin-auth": "true" }
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      showToast("خطأ في تحميل الطلبات", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-auth": "true"
        },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        showToast(`تم تحديث حالة الطلب إلى ${status === 'paid' ? 'تم الدفع' : status}`, "success");
        fetchOrders();
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ 
            ...selectedOrder, 
            status: status as "pending" | "completed" | "cancelled" | "paid" | "pending_confirmation" 
          });
        }
      }
    } catch {
      showToast("فشل تحديث الطلب", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-auth": "true"
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        showToast("تم حذف الطلب بنجاح", "success");
        fetchOrders();
      }
    } catch {
      showToast("فشل حذف الطلب", "error");
    }
  };

  useEffect(() => {
    if (!authLoading) {
      Promise.resolve().then(() => fetchOrders());
    }
  }, [authLoading, fetchOrders]);

  const exportToPowerBI = () => {
    if (orders.length === 0) {
      showToast("لا توجد بيانات للتصدير", "info");
      return;
    }
    const headers = ["OrderID", "CustomerName", "Phone", "ItemCount", "TotalAmount", "Status", "PaymentMethod", "OrderDate", "Address", "City"];
    const rows = orders.map(o => [
      o.id, 
      `"${o.customer}"`, 
      `'${o.phone}`, 
      Array.isArray(o.items) ? o.items.length : 0, 
      o.total, 
      o.status, 
      o.paymentMethod,
      o.date, 
      `"${o.address}"`, 
      `"${o.city}"`
    ]);
    
    const csvContent = "\ufeff" + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `saleh_cnc_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("تم تصدير تقرير الطلبات بنجاح", "success");
  };

  const filteredOrders = orders.filter(o => 
    o.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.id && o.id.toLowerCase().includes(searchTerm.toLowerCase())) || 
    o.phone.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "pending_confirmation":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "paid":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "قيد الانتظار";
      case "pending_confirmation": return "في انتظار تأكيد الدفع";
      case "paid": return "تم الدفع";
      case "completed": return "تم التوصيل";
      case "cancelled": return "ملغي";
      default: return status;
    }
  };

  const sendWhatsAppConfirmation = (order: OrderWithPayment, type: 'accept' | 'reject') => {
    const message = type === 'accept' 
      ? `تم تأكيد استلام الدفع للطلب رقم ${order.id} بنجاح ✅. جاري تجهيز طلبك الآن.`
      : `نعتذر، لم نتمكن من تأكيد الدفع للطلب رقم ${order.id} ❌. يرجى مراجعة التحويل أو التواصل معنا.`;
    
    const whatsappUrl = `https://wa.me/${order.phone.startsWith('0') ? '2' + order.phone : order.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (authLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-bold">جاري التحقق...</div>;

  return (
    <div className="flex min-h-screen bg-[#050505]">
      <AdminSidebar />
      
      <main className="flex-1 p-4 sm:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white text-right">إدارة الطلبات والدفع</h1>
            <p className="text-gray-400 text-right">تتبع الطلبات، مراجعة التحويلات (فودافون/إنستا باي)، وإدارة الحالات.</p>
          </div>
          <button 
            onClick={exportToPowerBI}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 self-end"
          >
            <FileSpreadsheet size={20} />
            تصدير البيانات
          </button>
        </header>

        <div className="bg-slate-900 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-white/[0.02]">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="ابحث بالاسم، الرقم، أو الكود..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-12 pl-4 outline-none focus:border-amber-500 transition-colors text-right text-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="text-gray-500 text-sm bg-white/[0.01]">
                  <th className="p-6 font-medium">الطلب</th>
                  <th className="p-6 font-medium">العميل</th>
                  <th className="p-6 font-medium">الدفع</th>
                  <th className="p-6 font-medium">الإجمالي</th>
                  <th className="p-6 font-medium">الحالة</th>
                  <th className="p-6 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                   <tr>
                     <td colSpan={6} className="p-10 text-center text-gray-500">جاري تحميل البيانات...</td>
                   </tr>
                ) : filteredOrders.length > 0 ? (
                  <AnimatePresence>
                    {filteredOrders.map((order) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="p-6 font-bold text-amber-500">{order.id?.slice(-6) || "---"}</td>
                        <td className="p-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-white">{order.customer}</span>
                            <span className="text-xs text-gray-500">{order.phone}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-col">
                            <span className={`text-xs font-bold uppercase ${order.paymentMethod === 'cod' ? 'text-gray-400' : 'text-amber-500'}`}>
                              {order.paymentMethod === 'cod' ? 'عند الاستلام' : order.paymentMethod === 'vodafone' ? 'فودافون كاش' : 'إنستا باي'}
                            </span>
                            {order.paymentProof && <span className="text-[10px] text-emerald-500 flex items-center gap-1"><CheckCircle size={10} /> يوجد إثبات</span>}
                          </div>
                        </td>
                        <td className="p-6 font-bold text-white">{order.total} ج.م</td>
                        <td className="p-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(order.status)}`}>
                             {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={async () => {
                                const confirmed = await confirm({
                                  title: "حذف الطلب",
                                  message: `هل أنت متأكد من حذف الطلب؟ هذا الإجراء لا يمكن التراجع عنه.`,
                                  confirmText: "نعم، حذف",
                                  cancelText: "إلغاء",
                                  type: "danger"
                                });
                                if (confirmed && order.id) handleDelete(order.id);
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
                    <td colSpan={6} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-gray-600">
                        <ShoppingBag size={48} />
                        <p className="text-xl font-bold">لا توجد طلبات مطابقة</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Order Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedOrder(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-slate-900 border border-white/10 rounded-[32px] w-full max-w-4xl overflow-y-auto max-h-[90vh] shadow-2xl no-scrollbar"
              >
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02] sticky top-0 backdrop-blur-xl z-10">
                  <div className="flex items-center gap-3">
                    <Package className="text-amber-500" />
                    <h2 className="text-2xl font-bold text-white">تفاصيل الطلب</h2>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/5 rounded-full text-white">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-8 grid md:grid-cols-2 gap-8">
                   {/* Column 1: Info */}
                   <div className="space-y-8">
                      <section className="space-y-4">
                        <h4 className="text-amber-500 font-bold text-sm uppercase tracking-widest text-right">بيانات العميل</h4>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4 text-right">
                           <div className="flex items-center justify-end gap-3 text-gray-300">
                              <span>{selectedOrder.customer}</span>
                              <User size={18} className="text-gray-500" />
                           </div>
                           <div className="flex items-center justify-end gap-3 text-gray-300">
                              <span dir="ltr">{selectedOrder.phone}</span>
                              <Phone size={18} className="text-gray-500" />
                           </div>
                           <div className="flex items-center justify-end gap-3 text-gray-300">
                              <span>{selectedOrder.address}, {selectedOrder.city}</span>
                              <MapPin size={18} className="text-gray-500" />
                           </div>
                        </div>
                      </section>

                      <section className="space-y-4">
                        <h4 className="text-amber-500 font-bold text-sm uppercase tracking-widest text-right">المنتجات المطلوب</h4>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                           {selectedOrder.items.map((item, idx) => (
                             <div key={idx} className="flex items-center justify-between gap-4">
                               <span className="text-white font-bold">{item.price * item.quantity} ج.م</span>
                               <div className="text-right">
                                 <p className="text-white text-sm font-bold">{item.name}</p>
                                 <p className="text-gray-500 text-xs">الكمية: {item.quantity}</p>
                               </div>
                             </div>
                           ))}
                           <div className="h-px bg-white/10 my-2" />
                           <div className="flex justify-between items-center text-xl font-black text-amber-500">
                             <span>{selectedOrder.total} ج.م</span>
                             <span className="text-white text-sm font-normal">الإجمالي</span>
                           </div>
                        </div>
                      </section>
                   </div>

                   {/* Column 2: Payment Proof */}
                   <div className="space-y-8">
                      <section className="space-y-4">
                        <h4 className="text-amber-500 font-bold text-sm uppercase tracking-widest text-right">إثبات الدفع</h4>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center min-h-[300px]">
                           {selectedOrder.paymentMethod === 'cod' ? (
                             <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                   <ShoppingBag className="text-gray-500" size={32} />
                                </div>
                                <p className="text-gray-400 font-bold">الدفع عند الاستلام</p>
                             </div>
                           ) : selectedOrder.paymentProof ? (
                             <div className="space-y-4 w-full">
                                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-white/10">
                                   <Image src={selectedOrder.paymentProof} alt="Payment Proof" fill className="object-contain bg-black" unoptimized />
                                </div>
                                <a href={selectedOrder.paymentProof} download className="block w-full bg-white/5 hover:bg-white/10 py-3 rounded-xl text-center text-sm font-bold transition-all text-white">تحميل الصورة</a>
                             </div>
                           ) : (
                             <div className="text-center space-y-4">
                                <X className="text-red-500 mx-auto" size={48} />
                                <p className="text-red-500 font-bold">لم يتم رفع إثبات دفع!</p>
                             </div>
                           )}
                        </div>
                      </section>

                      {/* Actions */}
                      <section className="space-y-4">
                         <h4 className="text-amber-500 font-bold text-sm uppercase tracking-widest text-right">التحكم في الطلب</h4>
                         <div className="grid gap-3">
                            {selectedOrder.status === 'pending' || selectedOrder.status === 'pending_confirmation' ? (
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => {
                                    if (selectedOrder.id) updateOrderStatus(selectedOrder.id, 'paid');
                                    sendWhatsAppConfirmation(selectedOrder, 'accept');
                                  }}
                                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                                >
                                  <CheckCircle size={18} /> تأكيد واستلام الدفع
                                </button>
                                <button 
                                  onClick={() => {
                                    if (selectedOrder.id) updateOrderStatus(selectedOrder.id, 'cancelled');
                                    sendWhatsAppConfirmation(selectedOrder, 'reject');
                                  }}
                                  className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold py-4 rounded-xl border border-red-500/20 transition-all"
                                >
                                  رفض الدفع
                                </button>
                              </div>
                            ) : null}
                            
                            <button 
                              onClick={() => {
                                if (selectedOrder.id) updateOrderStatus(selectedOrder.id, 'completed');
                              }}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                            >
                              <Package size={18} /> تحديد كـ "تم التوصيل"
                            </button>

                            <a 
                              href={`https://wa.me/${selectedOrder.phone.startsWith('0') ? '2' + selectedOrder.phone : selectedOrder.phone}`}
                              target="_blank"
                              className="w-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white font-bold py-4 rounded-xl border border-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                            >
                              <MessageSquare size={18} /> تواصل عبر واتساب
                            </a>
                         </div>
                      </section>
                   </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
