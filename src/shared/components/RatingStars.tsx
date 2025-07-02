// shared/components/RatingStars.tsx

import Image from "next/image";

export const MAX_RATING = 5;

type RatingStarsProps = {
  rating: (0 | 0.5 | 1)[];
  onChange: (value: (0 | 0.5 | 1)[]) => void;
  category: "음식" | "서비스" | "청결";
  maxRating? : number;
  size?: "default" | "large";
};

const getIconPaths = (category : string) => {
  switch (category) {
    case "음식":
      return {
        full : "/ClickRatingFood.svg",
        half : "/HalfRatingFood.svg",
        empty : "/NonClickRatingFood.svg",
      };
    case "서비스":
      return {
        full : "/ClickRatingService.svg",
        half : "/HalfRatingService.svg",
        empty: "/NonClickRatingService.svg"
      };
    case "청결":
      return {
        full : "/ClickRatingClean.svg",
        half : "/HalfRatingClean.svg",
        empty : "/NonClickRatingClean.svg",
      };
    default:
      return {
        full: "", half : "", empty : ""
      }
  }
}

const RatingStars = ({ rating, onChange, category, size = "default", }: RatingStarsProps) => {
  const {full, half,empty} = getIconPaths(category);

  const pixelSize = size === "large" ? 24 : 12;
  const handleClick = (index: number) => {
  const newRating = [...rating];
  const current = newRating[index];

  const isRightAllFull = newRating
    .slice(index)
    .every((val) => val === 1);
  console.log(isRightAllFull);

  const isLeftFull = index === 0 || newRating[index -1 ] === 1;

  if (!isLeftFull && current === 0) {
    return;
  }

  const isLastFilledIndex = newRating.lastIndexOf(1);
  const isOnlyRightCanDelete = index === isLastFilledIndex;

  if (current === 0) {
    newRating[index] = 0.5;
  } else if (current === 0.5) {
    newRating[index] = 1;
  } else {
    if (!isOnlyRightCanDelete) return;
    newRating[index] = 0;
  }

  for (let i = index + 1; i < newRating.length; i++) {
    newRating[i] = 0;
  }

  onChange(newRating);
};


    return (
    <div className="flex flex-row gap-1 items-center">
      {rating.map((value, index) => {
        const icon = value === 1 ? full : value === 0.5 ? half : empty;

        return (
          <div
            key={index}
            className="cursor-pointer"
            style={{width : pixelSize, height : pixelSize}}
            onClick={() => handleClick(index)}
          >
            <Image
              src={icon}
              alt={`rating-star-${index}`}
              width={pixelSize}
              height={pixelSize}
            />
          </div>
        );
      })}
    </div>
  );
};
export default RatingStars;
