import React from "react";
import { LazyMotion, domAnimation, m as motion } from "framer-motion";

const SpringAnimatedElement = ({ children, className, delay, id, style}: { children: React.ReactNode, className?: string, delay: number, id?: string, style?: React.CSSProperties }) => {
  //use delay to stagger the animation
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: delay },
    }
  }

// Variants for each word.

  const child = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 5,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      x: 20,
      transition: {
        type: "spring",
        damping: 5,
        stiffness: 100,
      },
    },
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <motion.div
        className={`${className}`}
        id={id}
        variants={container}
        initial="hidden"
        animate="visible"
        style={style}
      >
        {//for element in children, create sep div, children can be string or element
        React.Children.map(children, (element, index) => (
          <motion.div
            variants={child}
            key={index}
          >
            {element}
          </motion.div>
        ))}
      </motion.div>
    </LazyMotion>
  );
};

export default SpringAnimatedElement;