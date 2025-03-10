import type React from 'react';
import './Loader.css';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;