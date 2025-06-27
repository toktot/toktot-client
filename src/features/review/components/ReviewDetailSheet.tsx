"use client";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import classNames from "classnames"; // 꼭 설치돼 있어야 함: npm install classnames
import { useState, useEffect } from "react";
import TextInputWithLabel from "@/shared/components/TextInputWithLabel";
import RatingStars from "@/shared/components/RatingStars";
import PrimaryButton from "@/shared/components/PrimaryButton";
import CharacterCountInput from "@/features/review/components/CharacterCountInput";
import CategorySelector from "@/features/review/components/CategorySelector";
import QuantitySelector from "@/features/review/components/QuantitySelector";
const ReviewSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  count: z.coerce.number().min(1, "수량은 1이상이어야 합니다."),
  price: z.string().min(1, "가격을 입력해주세요."),
})
type ReviewForm = z.infer<typeof ReviewSchema>;
const ReviewDetailSheet = () => {
  const [step, setStep] = useState<"select" | "detail">("select");
  const [category, setCategory] = useState<"음식" | "서비스" | "청결">("음식");
  const [rating, setRating] = useState(0);
  const [detail, setDetail] = useState("");

  useEffect(() => {
    setRating(0);
  }, [category]);
  const {
    control,
    handleSubmit,
    formState: {isValid},
    getValues,
  } = useForm<ReviewForm>({
    resolver: zodResolver(ReviewSchema),
    mode: "onChange",
    defaultValues : {
      name: "",
      count : 1,
      price:"",
    }
  })

  const handleNext = (data: ReviewForm) => {
    if (rating === 0) return;
    console.log("폼 데이터:", data);
    setStep("detail");
  };
  const handleRegister = () => {
    console.log("리뷰 등록됨", {
      ...getValues(),
      category,
      rating,
      detail,
    })
  }

  return (
    <div className="space-y-4">
      {step === "select" && (
        <>
          <CategorySelector selected={category} onSelect={setCategory} />
          {category === "음식" && (
            <form onSubmit={handleSubmit(handleNext)} className="space-y-4">
              <div className="flex items-center gap-x-2">
              <Controller
                name="name"
                control = {control}
                render={({field}) => (
                  <TextInputWithLabel
                    {...field}
                    placeholder="음식을 입력하세요."
                    inputClassName={classNames(
                      "w-[296px] h-[62px] px-[20px] pt-[17px] rounded-[10px] bg-[#F6F9FB] font-pretendard font-semi-bold text-[20px] leading-[140%] tracking-[-2.5%]",
                      field.value
                      ? "text-[#171D29]"
                      : "text-[#38DEFF] border-[#38DEFF]"
                    )}
                  />         
                )}
              />
              <span className="text-[20px] font-medium">은/는</span>
            </div>
            <div className="flex items-center gap-x-2">
              <Controller
              name="count"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-x-2">
              <QuantitySelector
              value={field.value}
              onChange={field.onChange}
            />
              <span className="text-[20px] font-medium">인분으로</span>
    </div> 
  )}
/>
</div>
                         
              <Controller
                name="price"
                control={control}
                render={({field}) => (
                  <TextInputWithLabel
                    type="number"
                    {...field}
                    placeholder="가격을 입력하세요"
                    inputClassName={classNames(
                      "w-[296px] h-[120px] px-[20px] py-[17px] rounded-[10px] bg-[#F6F9FB] font-pretendard font-semibold text-[20px] leading-[140%] tracking-[-2.5%]",
                      field.value
                      ? "text-[#171D29]"
                      : "text-[#38DEFF] border-[#38DEFF]"
                    )}
                      />
                    )}
              />
              원이에요.

          <div>
            <p className="font-medium mb-1">별점</p>
            <RatingStars rating={rating} onChange={setRating} category={category} />
          </div>

          <PrimaryButton
            text="다음"
            type="submit"
            disabled={!isValid || rating=== 0}
          />
        </form>
      )}

      {category !== "음식" && (
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-1">별점</p>
            <RatingStars rating={rating} onChange={setRating} category={category} />
          </div>
          <PrimaryButton
            text="다음"
            onClick={() => {
              if (rating === 0) return;
              setStep("detail");
            }}
            disabled={rating === 0}
            />
            </div>
      )}
      </>
  )};

      {step === "detail" && (
  <div className="space-y-4">
    <CharacterCountInput
      value={detail}
      maxLength={100}
      onChange={setDetail}
      placeholder="상세 리뷰를 입력해주세요"
    />
    <PrimaryButton
      text="등록"
      onClick={handleRegister}
      disabled={detail.trim().length === 0 || detail.length > 100}
    />
  </div>
)}

    </div>
  );
};

export default ReviewDetailSheet;