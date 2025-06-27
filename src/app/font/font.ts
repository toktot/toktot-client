import localFont from 'next/font/local';

export const pretendard = localFont({
  src: [
    {
      path: './Pretendard-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: "./Pretendard-Medium.otf",
      weight : "500",
      style : "normal",
    },
    {
      path : "./Pretendard-SemiBold.otf",
      weight : "600",
      style : "normal",
    },
  ],
  display: 'swap',
  variable: '--font-pretendard',
});

export const manrope = localFont({
  src: [
    {
      path: './Manrope-Regular.ttf',
      weight: '400',
      style: "normal",
    },
    {
      path : "./Manrope-Medium.ttf",
      weight : "500",
      style: 'normal'
    },
    {
      path : "./Manrope-SemiBold.ttf",
      weight : "600",
      style : "normal",
    },
  ],
  display: 'swap',
  variable: '--font-manrope',
});
