"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Độ trễ (ms) trước khi hiện — dùng để tạo hiệu ứng nối tiếp */
  delay?: number;
  as?: "div" | "section" | "li";
}

/**
 * Hiện dần phần tử (fade + trượt lên) khi nó lọt vào khung nhìn.
 * Chỉ chạy một lần; tôn trọng prefers-reduced-motion qua CSS `.reveal`.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn("reveal", isVisible && "is-visible", className)}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
};
