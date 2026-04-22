export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  badge?: string;
  description?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "ساعة حائط كلاسيك ليزر",
    price: 350,
    category: "ساعات",
    image: "/images/clock-1.jpg",
    badge: "الأكثر مبيعاً",
    description: "ساعة حائط خشبية مصممة بدقة عالية باستخدام ماكينات الليزر، تضيف لمسة كلاسيكية رائعة لمنزلك."
  },
  {
    id: 2,
    name: "لوحة جدارية إسلامية",
    price: 450,
    category: "ديكور جدران",
    image: "/images/wall-art-1.jpg",
    badge: "جديد",
    description: "لوحة جدارية مميزة بنقوش إسلامية راقية، مصنوعة من أجود أنواع الأخشاب الطبيعية."
  },
  {
    id: 3,
    name: "صندوق هدايا خشبي محفور",
    price: 180,
    category: "هدايا",
    image: "/images/box-1.jpg",
    description: "صندوق هدايا فريد من نوعه مع إمكانية حفر الأسماء والرسائل الخاصة على الغطاء."
  },
  {
    id: 4,
    name: "حامل مناديل مودرن",
    price: 120,
    category: "إكسسوارات منزلية",
    image: "/images/holder-1.jpg",
    description: "قطعة ديكور عملية وأنيقة لطاولة الطعام، مصممة بأسلوب عصري جذاب."
  },
  {
    id: 5,
    name: "أباجورة خشبية مودرن",
    price: 550,
    category: "إضاءة",
    image: "/images/lamp-1.jpg",
    badge: "خصم 10%",
    description: "أباجورة خشبية توفر إضاءة دافئة وهادئة، مثالية لغرف النوم والمكاتب."
  },
  {
    id: 6,
    name: "درع تكريم ليزر",
    price: 250,
    category: "دروع وهدايا",
    image: "/images/shield-1.jpg",
    description: "درع تكريم فخم مصنوع من الأكريليك والخشب مع حفر ليزر دقيق حسب الطلب."
  }
];

export interface OrderItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "completed" | "cancelled";
  date: string;
  address: string;
  city: string;
}

export interface Settings {
  siteName: string;
  whatsapp: string;
  email: string;
  facebook: string;
  instagram: string;
  address: string;
}

export interface DbData {
  products: Product[];
  orders: Order[];
  settings: Settings;
}

export const categories = [
  { id: 1, name: "ديكور جدران", image: "/images/cat-wall.jpg" },
  { id: 2, name: "ساعات", image: "/images/cat-clock.jpg" },
  { id: 3, name: "هدايا", image: "/images/cat-gift.jpg" },
  { id: 4, name: "إضاءة", image: "/images/cat-lighting.jpg" },
];
