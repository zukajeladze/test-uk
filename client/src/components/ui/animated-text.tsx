import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

type AnimationType = 
  | "whipInUp" 
  | "calmInUp" 
  | "fadeIn" 
  | "popIn" 
  | "slideInLeft" 
  | "slideInRight"
  | "bounceIn"
  | "scaleIn";

interface AnimatedTextProps {
  children: string | ReactNode;
  animation?: AnimationType;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}

const animationVariants: Record<AnimationType, Variants> = {
  whipInUp: {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },
  calmInUp: {
    hidden: { 
      opacity: 0, 
      y: 10 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },
  fadeIn: {
    hidden: { 
      opacity: 0 
    },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },
  popIn: {
    hidden: { 
      opacity: 0, 
      scale: 0.8 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },
  slideInLeft: {
    hidden: { 
      opacity: 0, 
      x: -30 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },
  slideInRight: {
    hidden: { 
      opacity: 0, 
      x: 30 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },
  bounceIn: {
    hidden: { 
      opacity: 0, 
      scale: 0.3 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.68, -0.55, 0.265, 1.55]
      }
    }
  },
  scaleIn: {
    hidden: { 
      opacity: 0, 
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }
};

export function AnimatedText({ 
  children, 
  animation = "calmInUp", 
  className = "",
  delay = 0,
  stagger = 0.05,
  duration,
  as: Component = "div"
}: AnimatedTextProps) {
  const variants = animationVariants[animation];
  
  // If duration is provided, override the default duration
  if (duration && variants.visible && typeof variants.visible === 'object' && variants.visible.transition) {
    variants.visible.transition.duration = duration;
  }

  // Handle string children for character-by-character animation
  if (typeof children === "string") {
    const characters = children.split("");
    
    return (
      <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: stagger,
              delayChildren: delay
            }
          }
        }}
      >
        {characters.map((char, index) => (
          <motion.span
            key={index}
            variants={variants}
            style={{ display: "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  // Handle ReactNode children
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

// Specialized components for common use cases
export function AnimatedHeading({ 
  children, 
  className = "", 
  level = 1,
  animation = "whipInUp",
  delay = 0 
}: {
  children: string;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  animation?: AnimationType;
  delay?: number;
}) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <AnimatedText 
      as={Component}
      animation={animation}
      className={className}
      delay={delay}
      stagger={0.03}
    >
      {children}
    </AnimatedText>
  );
}

export function StaggeredList({ 
  children, 
  className = "",
  stagger = 0.1,
  delay = 0 
}: {
  children: ReactNode[];
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay
          }
        }
      }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={animationVariants.calmInUp}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
