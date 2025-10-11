import type { HTTPError, TimeoutError } from 'ky';

export type Brand<K, T> = K & { __brand: T };

// --- Entity ID Types ---

// user.id는 mockUser에서 number 타입입니다.
export type UserId = Brand<number, 'UserId'>;
export type StoreId = Brand<string, 'StoreId'>;
export type MoodKeywordId = Brand<number, 'MoodKeywordId'>;
export type KeywordId = Brand<number, 'KeywordId'>;

// --- Review Context ID Types ---
export type ReviewId = Brand<string, 'ReviewId'>;
export type ReviewImageId = Brand<string, 'ReviewImageId'>;
export type TooltipId = Brand<string, 'TooltipId'>;
export type ReviewFolderId = Brand<string, 'ReviewFolderId'>;

// --- Menu Context ID Types ---
export type MenuItemId = Brand<string, 'MenuItemId'>;

export type ApiError = HTTPError | TimeoutError | Error;

export const isHTTPError = (err: unknown): err is HTTPError =>
	err instanceof Error && 'response' in err;

export const isTimeoutError = (err: unknown): err is TimeoutError =>
	err instanceof Error && err.name === 'TimeoutError';
