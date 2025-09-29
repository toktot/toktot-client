import { useState } from 'react';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { useAuth } from '@/features/auth/context/AuthProvider';

export const useDeleteAccount = () => {
  const { deleteAccount } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleConfirmDelete = async () => {
    try {
      await deleteAccount();
      toast.success('회원 탈퇴가 완료되었습니다.');
      router.push('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '회원 탈퇴에 실패했습니다.');
    } finally {
      closeModal();
    }
  };

  return { isModalOpen, openModal, closeModal, handleConfirmDelete };
};