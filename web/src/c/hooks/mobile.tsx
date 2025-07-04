"use client"

import { useEffect, useState } from "react";

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth <= 768);
      
      checkMobile(); // Run once on mount
      window.addEventListener("resize", checkMobile);
      
      return () => window.removeEventListener("resize", checkMobile);
    }, []);
  
    return isMobile;
  };