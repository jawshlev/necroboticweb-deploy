import React, { useRef, useEffect, useState } from 'react';
import { motion} from 'framer-motion';

const ParallaxImageReveal = ({ src, index }) => {
  const containerRef = useRef(null);
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  
  // Update measurements on mount and on resize
  useEffect(() => {
    const element = containerRef.current;
    const updateMeasurements = () => {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      setElementTop(rect.top + window.scrollY || window.pageYOffset);
      setClientHeight(window.innerHeight);
    };
    
    updateMeasurements();
    window.addEventListener("resize", updateMeasurements);
    return () => window.removeEventListener("resize", updateMeasurements);
  }, []);
  
  // Create a custom scroll progress using manual calculations to avoid positioning issues
  const [scrollYProgress, setScrollYProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollY = window.scrollY || window.pageYOffset;
      // Calculate how far down the page the element is (from the top of the viewport)
      const elementRect = containerRef.current.getBoundingClientRect();
      const elementHeight = elementRect.height;
      
      // Start animation when the element top enters the bottom of viewport
      // End animation when element bottom leaves the top of viewport
      const startPoint = elementTop - clientHeight;
      const endPoint = elementTop + elementHeight;
      
      // Calculate scroll progress (0 to 1)
      const rawProgress = (scrollY - startPoint) / (endPoint - startPoint);
      const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);
      
      setScrollYProgress(clampedProgress);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [elementTop, clientHeight]);
  
  // Derive transformations directly from the calculated scrollYProgress
  // Enhanced for more dramatic effect with Lenis
  const y = scrollYProgress * -100; // Move from 0 to -100 for more noticeable movement
  
  // Restore original clipping path behavior
  const clipPathLeft = 40 - (scrollYProgress > 0.5 ? 0.5 : scrollYProgress) * 100; // 40 to 0
  const clipPathRight = 60 + (scrollYProgress > 0.5 ? 0.5 : scrollYProgress) * 100; // 60 to 100
  const grayscale = 50 - (scrollYProgress > 0.7 ? 0.7 : scrollYProgress) * 100; // 100 to 0
  
  // Different column spans for each image to match original layout
  const getGridClass = () => {
    switch(index) {
      case 0: return "col-span-5 md:col-span-5";
      case 1: return "col-span-7 md:col-span-7 row-start-2";
      case 2: return "col-span-6 md:col-span-6 row-start-3";
      default: return "col-span-6";
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`parallax-image-wrapper ${getGridClass()}`}
      style={{ position: 'relative', overflow: 'hidden', height: '350px' }}
    >
      <motion.div
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <motion.img
          src={src}
          alt={`Parallax image ${index + 1}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '115%',
            objectFit: 'cover',
            objectPosition: 'center',
            transform: `translateY(${y}px)`,
            filter: `grayscale(${grayscale}%)`,
            clipPath: `polygon(${clipPathLeft}% 0%, ${clipPathRight}% 0%, ${clipPathRight}% 100%, ${clipPathLeft}% 100%)`
          }}
        />
      </motion.div>
    </div>
  );
};

export default ParallaxImageReveal;