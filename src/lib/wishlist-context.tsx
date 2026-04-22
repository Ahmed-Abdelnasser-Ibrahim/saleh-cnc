"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "./data";
import { useToast } from "./toast-context";

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        requestAnimationFrame(() => {
          setWishlist(parsed);
        });
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
  }, []);

  useEffect(() => {
    if (wishlist.length > 0 || localStorage.getItem("wishlist")) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    if (!wishlist.find(item => item.id === product.id)) {
      setWishlist([...wishlist, product]);
      if (showToast) showToast(`تم إضافة ${product.name} إلى المفضلة`, "success");
    }
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist(wishlist.filter(item => item.id !== productId));
    if (showToast) showToast("تم الإزالة من المفضلة", "success");
  };

  const isInWishlist = (productId: number) => {
    return !!wishlist.find(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
