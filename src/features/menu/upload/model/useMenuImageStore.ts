'use client';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface UploadedImage {
	id: string;
	file: File;
	previewUrl: string;
}

interface MenuImageState {
	images: UploadedImage[];
	isUploading: boolean;
}

interface MenuImageActions {
	addImages: (files: File[]) => void;
	removeImage: (id: string) => void;
	setIsUploading: (status: boolean) => void;
	reset: () => void;
}

const initialState: MenuImageState = {
	images: [],
	isUploading: false,
};

export const useMenuImageStore = create<MenuImageState & MenuImageActions>()(
	immer((set) => ({
		...initialState,
		addImages: (files) =>
			set((state) => {
				const newImages = files.map((file) => ({
					id: crypto.randomUUID(),
					file,
					previewUrl: URL.createObjectURL(file),
				}));
				state.images.push(...newImages);
			}),
		removeImage: (id) =>
			set((state) => {
				state.images = state.images.filter((img) => {
					if (img.id === id) {
						URL.revokeObjectURL(img.previewUrl);
						return false;
					}
					return true;
				});
			}),
		setIsUploading: (status) => set({ isUploading: status }),
		reset: () => set(initialState),
	})),
);
