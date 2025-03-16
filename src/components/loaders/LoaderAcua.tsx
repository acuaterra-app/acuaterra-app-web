import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
const Loader = ({ onFinish }: { onFinish?: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, 1500);
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => { clearTimeout(timer); };
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <motion.img
        alt="Loader"
        animate={{ scale: [1, 1.2, 1] }}
        className="w-24 h-24"
        src="/logo.png" 
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default Loader;