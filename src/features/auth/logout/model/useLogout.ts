import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { useAuth } from '@/features/auth/context/AuthProvider';

export const useLogout = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openLogoutModal = () => setIsModalOpen(true);
  const closeLogoutModal = () => setIsModalOpen(false);

  const handleConfirmLogout = async () => {
    try {
      await logout();
      toast.success('로그아웃 되었습니다.');
      router.push('/login');
    } catch {
      toast.error('로그아웃 실패, 다시 시도해주세요.');
    } finally {
      closeLogoutModal();
    }
  };

  return { isModalOpen, openLogoutModal, closeLogoutModal, handleConfirmLogout };
};