import * as React from "react";
import { motion, type Variants } from "framer-motion";

/**
 * Section entrance: the heading, then the text, then the picture, each
 * rising a little with opacity, once, as the section enters. Children opt in
 * with <RevealItem>. With reduced motion, MotionConfig keeps only the fade.
 */
const group: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.075, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

type Props = React.ComponentProps<typeof motion.div> & { amount?: number };

export function Reveal({ amount = 0.2, children, ...props }: Props) {
  return (
    <motion.div initial="hidden" whileInView="shown" viewport={{ once: true, amount }} variants={group} {...props}>
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, ...props }: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div variants={item} {...props}>
      {children}
    </motion.div>
  );
}
