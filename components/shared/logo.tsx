import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  const containerVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.3 },
    },
  };

  const letterVariants = {
    hover: (i: number) => ({
      y: [-5, 5, -5],
      color: ["#25d366", "#2a92c1", "#25d366"], // Green to Deep Blue to Green
      transition: {
        y: {
          repeat: Infinity,
          duration: 0.5,
          ease: "easeInOut",
          delay: i * 0.1,
        },
        color: {
          repeat: Infinity,
          duration: 1,
          ease: "easeInOut",
          delay: i * 0.1,
        },
      },
    }),
  };

  return (
    <motion.p
      className={cn(
        "text-center text-3xl font-bold text-light-green uppercase cursor-pointer",
        className
      )}
      variants={containerVariants}
      whileHover="hover"
    >
      {"Chat".split("").map((char, index) => (
        <motion.span key={index} variants={letterVariants} custom={index}>
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
};

export default Logo;
