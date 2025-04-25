import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { useScroll } from "framer-motion";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Add a scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (scrollY.get() > 500) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const unsubscribe = scrollY.on("change", handleScroll);
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <nav
      className={`fixed w-full transition-all duration-300 z-50 ${
        isScrolled ? "bg-gray-900" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        {isScrolled && (
          <h1 className="text-xl font-bold text-white">Necrobotic</h1>
        )}
        <ul className="flex space-x-4 ml-auto">
          <li>
            <Link
              to="home"
              smooth={true}
              duration={1200} // Match with Lenis duration
              className="text-white hover:text-gray-400 cursor-pointer"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="sprint1"
              smooth={true}
              duration={1200} // Match with Lenis duration
              className="text-white hover:text-gray-400 cursor-pointer"
            >
              Sprint 1
            </Link>
          </li>
          <li>
            <Link
              to="sprint2"
              smooth={true}
              duration={1200} // Match with Lenis duration
              className="text-white hover:text-gray-400 cursor-pointer"
            >
              Sprint 2
            </Link>
          </li>
          <li>
            <Link
              to="sprint3"
              smooth={true}
              duration={1200} // Match with Lenis duration
              className="text-white hover:text-gray-400 cursor-pointer"
            >
              Sprint 3
            </Link>
          </li>
          <li>
            <Link
              to="about"
              smooth={true}
              duration={1200} // Match with Lenis duration
              className="text-white hover:text-gray-400 cursor-pointer"
            >
              About Us
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;