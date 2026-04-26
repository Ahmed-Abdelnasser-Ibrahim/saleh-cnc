"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import { Search, Eye, Trash2, CheckCircle, Clock, X, Phone, User, MapPin, Package, FileSpreadsheet, ShoppingBag, CreditCard, MessageSquare, ExternalLink, AlertCircle, RefreshCcw, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/lib/toast-context";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import Image from "next/image";
import { PAYMENT_CONFIG } from "@/config/payment";

import { Order } from "@/lib/data";

interface OrderWithPayment extends Order {
  paymentMethod: "cash_on_delivery" | "vodafone_cash" | "instapay";
  paymentStatus: "not_required" | "pending_confirmation" | "paid" | "rejected";
  paymentProof?: string;
  paymentReference?: string;
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
      setIsLoading(true);
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

  const updateStatus = async (id: string, newStatus: string, newPaymentStatus?: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-auth": "true"
        },
        body: JSON.stringify({ id, status: newStatus, paymentStatus: newPaymentStatus }),
      });
      if (res.ok) {
        showToast("تم تحديث حالة الطلب بنجاح", "success");
        fetchOrders();
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ 
            ...selectedOrder, 
            status: newStatus as any, 
            paymentStatus: (newPaymentStatus || selectedOrder.paymentStatus) as any 
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

  const sendWhatsAppUpdate = (order: OrderWithPayment, action: 'paid' | 'rejected' | 'shipped') => {
    let message = "";
    if (action === 'paid') {
      message = `أهلاً ${order.customer} 👋، تم تأكيد استلام الدفع لطلبك رقم #${order.id.slice(-6).toUpperCase()} بنجاح ✅. جاري تجهيز الطلب الآن.`;
    } else if (action === 'rejected') {
      message = `نعتذر ${order.customer} ❌، لم نتمكن من تأكيد الدفع لطلبك رقم #${order.id.slice(-6).toUpperCase()}. يرجى مراجعة عملية التحويل أو التواصل معنا لتوضيح الأمر.`;
    } else if (action === 'shipped') {
      message = `خبر سعيد ${order.customer} 🚚! تم شحن طلبك رقم #${order.id.slice(-6).toUpperCase()} وهو في طريقه إليك الآن.`;
    }

    const whatsappUrl = `https://wa.me/${order.phone.startsWith('0') ? '2' + order.phone : order.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const filteredOrders = orders.filter(o => 
    o.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.id && o.id.toLowerCase().includes(searchTerm.toLowerCase())) || 
    o.phone.includes(searchTerm)
  );

  const getBadgeStyles = (type: 'status' | 'payment', value: string) => {
    const styles: Record<string, string> = {
      // Order Status
      pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      pending_payment_confirmation: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      processing: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      shipped: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
      payment_rejected: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      
      // Payment Status
      not_required: "bg-gray-500/10 text-gray-400 border-gray-500/10",
      pending_confirmation: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      rejected: "bg-red-500/10 text-red-500 border-red-500/20"
    };
    return styles[value] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
  };

  const getStatusLabel = (value: string) => {
    const labels: Record<string, string> = {
      pending: "قيد المراجعة",
      pending_payment_confirmation: "مراجعة الدفع",
      processing: "جاري التجهيز",
      shipped: "تم الشحن",
      completed: "تم التوصيل",
      cancelled: "ملغي",
      payment_rejected: "مرفوض الدفع",
      not_required: "عند الاستلام",
      paid: "تم تأكيد الدفع"
    };
    return labels[value] || value;
  };

  if (authLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-bold">جاري التحقق...</div>;

  return (
    <div className="flex min-h-screen bg-[#050505]">
      <AdminSidebar />
      
      <main className="flex-1 p-4 sm:p-8 overflow-hidden">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="text-right">
            <h1 className="text-3xl font-black mb-2 text-white">إدارة الطلبات والمدفوعات</h1>
            <p className="text-gray-400">تحكم كامل في فواتير العملاء وعمليات التحويل البنكي.</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={fetchOrders}
                className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all"
             >
                <RefreshCcw size={20} className={isLoading ? "animate-spin" : ""} />
             </button>
             <button 
                onClick={() => {}}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
              >
                <FileSpreadsheet size={20} />
                تصدير البيانات
              </button>
          </div>
        </header>

        <div className="bg-slate-900 rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex items-center gap-6 bg-white/[0.02]">
            <div className="relative flex-1">
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500" size={22} />
              <input
                type="text"
                placeholder="ابحث بالاسم، رقم الهاتف، أو كود الطلب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-16 pl-6 outline-none focus:border-amber-500 transition-colors text-right text-white font-bold"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="text-gray-500 text-xs uppercase tracking-widest bg-white/[0.01]">
                  <th className="p-8 font-black">كود الطلب</th>
                  <th className="p-8 font-black">العميل</th>
                  <th className="p-8 font-black">طريقة الدفع</th>
                  <th className="p-8 font-black">المبلغ</th>
                  <th className="p-8 font-black">الحالة</th>
                  <th className="p-8 font-black text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                   <tr>
                     <td colSpan={6} className="p-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                           <RefreshCcw size={40} className="animate-spin text-amber-500" />
                           <span className="text-gray-500 font-bold">جاري جلب أحدث الطلبات...</span>
                        </div>
                     </td>
                   </tr>
                ) : filteredOrders.length > 0 ? (
                  <AnimatePresence>
                    {filteredOrders.map((order) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="p-8">
                           <span className="font-mono font-bold text-amber-500">#{order.id?.slice(-6).toUpperCase()}</span>
                        </td>
                        <td className="p-8">
                          <div className="flex flex-col">
                            <span className="font-black text-white text-base">{order.customer}</span>
                            <span className="text-xs text-gray-500 mt-1 flex items-center justify-end gap-1">
                               {order.phone} <Phone size={12} />
                            </span>
                          </div>
                        </td>
                        <td className="p-8">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-300">
                               {order.paymentMethod === 'cash_on_delivery' ? 'كاش' : order.paymentMethod === 'vodafone_cash' ? 'فودافون' : 'إنستا باي'}
                            </span>
                            <span className={`text-[10px] mt-1 font-black ${order.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500/50'}`}>
                               {getStatusLabel(order.paymentStatus)}
                            </span>
                          </div>
                        </td>
                        <td className="p-8 font-black text-white text-lg">{order.total} <span className="text-xs font-normal">ج.م</span></td>
                        <td className="p-8">
                          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-tighter ${getBadgeStyles('status', order.status)}`}>
                             {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="p-8 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5"
                              title="عرض التفاصيل"
                            >
                              <Eye size={20} />
                            </button>
                            <button 
                              onClick={async () => {
                                const confirmed = await confirm({
                                  title: "حذف نهائي للطلب",
                                  message: `أنت على وشك حذف الطلب الخاص بالعميل "${order.customer}" بشكل نهائي. لا يمكن استرجاع هذه البيانات.`,
                                  confirmText: "تأكيد الحذف",
                                  cancelText: "إلغاء",
                                  type: "danger"
                                });
                                if (confirmed && order.id) handleDelete(order.id);
                              }}
                              className="p-3 bg-red-500/5 hover:bg-red-500 rounded-xl text-gray-400 hover:text-white transition-all border border-red-500/10"
                              title="حذف الطلب"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                ) : (
                  <tr>
                    <td colSpan={6} className="p-32 text-center">
                      <div className="flex flex-col items-center gap-6 text-gray-700">
                        <ShoppingBag size={80} strokeWidth={1} />
                        <div className="space-y-2">
                           <p className="text-2xl font-black text-gray-500">لا توجد طلبات لعرضها</p>
                           <p className="text-sm">بمجرد قيام العملاء بالشراء، ستظهر البيانات هنا فوراً.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Premium View Order Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedOrder(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="relative bg-slate-900 border border-white/10 rounded-[48px] w-full max-w-5xl overflow-hidden shadow-3xl flex flex-col max-h-[90vh]"
              >
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02] shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-black">
                       <Package size={24} />
                    </div>
                    <div className="text-right">
                       <h2 className="text-2xl font-black text-white">تفاصيل الفاتورة #{selectedOrder.id.slice(-6).toUpperCase()}</h2>
                       <p className="text-xs text-gray-500">{selectedOrder.date}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-3 hover:bg-white/5 rounded-2xl text-white transition-colors">
                    <X size={28} />
                  </button>
                </div>

                <div className="p-10 overflow-y-auto no-scrollbar grid lg:grid-cols-12 gap-10">
                   {/* Main Info Column */}
                   <div className="lg:col-span-7 space-y-10">
                      <section className="space-y-6">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">بيانات التوصيل والاتصال</span>
                           <div className="h-px bg-white/5 flex-1 mx-4" />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                           <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4 text-right">
                              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">العميل</p>
                              <p className="text-xl font-black text-white">{selectedOrder.customer}</p>
                              <a href={`tel:${selectedOrder.phone}`} className="flex items-center justify-end gap-2 text-amber-500 font-bold hover:underline">
                                 <span dir="ltr">{selectedOrder.phone}</span> <Phone size={14} />
                              </a>
                           </div>
                           <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4 text-right">
                              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">العنوان</p>
                              <p className="text-white font-bold">{selectedOrder.address}</p>
                              <p className="text-gray-400 text-sm">{selectedOrder.city}</p>
                           </div>
                        </div>
                      </section>

                      <section className="space-y-6">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">محتويات الطلب</span>
                           <div className="h-px bg-white/5 flex-1 mx-4" />
                        </div>
                        <div className="bg-white/5 rounded-[32px] border border-white/5 overflow-hidden">
                           <table className="w-full text-right">
                              <thead>
                                 <tr className="bg-white/[0.02] text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                    <th className="p-6">المنتج</th>
                                    <th className="p-6 text-center">الكمية</th>
                                    <th className="p-6">السعر</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                 {selectedOrder.items.map((item, idx) => (
                                   <tr key={idx} className="text-white">
                                      <td className="p-6 font-bold">{item.name}</td>
                                      <td className="p-6 text-center font-mono">×{item.quantity}</td>
                                      <td className="p-6 font-black">{item.price * item.quantity} ج.م</td>
                                   </tr>
                                 ))}
                              </tbody>
                              <tfoot>
                                 <tr className="bg-amber-500/5">
                                    <td colSpan={2} className="p-6 text-gray-400 font-bold">الإجمالي النهائي</td>
                                    <td className="p-6 text-2xl font-black text-amber-500">{selectedOrder.total} ج.م</td>
                                 </tr>
                              </tfoot>
                           </table>
                        </div>
                      </section>
                   </div>

                   {/* Payment Status Column */}
                   <div className="lg:col-span-5 space-y-8">
                      <section className="space-y-6">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">التحقق من الدفع</span>
                           <div className="h-px bg-white/5 flex-1 mx-4" />
                        </div>
                        
                        <div className={`bg-white/5 rounded-[40px] border-2 border-dashed p-8 flex flex-col items-center justify-center min-h-[400px] transition-all ${selectedOrder.paymentProof ? 'border-emerald-500/20' : 'border-white/5'}`}>
                           {selectedOrder.paymentMethod === 'cash_on_delivery' ? (
                             <div className="text-center space-y-6">
                                <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto shadow-inner">
                                   <ShoppingBag className="text-gray-600" size={48} />
                                </div>
                                <div>
                                   <p className="text-white text-xl font-black mb-2">الدفع عند الاستلام</p>
                                   <p className="text-gray-500 text-sm leading-relaxed">العميل اختار الدفع للمندوب.<br/>لا يوجد ملفات للتحقق منها.</p>
                                </div>
                             </div>
                           ) : selectedOrder.paymentProof ? (
                             <div className="w-full space-y-6">
                                <div className="relative aspect-[3/4] w-full rounded-[32px] overflow-hidden border-4 border-white/5 shadow-2xl group cursor-zoom-in">
                                   <Image src={selectedOrder.paymentProof} alt="Payment Proof" fill className="object-contain bg-black transition-transform group-hover:scale-110" unoptimized />
                                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <button onClick={() => window.open(selectedOrder.paymentProof, '_blank')} className="bg-white text-black font-black px-6 py-3 rounded-2xl flex items-center gap-2">
                                         <ExternalLink size={18} /> عرض الحجم الكامل
                                      </button>
                                   </div>
                                </div>
                             </div>
                           ) : (
                             <div className="text-center space-y-6">
                                <div className="w-24 h-24 bg-red-500/10 rounded-[32px] flex items-center justify-center mx-auto">
                                   <AlertCircle className="text-red-500" size={48} />
                                </div>
                                <div>
                                   <p className="text-red-500 text-xl font-black mb-2">لم يرفع إثبات!</p>
                                   <p className="text-gray-500 text-sm">العميل اختار دفع إلكتروني<br/>ولكنه لم يرفق صورة التحويل.</p>
                                </div>
                             </div>
                           )}
                        </div>
                      </section>

                      {/* Management Controls */}
                      <section className="space-y-4">
                         <h4 className="text-amber-500 font-bold text-sm uppercase tracking-widest text-right">إجراءات المدير</h4>
                         <div className="grid gap-3">
                            {selectedOrder.paymentStatus === 'pending_confirmation' && (
                               <div className="grid grid-cols-2 gap-3">
                                  <button 
                                    onClick={() => {
                                      updateStatus(selectedOrder.id, 'paid', 'paid');
                                      sendWhatsAppUpdate(selectedOrder, 'paid');
                                    }}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-500/20"
                                  >
                                    <CheckCircle size={20} /> تأكيد الدفع
                                  </button>
                                  <button 
                                    onClick={() => {
                                      updateStatus(selectedOrder.id, 'payment_rejected', 'rejected');
                                      sendWhatsAppUpdate(selectedOrder, 'rejected');
                                    }}
                                    className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-black py-5 rounded-2xl border border-red-500/20 transition-all"
                                  >
                                    <X size={20} /> رفض الدفع
                                  </button>
                               </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                               <button 
                                  onClick={() => updateStatus(selectedOrder.id, 'processing')}
                                  className="bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-purple-600/20"
                                >
                                  <Package size={18} /> جاري التجهيز
                                </button>
                                <button 
                                  onClick={() => {
                                     updateStatus(selectedOrder.id, 'shipped');
                                     sendWhatsAppUpdate(selectedOrder, 'shipped');
                                  }}
                                  className="bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-500/20"
                                >
                                  <Truck size={18} /> تم الشحن
                                </button>
                            </div>
                            <button 
                               onClick={() => updateStatus(selectedOrder.id, 'completed')}
                               className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-500/20"
                             >
                               <CheckCircle size={18} /> تم التوصيل
                             </button>

                            <a 
                              href={`https://wa.me/${selectedOrder.phone.startsWith('0') ? '2' + selectedOrder.phone : selectedOrder.phone}`}
                              target="_blank"
                              className="w-full bg-emerald-500/5 hover:bg-emerald-500 text-emerald-500 hover:text-white font-black py-5 rounded-2xl border border-emerald-500/10 flex items-center justify-center gap-3 transition-all"
                            >
                              <MessageSquare size={20} /> تواصل سريع عبر واتساب
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
