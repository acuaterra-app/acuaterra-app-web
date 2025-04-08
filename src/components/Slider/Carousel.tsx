"use client";

import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useId, memo } from "react";

interface SlideData {
  title: string;
  button: string;
  src: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const Slide = memo(({ slide, index, current, handleSlideClick }: SlideProps) => {
  const { src, title } = slide;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[70vmin] h-[70vmin] mx-[4vmin] z-10"
        style={{
          transform:
            current !== index
              ? "scale(0.98) rotateX(8deg)"
              : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
        onClick={() => { handleSlideClick(index); }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-[1%] overflow-hidden transition-all duration-150 ease-out"
        >
          <img
            alt={title}
            className="absolute inset-0 w-[120%] h-[120%] object-cover opacity-100 transition-opacity duration-600 ease-in-out"
            decoding="async"
            loading="lazy"
            src={src}
            style={{
              opacity: current === index ? 1 : 0.5,
            }}
          />
          {current === index && (
            <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />
          )}
        </div>

        <article
          className={`relative p-[4vmin] transition-opacity duration-1000 ease-in-out ${
            current === index ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <h2 className="text-lg md:text-2xl lg:text-4xl font-semibold relative">
            {title}
          </h2>
        </article>
      </li>
    </div>
  );
});

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = memo(
  ({ type, title, handleClick }: CarouselControlProps) => {
    return (
      <button
        title={title}
        className={`w-10 h-10 flex items-center mx-2 justify-center bg-neutral-200 dark:bg-neutral-800 border-3 border-transparent rounded-full focus:border-[#6D64F7] focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ${
          type === "previous" ? "rotate-180" : ""
        }`}
        onClick={handleClick}
      >
        <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200" />
      </button>
    );
  }
);

interface CarouselProps {
  slides: Array<SlideData>;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handlePreviousClick = () => {
    setCurrent((previous) => (previous - 1 + slides.length) % slides.length);
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleNextClick = () => {
    setCurrent((previous) => (previous + 1) % slides.length);
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  const id = useId();

  return (
    <div
      aria-labelledby={`carousel-heading-${id}`}
      className="relative w-[70vmin] h-[70vmin] mx-auto"
    >
      <ul
        className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${current * (100 / slides.length)}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            current={current}
            handleSlideClick={handleSlideClick}
            index={index}
            slide={slide}
          />
        ))}
      </ul>

      <div className="absolute flex justify-center w-full top-[calc(100%+1rem)]">
        <CarouselControl
          handleClick={handlePreviousClick}
          title="Go to previous slide"
          type="previous"
        />

        <CarouselControl
          handleClick={handleNextClick}
          title="Go to next slide"
          type="next"
        />
      </div>
    </div>
  );
}