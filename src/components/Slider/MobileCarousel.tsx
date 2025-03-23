import { useState, useEffect } from "react";
import foto1 from "../../assets/images/fotoAcuapico_1.jpg";
import foto2 from "../../assets/images/fotoAcuapico_2.jpg";
import foto3 from "../../assets/images/fotoAcuapico_3.jpg";
import { ChevronLeft, ChevronRight } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
const MobileCarousel = () => {
  const images = [foto1, foto2, foto3];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((previous) => (previous + 1) % images.length);
    }, 4000);
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => { clearInterval(interval); };
  }, [images.length]);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const nextSlide = () => {
    setCurrent((previous) => (previous + 1) % images.length);
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const previousSlide = () => {
    setCurrent((previous) => (previous - 1 + images.length) % images.length);
  };


  return (
    <div className="relative w-full h-60 sm:h-72 bg-gray-200 overflow-hidden">
      {images.map((image, index) => (
        <img
          key={index}
          alt={`Slide ${index + 1}`}
          src={image}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
         {/* Flechas de navegación */}
      <button
        className="absolute left-2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100"
        onClick={previousSlide}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        className="absolute right-2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100"
        onClick={nextSlide}
      >
        <ChevronRight size={24} />
      </button>







    </div>
  );
};

export default MobileCarousel;
