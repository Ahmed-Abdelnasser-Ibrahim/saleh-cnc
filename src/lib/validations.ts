import { z } from "zod";

// Phone validation regex for Egyptian numbers
const phoneRegex = /^01[0125][0-9]{8}$/;

export const orderSchema = z.object({
  customer: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل").max(50, "الاسم طويل جداً"),
  phone: z.string().regex(phoneRegex, "رقم الهاتف يجب أن يكون رقم مصري صالح"),
  address: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل").max(200, "العنوان طويل جداً"),
  city: z.enum(["القاهرة", "الجيزة", "الإسكندرية", "القليوبية"]),
  notes: z.string().max(500, "الملاحظات طويلة جداً").optional().default(""),
  items: z.array(z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
  })).min(1, "السلة فارغة"),
  total: z.number().positive(),
  paymentMethod: z.enum(["cod", "vodafone", "instapay"]).default("cod"),
  paymentProof: z.string().optional().default(""),
});

export const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "اسم المنتج يجب أن يكون 3 أحرف على الأقل").max(100, "اسم المنتج طويل جداً"),
  price: z.number().positive("السعر يجب أن يكون رقماً موجباً"),
  category: z.string().min(2, "التصنيف مطلوب"),
  image: z.string().min(1, "الصورة مطلوبة"),
  badge: z.string().max(20, "الشارة طويلة جداً").optional().or(z.literal("")),
  description: z.string().max(1000, "الوصف طويل جداً").optional().or(z.literal("")),
});

export const settingsSchema = z.object({
  siteName: z.string().min(2).max(50),
  whatsapp: z.string().regex(phoneRegex, "رقم الواتساب غير صحيح"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  facebook: z.string().url("رابط فيسبوك غير صحيح").or(z.literal("#")),
  instagram: z.string().url("رابط إنستغرام غير صحيح").or(z.literal("#")),
  address: z.string().min(5).max(100),
});

export const loginSchema = z.object({
  username: z.string().min(1, "اسم المستخدم مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});
