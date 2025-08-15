export class ApiError extends Error {
	public readonly errorCode?: string;

	constructor(message: string, errorCode?: string) {
		super(message);
		this.name = 'ApiError';
		this.errorCode = errorCode;
	}
}
