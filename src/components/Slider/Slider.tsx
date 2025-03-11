import type React from "react";
// eslint-disable-next-line no-duplicate-imports
import { useState, useEffect } from "react";

interface SliderProps {
  images: Array<string>;
  interval?: number; // Tiempo en milisegundos entre cambios
}

const Slider: React.FC<SliderProps> = ({ images, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((previousIndex) => (previousIndex + 1) % images.length);
    }, interval);

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => { clearInterval(timer); };
  }, [images.length, interval]);

  return (
    <div className="relative w-full h-full">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          } flex justify-center items-center`}
        >
         <img
         alt={`Slide ${index + 1}`}
         className="w-full h-auto object-contain rounded-lg border border-gray-800 shadow-lg"
         src={image}
         />
        </div>
      ))}

      {/* Navegación con puntos */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
            onClick={() => { setCurrentIndex(index); }}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
