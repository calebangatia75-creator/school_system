"use client";

import { useEffect, useState, useRef } from 'react';

interface CounterProps {
  value: number;
  suffix?: string;
  label: string;
}

export function Counter({ value, suffix = '', label }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 2000;
          const step = value / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, 16);
          observer.unobserve(ref.current!);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center group">
      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-navy to-purple bg-clip-text text-transparent mb-4">
        {count.toLocaleString()}
        <span>{suffix}</span>
      </div>
      <p className="text-lg text-slate-600 font-semibold">{label}</p>
    </div>
  );
}
