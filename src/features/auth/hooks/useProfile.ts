import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  profileService,
  type ChangePasswordRequest,
  type EditProfileRequest,
} from "@/features/auth/services/profileService";

export const PROFILE_QUERY_KEY = ["user-profile"] as const;

export const useProfile = (userToken?: string | null, enabled = true) => {
  return useQuery({
    queryKey: [...PROFILE_QUERY_KEY, userToken ?? ""],
    queryFn: () => profileService.getProfile(userToken),
    enabled: enabled && !!userToken,
    retry: false,
    staleTime: 60_000,
  });
};

export const useEditProfile = (userToken?: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditProfileRequest) =>
      profileService.editProfile(data, userToken),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
};

export const useDeleteAccount = (userToken?: string | null) => {
  return useMutation({
    mutationFn: () => profileService.deleteAccount(userToken),
  });
};

export const useChangePassword = (userToken?: string | null) => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      profileService.changePassword(data, userToken),
  });
};
