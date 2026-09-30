"use client";

import React, { useRef, useState } from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  enableTilt?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  glow = false,
  enableTilt = true,
  className = "",
  children,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>("");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`
    );
  };

  const handleMouseLeave = () => {
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  const glowClass = glow
    ? "border-purple-500/40 shadow-glow"
    : "border-surface-border hover:border-purple-500/30";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: "transform 0.18s ease-out, border-color 0.3s ease, box-shadow 0.3s ease",
        transformStyle: "preserve-3d",
      }}
      className={`rounded-2xl bg-surface/80 backdrop-blur-md border p-6 md:p-8 ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
