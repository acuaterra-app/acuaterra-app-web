import type React from "react";
// eslint-disable-next-line no-duplicate-imports
import { useState, useEffect } from "react";

interface SliderProps {
  images: Array<string>;
  interval?: number; // Tiempo en milisegundos entre cambios
}

const Slider: React.FC<SliderProps> = ({ images, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const previousSlide = () => {
    setCurrentIndex((previousIndex) => (previousIndex - 1 + images.length) % images.length);
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const nextSlide = () => {
    setCurrentIndex((previousIndex) => (previousIndex + 1) % images.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((previousIndex) => (previousIndex + 1) % images.length);
    }, interval);
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => { clearInterval(timer); };
  }, [images.length, interval]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-r">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          } flex justify-center items-center`}
        >
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-lg">
            <img
              alt={`Slide ${index + 1}`}
              className="w-full h-auto object-contain"
              src={image}
            />
          </div>
        </div>
      ))}

      {/* Flecha Izquierda */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-50">
        <button
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition"
          onClick={previousSlide}
        >
          <svg
            className="h-6 w-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </button>
      </div>

      {/* Flecha Derecha */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-50">
        <button
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition"
          onClick={nextSlide}
        >
          <svg
            className="h-6 w-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </button>
      </div>

      {/* Navegación con puntos */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-50">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-4 h-4 rounded-full transition transform hover:scale-125 ${
              index === currentIndex ? "bg-white" : "bg-gray-300"
            }`}
            onClick={() => { setCurrentIndex(index); }}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
