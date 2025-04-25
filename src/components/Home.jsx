import React, { useState, useEffect, useRef } from "react";
import { Element } from "react-scroll";
import { motion, useScroll, useInView, AnimatePresence, useTransform, useAnimate } from "framer-motion";
import Lenis from '@studio-freight/lenis';
import ParallaxText from "./ParallaxText";
import ParallaxImageReveal from "./ParallaxImageReveal";

// Function to generate URLs for images dynamically
const loadImages = (folder, imageNames) => {
  return imageNames.reduce((acc, file) => {
    acc[file] = new URL(`../assets/${folder}/${file}`, import.meta.url).href;
    return acc;
  }, {});
};

// Load images for each sprint folder
const allImages = {
  s1: loadImages("s1", ["bg.png", "uiux.png", "sidebysideplayer.jpg", "layoutwithkey.png"]),
  // s1: loadImages("s1", ["bg.png", "uiux.png", "sidebysideplayer.jpg", "layoutwithkey.png"]),
  s3: loadImages("s3", ["bg.png", "uiux.png", "sidebysideplayer.jpg", "layoutwithkey.png"]),
};


const Home = () => {
  const [isTitleVisible, setIsTitleVisible] = useState(true);
  const { scrollY } = useScroll();
  const navHeight = 64; // Height of your nav bar in pixels
  const [scope, animate] = useAnimate();

  // Animation state for parallax bars
  const [isParallaxVisible, setIsParallaxVisible] = useState(false);
  
  // Track which sprint section is currently in view
  const [currentSprint, setCurrentSprint] = useState(1);
  
  // Track if we're transitioning between sprint content
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,        // Adjust for smoother/slower scrolling
      smoothWheel: true,    // Smooth mouse wheel scrolling
      smoothTouch: true,    // Smooth touch scrolling
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing function
      touchMultiplier: 1.5, // Adjust touch sensitivity
      infinite: false,      // No infinite scrolling
    });

    // Connect Lenis to requestAnimationFrame for smooth performance
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    
    // Cleanup function
    return () => {
      lenis.destroy();
    };
  }, []);

  // Track Sprint visibility with adjusted margins for smoother transitions
  const sprint1Ref = useRef(null);
  const sprint2Ref = useRef(null);
  const sprint3Ref = useRef(null);
  
  const isSprint1InView = useInView(sprint1Ref, { 
    margin: "-15% 0px -20% 0px", // Increase the negative top margin to delay appearance
    once: false
  });
  
  const isSprint2InView = useInView(sprint2Ref, { 
    margin: "-15% 0px -20% 0px", // Increase the negative top margin to delay appearance
    once: false
  });
  
  const isSprint3InView = useInView(sprint3Ref, { 
    margin: "-15% 0px -20% 0px", // Increase the negative top margin to delay appearance
    once: false
  });
  
  // Update current sprint based on which one is in view
  useEffect(() => {
    const newSprint = isSprint1InView ? 1 : isSprint2InView ? 2 : isSprint3InView ? 3 : currentSprint;
    
    if (newSprint !== currentSprint) {
      // Only update if there's a change, and only if at least one sprint is visible
      if (isSprint1InView || isSprint2InView || isSprint3InView) {
        setCurrentSprint(newSprint);
      }
    }
  }, [isSprint1InView, isSprint2InView, isSprint3InView, currentSprint]);

  const isAnySprintInView = isSprint1InView || isSprint2InView || isSprint3InView;

  // In your useEffect for animation
  useEffect(() => {
    // Simple fade in/out based on sprint visibility
    if (isAnySprintInView && !isParallaxVisible) {
      setIsParallaxVisible(true);
      animate(".parallax-container", { opacity: 1 }, { duration: 0.4 });
      animate(".parallax-text-1", { opacity: 1, y: 0 }, { duration: 0.4 });
      animate(".parallax-text-2", { opacity: 1, y: 0 }, { duration: 0.4 });
    } 
    else if (!isAnySprintInView && isParallaxVisible) {
      setIsParallaxVisible(false);
      animate(".parallax-container", { opacity: 0 }, { duration: 0.3 });
      animate(".parallax-text-1", { opacity: 0 }, { duration: 0.3 });
      animate(".parallax-text-2", { opacity: 0 }, { duration: 0.3 });
    }
  }, [isAnySprintInView, isParallaxVisible, animate]);
  

