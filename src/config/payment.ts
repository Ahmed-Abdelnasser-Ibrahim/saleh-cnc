export const PAYMENT_CONFIG = {
  vodafoneCashNumber: "01068256479",
  instaPayAccount: "01068256479",
  whatsappNumber: "201068256479",
  currency: "EGP",
  paymentMethods: {
    cod: {
      id: "cash_on_delivery",
      label: "الدفع عند الاستلام",
      description: "ادفع نقداً للمندوب عند استلام طلبك ومراجعته.",
      trustNote: "آمن 100% - تدفع بعد معاينة المنتج."
    },
    vodafone: {
      id: "vodafone_cash",
      label: "فودافون كاش",
      description: "تحويل سريع ومباشر عبر محفظة فودافون كاش.",
      trustNote: "تحويل فوري - يتم التأكيد يدوياً خلال ساعات."
    },
    instapay: {
      id: "instapay",
      label: "إنستا باي (InstaPay)",
      description: "تحويل بنكي لحظي آمن عبر تطبيق إنستا باي.",
      trustNote: "تحويل بنكي رسمي - آمن وموثق."
    }
  }
};
