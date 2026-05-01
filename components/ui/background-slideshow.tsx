"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type BackgroundSlideshowProps = {
  images: string[];
  alt: string;
  className?: string;
  imageClassName?: string;
  intervalMs?: number;
  priority?: boolean;
};

export function BackgroundSlideshow({
  images,
  alt,
  className,
  imageClassName,
  intervalMs = 20000,
  priority = false
}: BackgroundSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [images.length, intervalMs]);

  return (
    <div className={cn("absolute inset-0", className)}>
      {images.map((image, index) => (
        <Image
          key={image}
          src={image}
          alt={alt}
          fill
          priority={priority && index === 0}
          className={cn(
            "object-cover transition-opacity duration-[2000ms] ease-in-out",
            activeIndex === index ? "opacity-100" : "opacity-0",
            imageClassName
          )}
        />
      ))}
    </div>
  );
}
