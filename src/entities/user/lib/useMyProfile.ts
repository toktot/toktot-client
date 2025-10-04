'use client';
import { useEffect, useState } from 'react';
import { getMyProfile } from '../api/api';
import { UserProfileServer } from '../api/schema';

export const useMyProfile = () => {
  const [profile, setProfile] = useState<UserProfileServer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMyProfile();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '프로필 조회 중 오류 발생');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return { profile, isLoading, error };
};
