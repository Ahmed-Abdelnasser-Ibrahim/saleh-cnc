"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAdminAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("isAdmin");
      if (auth !== "true") {
        router.replace("/login");
      } else {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  return { isLoading };
}
