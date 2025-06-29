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

  // 우측 모두가 1인 경우 → 해당 인덱스 포함 오른쪽 전부 0으로 초기화
  if (isRightAllFull) {
    for (let i = index; i < newRating.length; i++) {
      newRating[i] = 0;
    }
  } else {
    // 아니면 해당 별 하나만 순환 (0 → 0.5 → 1 → 0)
    const next = current === 0 ? 0.5 : current === 0.5 ? 1 : 0;
    newRating[index] = next;
  }

  onChange(newRating);
};


        return (
    <div className="flex gap-1">
      {rating.map((value, index) => {
        const icon = value === 1 ? full : value === 0.5 ? half : empty;

        return (
          <div
            key={index}
            className={`cursor-pointer w-[${pixelSize}px] h-[${pixelSize}px]`}
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
