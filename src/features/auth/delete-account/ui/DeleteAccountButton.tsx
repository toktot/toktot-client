'use client';

import { AnimatePresence } from 'framer-motion';

import { ConfirmModal } from '@/features/report/ui/ConfirmModal';
import Icon from '@/shared/ui/Icon';

import { useDeleteAccount } from '../model/useDeleteAccount';

export const DeleteAccountButton = () => {
  const { isModalOpen, openModal, closeModal, handleConfirmDelete } = useDeleteAccount();

  return (
    <>
      <div className="mt-6 bg-white rounded-lg border border-sub-red-20">
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-sub-red-30">계정 관리</h3>
        </div>
        <div className="border-t border-sub-red-20">
          <div
            onClick={openModal}
            className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-sub-red-10"
          >
            <span className="font-medium text-sub-red-30">회원 탈퇴</span>
            <Icon name={'ArrowRight'} className="text-sub-red-30" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <ConfirmModal
            onClose={closeModal}
            onConfirm={handleConfirmDelete}
            title="정말로 탈퇴하시겠습니까?"
            confirmLabel="탈퇴"
            cancelLabel="취소"
          />
        )}
      </AnimatePresence>
    </>
  );
};