// Simplified content transition for sprint text changes
useEffect(() => {
  if (isAnySprintInView && !isTransitioning) {
    setIsTransitioning(true);
    
    // Simple crossfade for text content change
    animate([
      [".parallax-text-1, .parallax-text-2", { opacity: 0.3 }, { duration: 0.6 }],
      [".parallax-text-1, .parallax-text-2", { opacity: 1 }, { duration: 0.3, delay: 0.1 }]
    ]).then(() => setIsTransitioning(false));
  }
}, [currentSprint, animate, isAnySprintInView]);

  // Replace the containerY calculation with a simpler fixed position
  const containerY = useTransform(
    scrollY,
    [0, 100], // Just a small range for minor movement
    [navHeight + 10, navHeight + 20] // Keep it just below the navbar at all times
  );

  // References for parallax gallery
  const galleryRef = useRef(null);
  
  // Get parallax text content based on current sprint
  const getParallaxTextContent = (sprint) => {
    switch(sprint) {
      case 1:
        return {
          text1: "Sprint 1 · Development · Progress",
          text2: "Necrobotic · Innovation · Technology"
        };
      case 2:
        return {
          text1: "Sprint 2 · Implementation · Features",
          text2: "Necrobotic · Gameplay · Mechanics"
        };
      case 3:
        return {
          text1: "Sprint 3 · Finalization · Polishing",
          text2: "Necrobotic · Launch · Experience"
        };
      default:
        return {
          text1: "Sprint 1 · Development · Progress",
          text2: "Necrobotic · Innovation · Technology"
        };
    }
  };
  
  const parallaxContent = getParallaxTextContent(currentSprint);

  return (
    <div ref={scope}>
      {/* Fixed background section */}
      <div className="fixed top-0 left-0 w-full h-screen bg-gray-900 z-0 flex flex-col items-center justify-center">
        {isTitleVisible && (
          <p className="text-6xl font-bold mb-4 text-white">
            Necrobotic
          </p>
        )}
        <p className="text-3xl text-white">This is some normal text below the title.</p>
      </div>

      <motion.div 
        className="parallax-container"
        style={{ 
          position: 'fixed', 
          top: navHeight + 10,
          width: '100%', 
          zIndex: 30,
          opacity: 0, // Start completely hidden
          height: '80px'
        }}
      >
        <motion.div 
          className="parallax-text-1" 
          style={{ opacity: 0, y: -5 }} // Reduced initial offset
        >
          <ParallaxText baseVelocity={6} index={0}>{parallaxContent.text1}</ParallaxText>
        </motion.div>

        <motion.div 
          className="parallax-text-2" 
          style={{ opacity: 0, y: -5 }} // Reduced initial offset
        >
          <ParallaxText baseVelocity={-4.5} index={1} flipped={true}>{parallaxContent.text2}</ParallaxText>
        </motion.div>
      </motion.div>

      {/* Spacer */}
      <div className="h-screen" id="home"></div>

      {/* Content sections */}
      <div className="relative z-10">
        {/* Sprint 1 Section */}
        <Element name="sprint1" className="section">
          <section
            ref={sprint1Ref}
            className="min-h-screen py-24 flex flex-col items-center justify-start bg-gray-800 text-white"
            style={{ position: 'relative' }} // Ensure section has position
          >
            <div className="w-full h-16"></div>
            <h2 className="text-6xl font-bold mb-32">
              Sprint 1
            </h2>
            {/* Staggered Layout - Alternating Images and Text */}
            <div 
              ref={galleryRef}
              className="w-11/12 max-w-6xl mx-auto"
              style={{ position: 'relative' }} // Ensure gallery has position
            >
              {/* Row 1: Image Right, Text Left */}
              <div className="flex flex-col md:flex-row items-center mb-24">
                <div className="md:w-1/2 px-4 mb-6 md:mb-0">
                  <h3 className="text-2xl font-semibold mb-4">Initial Background Design</h3>
                  <p className="text-gray-300">
                    Our initial background design, took inspiration from a "Cyberpunk-esq" theme,
                    with the overall goal that this would be the triple parallax background to our
                    title screen.
                  </p>
                </div>
                <div className="md:w-1/2 px-4">
                  <ParallaxImageReveal 
                    src={allImages.s1["bg.png"]} 
                    index={0} 
                    align="right"
                  />
                </div>
              </div>

              {/* Row 2: Image Left, Text Right */}
              <div className="flex flex-col md:flex-row-reverse items-center mb-24">
                <div className="md:w-1/2 px-4 mb-6 md:mb-0">
                  <h3 className="text-2xl font-semibold mb-4">UI Wireframe</h3>
                  <p className="text-gray-300">
                    Here is a figma example that details a prototype of our game UI.
                    This includes health/energy bars, ability diagrams that appear above their
                    respective keys and even a boss health bar.
                  </p>
                </div>
                <div className="md:w-1/2 px-4">
                  <ParallaxImageReveal 
                    src={allImages.s1["uiux.png"]} 
                    index={1} 
                    align="left"
                  />
                </div>
              </div>

              {/* Row 3: Image Right, Text Left */}
              <div className="flex flex-col md:flex-row items-center mb-24">
                <div className="md:w-1/2 px-4 mb-6 md:mb-0">
                  <h3 className="text-2xl font-semibold mb-4">Player Comparison</h3>
                  <p className="text-gray-300">
                    Side-by-side player comparison, on the left is our
                    unmodified player model, and to the right is our player
                    after they've picked up the arm upgrade, demonstrating
                    the potential changes in the player's character
                    as they progress through Necrobotic.
                  </p>
                </div>
                <div className="md:w-1/2 px-4">
                  <ParallaxImageReveal 
                    src={allImages.s1["sidebysideplayer.jpg"]} 
                    index={2} 
                    align="right"
                  />
                </div>
              </div>

              {/* Row 4: Image Left, Text Right */}
              <div className="flex flex-col md:flex-row-reverse items-center mb-16">
                <div className="md:w-1/2 px-4 mb-6 md:mb-0">
                  <h3 className="text-2xl font-semibold mb-4">Layout System</h3>
                  <p className="text-gray-300">
                    This is our level layout mockup, featuring a legend for easier
                    interpretation. The connections between the rooms encapsulate
                    player progression throughout Necrobotic.
                  </p>
                </div>
                <div className="md:w-1/2 px-1">
                  <ParallaxImageReveal 
                    src={allImages.s1["layoutwithkey.png"]} 
                    index={3} 
                    align="left"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-16 w-11/12 max-w-4xl">
              <p className="text-lg text-gray-300">
                Our first sprint focused on establishing the core UI/UX design principles
                and developing the initial prototype. The images above showcase our progress
                in creating an intuitive and visually engaging user experience.
              </p>
            </div>
          </section>
        </Element>

        {/* Sprint 2 Section */}
        <Element name="sprint2" className="section">
          <section
            ref={sprint2Ref}
            className="min-h-screen py-24 flex flex-col items-center justify-start bg-gray-700 text-white"
            style={{ position: 'relative' }} 
          >
            <div className="w-full h-16"></div>
            <h2 className="text-6xl font-bold mb-32">
              Sprint 2
            </h2>
            <div 
              className="w-11/12 max-w-6xl mx-auto"
              style={{ position: 'relative' }}
            >
              {/* Row 1: Image Right, Text Left */}
              <div className="flex flex-col md:flex-row items-center mb-24">
                <div className="md:w-1/2 px-4 mb-6 md:mb-0">
                  <h3 className="text-2xl font-semibold mb-4">Game Mechanics Implementation</h3>
                  <p className="text-gray-300">
                    During our second sprint, we implemented the core game mechanics including
                    player movement, combat systems, and the first set of enemy AI behaviors.
                    This laid the foundation for our gameplay loop.
                  </p>
                </div>
                <div className="md:w-1/2 px-4">
                  <ParallaxImageReveal 
                    src={allImages.s1["bg.png"]} 
                    index={0} 
                    align="right"
                  />
                </div>
              </div>

              {/* Row 2: Image Left, Text Right */}
              <div className="flex flex-col md:flex-row-reverse items-center mb-24">
                <div className="md:w-1/2 px-4 mb-6 md:mb-0">
                  <h3 className="text-2xl font-semibold mb-4">Ability System Integration</h3>
                  <p className="text-gray-300">
                    The ability system was integrated during this sprint, allowing players to
                    unlock and use various cybernetic enhancements. Each ability affects gameplay
                    in unique ways and provides strategic options.
                  </p>
                </div>
                <div className="md:w-1/2 px-4">
                  <ParallaxImageReveal 
                    src={allImages.s1["uiux.png"]} 
                    index={1} 
                    align="left"
                  />
                </div>
              </div>

              {/* Row 3: Image Right, Text Left */}
              <div className="flex flex-col md:flex-row items-center mb-24">
                <div className="md:w-1/2 px-4 mb-6 md:mb-0">
                  <h3 className="text-2xl font-semibold mb-4">Enemy Types and Behaviors</h3>
                  <p className="text-gray-300">
                    We expanded our enemy roster with different types, each with unique behaviors
                    and attack patterns. This creates varied combat encounters throughout the game
                    and encourages players to adapt their strategies.
                  </p>
                </div>
                <div className="md:w-1/2 px-4">
                  <ParallaxImageReveal 
                    src={allImages.s1["sidebysideplayer.jpg"]} 
                    index={2} 
                    align="right"
                  />
                </div>
              </div>

              {/* Row 4: Image Left, Text Right */}
              <div className="flex flex-col md:flex-row-reverse items-center mb-16">
                <div className="md:w-1/2 px-4 mb-6 md:mb-0">
                  <h3 className="text-2xl font-semibold mb-4">Level Design Progress</h3>
                  <p className="text-gray-300">
                    The first playable levels were constructed during Sprint 2, implementing our
                    level design philosophy with interconnected rooms, secrets, and progression
                    gates that encourage exploration and backtracking.
                  </p>
                </div>
                <div className="md:w-1/2 px-1">
                  <ParallaxImageReveal 
                    src={allImages.s1["layoutwithkey.png"]} 
                    index={3} 
                    align="left"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-16 w-11/12 max-w-4xl">
              <p className="text-lg text-gray-300">
                In our second sprint, we focused on implementing core gameplay mechanics and systems.
                The foundation of our combat, movement, and ability systems are now in place,
                creating a solid base for the final sprint of development.
              </p>
            </div>
          </section>
        </Element>

        {/* Sprint 3 Section */}
        <Element name="sprint3" className="section">
          <section
            ref={sprint3Ref}
            className="min-h-screen py-24 flex flex-col items-center justify-start bg-gray-800 text-white"
            style={{ position: 'relative' }} 
          >
            <div className="w-full h-16"></div>
            <h2 className="text-6xl font-bold mb-32">
              Sprint 3
            </h2>
            <div 
              className="w-11/12 max-w-6xl mx-auto"
              style={{ position: 'relative' }}
            >
              {/* Row 1: Image Right, Text Left */}
              <div className="flex flex-col md:flex-row items-center mb-24">
                <div className="md:w-1/2 px-4 mb-6 md:mb-0">
                  <h3 className="text-2xl font-semibold mb-4">Final Art Integration</h3>
                  <p className="text-gray-300">
                    Our third sprint saw the integration of final art assets throughout the game.
                    Placeholder graphics were replaced with polished visuals, enhancing the 
                    cyberpunk aesthetic and overall atmosphere.
                  </p>
                </div>
                <div className="md:w-1/2 px-4">
                  <ParallaxImageReveal 
                    src={allImages.s3["bg.png"]} 
                    index={0} 
                    align="right"
                  />
                </div>
              </div>

              {/* Row 2: Image Left, Text Right */}
              <div className="flex flex-col md:flex-row-reverse items-center mb-24">
                <div className="md:w-1/2 px-4 mb-6 md:mb-0">
                  <h3 className="text-2xl font-semibold mb-4">Sound and Music</h3>
                  <p className="text-gray-300">
                    The audio landscape of Necrobotic was completed during Sprint 3, with 
                    original music tracks, ambient sounds, and effect audio that reinforce
                    the game's dark, technological atmosphere.
                  </p>
                </div>
                <div className="md:w-1/2 px-4">
                  <ParallaxImageReveal 
                    src={allImages.s3["uiux.png"]} 
                    index={1} 
                    align="left"
                  />
                </div>
              </div>

              {/* Row 3: Image Right, Text Left */}
              <div className="flex flex-col md:flex-row items-center mb-24">
                <div className="md:w-1/2 px-4 mb-6 md:mb-0">
                  <h3 className="text-2xl font-semibold mb-4">Boss Encounters</h3>
                  <p className="text-gray-300">
                    The major boss encounters were finalized and balanced during this sprint.
                    Each boss presents a unique challenge that tests the player's mastery of
                    the game's mechanics and their acquired abilities.
                  </p>
                </div>
                <div className="md:w-1/2 px-4">
                  <ParallaxImageReveal 
                    src={allImages.s3["sidebysideplayer.jpg"]} 
                    index={2} 
                    align="right"
                  />
                </div>
              </div>

              {/* Row 4: Image Left, Text Right */}
              <div className="flex flex-col md:flex-row-reverse items-center mb-16">
                <div className="md:w-1/2 px-4 mb-6 md:mb-0">
                  <h3 className="text-2xl font-semibold mb-4">Performance Optimization</h3>
                  <p className="text-gray-300">
                    The final sprint included significant performance optimization, ensuring
                    the game runs smoothly across various hardware configurations. This included
                    refining code, optimizing assets, and implementing level streaming.
                  </p>
                </div>
                <div className="md:w-1/2 px-1">
                  <ParallaxImageReveal 
                    src={allImages.s3["layoutwithkey.png"]} 
                    index={3} 
                    align="left"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-16 w-11/12 max-w-4xl">
              <p className="text-lg text-gray-300">
                Our third and final sprint focused on polishing all aspects of the game,
                from visual fidelity to performance optimization. The result is a complete
                and cohesive experience that delivers on our original vision for Necrobotic.
              </p>
            </div>
          </section>
        </Element>

        {/* About Section */}
        <Element name="about" className="section">
          <section className="min-h-screen flex items-center justify-center bg-gray-700 text-white">
            <h2 className="text-4xl font-bold">About Us</h2>
          </section>
        </Element>
      </div>
    </div>
  );
};

export default Home;