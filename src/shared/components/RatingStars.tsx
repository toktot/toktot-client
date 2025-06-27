// shared/components/RatingStars.tsx

import Image from "next/image";

export const MAX_RATING = 5;

type RatingStarsProps = {
  rating: number;
  onChange: (value: number) => void;
  category: "음식" | "서비스" | "청결";
  maxRating? : number;
};

const getIconPaths = (category : string) => {
  switch (category) {
    case "음식":
      return {
        active : "/ClickRatingFood.svg",
        inactive: "/NonClickRatingFood.svg",
      };
    case "서비스":
      return {
        active : "/ClickRatingService.svg",
        inactive : "/NonClickRatingService.svg",
      };
    case "청결":
      return {
        active : "/ClickRatingClean.svg",
        inactive : "/NonClickRatingClean.svg",
      };
    default:
      return {
        active: "",
        inactive : "",
      }
  }
}

const RatingStars = ({ rating, onChange, category, maxRating = MAX_RATING }: RatingStarsProps) => {
  const {active, inactive} = getIconPaths(category);

  const handleClick = (star: number) => {
    if (rating === star) {
      onChange(star - 0.5);
    } else if (star === rating - 0.5) {
      onChange(star - 1);
    } else {
      onChange(star);
    }
  }

  return (
    <div className="flex flex-row gap-6 h-[40px]" style= {{width : `${maxRating * 40 + (maxRating -1) * 24}px`}}>
      {Array.from({length: maxRating}, (_, i) => {
        const star = i + 1;
        const isFull = rating >= star;
        const isHalf = rating + 0.5 === star;
        return (
          <div
            key={star}
            className="w-[40px] h-[40px] cursor-pointer"
            onClick={() => handleClick(star)}
          >
            <Image
              src={isFull || isHalf ? active: inactive}
              alt={`rating-star-${star}`}
              width={40}
              height={40}
            />
          </div>
        )
      })}        
    </div>
  );
};

export default RatingStars;
