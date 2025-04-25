import React, { useRef, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from "framer-motion";
import { wrap } from "@motionone/utils";

const ParallaxText = ({ children, baseVelocity = 100, index = 0, flipped = false }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  
  // Improve smoothness with better spring configuration
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { 
    damping: 100,  // Higher damping for smoother movement
    stiffness: 200  // Lower stiffness to prevent overreaction
  });
  
  // Reduce velocity factor influence
  const velocityFactor = useTransform(smoothVelocity, 
    [0, 1000], 
    [0, 0.5],  // Reduced max influence
    { clamp: true }  // Add clamping to prevent extreme values
  );

  // Use a continuous wrapping approach for text
  const x = useTransform(baseX, (v) => {
    // Calculate text widths in pixels for more precise wrapping
    const textWidth = 2400; // approximation based on content
    return `${wrap(-textWidth/2, textWidth/2, v)}px`;
  });
  
  const directionFactor = useRef(flipped ? -1 : 1);

  useAnimationFrame((_, delta) => {
    // Smoother base movement with consistent delta time
    let moveBy = directionFactor.current * baseVelocity * (delta / 500);
    
    // Apply scroll velocity with reduced sensitivity
    const currentVelocity = velocityFactor.get();
    if (Math.abs(currentVelocity) > 0.05) {
      moveBy += directionFactor.current * moveBy * currentVelocity * 0.1;
    }
    
    baseX.set(baseX.get() + moveBy);
  });

  // Define position with minimal spacing between bars
  const yPosition = index; // Second bar 42px below first (allows text to be very close)

  return (
    <div
      className="parallax w-full overflow-hidden"
      style={{
        position: "relative",
        top: `${yPosition}px`,
        height: "40px",
        transform: flipped ? "rotate(180deg)" : "none"
      }}
    >
      <motion.div 
        className="scroller flex whitespace-nowrap w-full items-center h-full" 
        style={{ x }}
      >
        {/* More repeats for smoother looping */}
        {[...Array(16)].map((_, i) => (
          <span 
            key={i} 
            className="mx-4 text-white font-bold text-lg uppercase tracking-widest opacity-90"
            style={{ display: "inline-block" }}
          >
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default ParallaxText;