import { motion, TargetAndTransition, VariantLabels } from 'framer-motion';
import React from 'react';

interface MotionContainerProps {
  children: React.ReactNode;
  initial?: boolean | TargetAndTransition | VariantLabels;
  animate?: boolean | TargetAndTransition | VariantLabels;
  exit?: TargetAndTransition | VariantLabels;
  transition?: object;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

const MotionContainer: React.FC<MotionContainerProps> = ({
  children,
  initial = "initial",
  animate = "animate",
  exit = "exit",
  transition = pageTransition,
  className
}) => {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      variants={pageVariants}
      transition={transition}
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay }}
    >
        {children}
    </motion.div>
);

export const SlideUp: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        {children}
    </motion.div>
);

export default MotionContainer;
