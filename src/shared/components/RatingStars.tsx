// shared/components/RatingStars.tsx

import Image from "next/image";

type RatingStarsProps = {
  rating: number;
  onChange: (value: number) => void;
  category: "음식" | "서비스" | "청결";
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

const RatingStars = ({ rating, onChange, category }: RatingStarsProps) => {
  const {active, inactive} = getIconPaths(category);

  const handleClick = (star: number) => {
    if (rating === star) {
      onChange(Math.max(0, star-1));
    } else if (star > rating) {
      onChange(star);
    }
  }

  return (
    <div className="flex gap-6 w-[296px] h-[40px]">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = rating >= star;
        return (
          <div
            key={star}
            className="w-[40px] h-[40px] cursor-pointer"
            onClick={() => handleClick(star)}
          >
            <Image
              src={isActive ? active: inactive}
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
