"use client";

import {useState} from "react";
import {useSwipeable} from "react-swipeable";

interface ReviewSwiperProps {
    images: string[];
}
const ReviewSwiper = ({images} : ReviewSwiperProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlers = useSwipeable({
        onSwipedLeft : () => handleNext(),
        onSwipedRight : () => handlePrev(),
    })
    const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div {...handlers} style={{ overflow: "hidden", width: "300px" }}>
      <div
        style={{
          display: "flex",
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Review ${index}`}
            style={{ width: "300px", height: "200px", objectFit: "cover" }}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewSwiper;
