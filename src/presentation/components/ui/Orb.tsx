"use client";

import React from "react";
import { motion } from "framer-motion";

export const Orb = () => {
  return (
    <div style={{ position: "relative", width: 120, height: 120 }}>
      {/* Outer Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Inner Core */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        }}
        style={{
          position: "absolute",
          top: "15%",
          left: "15%",
          right: "15%",
          bottom: "15%",
          borderRadius: "50%",
          background: "conic-gradient(from 0deg, var(--aurora-1), var(--aurora-2), var(--aurora-3), var(--aurora-1))",
          boxShadow: "var(--shadow-glow)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
        }}
      />
      
      {/* Surface Reflection */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "20%",
          width: "30%",
          height: "30%",
          background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 60%)",
          borderRadius: "50%",
          filter: "blur(4px)",
          opacity: 0.6,
        }}
      />
    </div>
  );
};
