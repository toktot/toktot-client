module.exports = {
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development', // 개발 환경에서 PWA 비활성화
    register: true,
    skipWaiting: true,
  },
};
