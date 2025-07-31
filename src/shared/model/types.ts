export type Brand<K, T> = K & { __brand: T };

// --- Entity ID Types ---

// user.id는 mockUser에서 number 타입입니다.
export type UserId = Brand<number, 'UserId'>;
export type StoreId = Brand<string, 'StoreId'>;
export type MoodKeywordId = Brand<number, 'MoodKeywordId'>;

// --- Review Context ID Types ---
export type ReviewId = Brand<string, 'ReviewId'>;
export type ReviewImageId = Brand<string, 'ReviewImageId'>;
export type TooltipId = Brand<string, 'TooltipId'>;

// --- Menu Context ID Types ---
export type MenuItemId = Brand<string, 'MenuItemId'>;
