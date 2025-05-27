/**
 * @public
 * @category 위치 정보
 * @name LocationCoords
 * @description 세부 위치 정보를 나타내는 객체예요.
 */
export interface LocationCoords {
	/**
	 * 위도
	 */
	latitude: number;
	/**
	 * 경도
	 */
	longitude: number;
	/**
	 * 높이
	 */
	altitude: number;
	/**
	 * 위치 정확도
	 */
	accuracy: number;
	/**
	 * 고도 정확도
	 */
	altitudeAccuracy: number;
	/**
	 * 방향
	 */
	heading: number;
}

/**
 * @public
 * @category 위치 정보
 * @name Location
 * @description 위치 정보를 나타내는 객체예요.
 */
export type Location = {
	timestamp: number;
	coords: Pick<
		GeolocationCoordinates,
		| 'latitude'
		| 'longitude'
		| 'altitude'
		| 'accuracy'
		| 'altitudeAccuracy'
		| 'heading'
	>;
};

/**
 * @public
 * @category 위치 정보
 * @name GetCurrentLocationOptions
 * @description 현재 위치를 가져오는 옵션을 나타내는 객체예요.
 */
export interface GetCurrentLocationOptions {
	enableHighAccuracy: boolean;
	maximumAge: number;
	timeout: number;
}

/**
 * @public
 * @category 위치 정보
 * @name GetCurrentLocationOptions
 * @description 현재 위치를 가져오는 옵션을 나타내는 객체예요.
 */
export interface GetCurrentLocationOptions {
	/**
	 * 위치 정확도를 높이기 위해 사용하는 옵션이에요.
	 */
	enableHighAccuracy: boolean;
	/**
	 * 위치 정보를 캐시에서 가져오는 최대 시간을 설정해요.
	 */
	maximumAge: number;
	/**
	 * 위치 정보를 가져오는 최대 시간을 설정해요.
	 */
	timeout: number;
}
