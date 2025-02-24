import React, { useState, useEffect } from "react";
import { Element } from "react-scroll"; // Use Element for section linking
import { motion, useTransform, useScroll } from "framer-motion";

const Home = () => {
  const [isTitleVisible, setIsTitleVisible] = useState(true);
  const { scrollY } = useScroll();

  // Define animation values based on scroll position
  const titleScale = useTransform(scrollY, [0, 200], [1, 0.5]); // Shrink from 1x to 0.5x
  const titleY = useTransform(scrollY, [0, 200], [0, -100]); // Move up by 100px

  // Hide the title when it's fully scrolled out of view
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
        if (latest > 200) {
          setIsTitleVisible(false);
        } else {
          setIsTitleVisible(true);
        }
    });

    return () => unsubscribe();
  }, [scrollY]);

  return (
    <div>
      {/* Home Section */}
      <Element name="home" className="section">
        <section className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          {isTitleVisible && (
            <motion.h1
              className="text-6xl font-bold mb-4"
              style={{
                scale: titleScale,
                y: titleY,
              }}
            >
              Necrobotic
            </motion.h1>
          )}
        </section>
      </Element>

      {/* Sprint 1 Section */}
      <Element name="sprint1" className="section">
        <section className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
          <h2 className="text-4xl font-bold">Sprint 1</h2>
        </section>
      </Element>

      {/* About Section */}
      <Element name="about" className="section">
        <section className="min-h-screen flex items-center justify-center bg-gray-700 text-white">
          <h2 className="text-4xl font-bold">About Us</h2>
        </section>
      </Element>
    </div>
  );
};

export default Home;