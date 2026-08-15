"use client";

import { useAppDispatch, useAppSelector } from "./hooks";
import {
  userApi,
  useRequestLoginOtpMutation,
  useLoginWithOtpMutation,
  useRegisterMutation,
  useRequestSignupOtpMutation,
  useUpgradeInfluencerMutation,
  useUpdateProfileMutation,
  useGetMeQuery,
} from "./userApi";
import { setCredentials, clearAuth, USER_TOKEN_KEY, SHIPPING_STORAGE_KEY } from "./userAuthSlice";

export function useUserAuth() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.userAuth.token);
  const storedUser = useAppSelector((s) => s.userAuth.user);
  const hydrated = useAppSelector((s) => s.userAuth.hydrated);

  const [requestLoginOtpMutation, { isLoading: requestingLoginOtp }] = useRequestLoginOtpMutation();
  const [loginWithOtpMutation, { isLoading: loggingIn }] = useLoginWithOtpMutation();
  const [registerMutation, { isLoading: registering }] = useRegisterMutation();
  const [requestSignupOtpMutation, { isLoading: requestingSignupOtp }] =
    useRequestSignupOtpMutation();
  const [upgradeInfluencerMutation, { isLoading: upgradingInfluencer }] =
    useUpgradeInfluencerMutation();
  const [updateProfileMutation, { isLoading: updatingProfile }] = useUpdateProfileMutation();
  const { data: meData, isLoading: meLoading } = useGetMeQuery(undefined, { skip: !token });

  const user = meData?.user ?? storedUser;
  const loading = !hydrated || (Boolean(token) && meLoading);

  // Customer signin is OTP-only, mirroring signup: request a code, then
  // verify it to actually get a token.
  const requestLoginOtp = async (email: string) => {
    await requestLoginOtpMutation({ email }).unwrap();
  };

  // Every cached query (getMe, saved products, orders, referral codes...)
  // is keyed independently of the auth token, so RTK Query has no way to
  // know a login/logout means "this is a different person now" — without
  // this reset, whichever of those queries happened to be cached from a
  // previous session would keep being served under the new one, which is
  // exactly what made logout look broken (the token/user cleared, but a
  // stale getMe result kept `user` populated) and let one account's data
  // bleed into the next sign-in in the same tab.
  const loginWithOtp = async (email: string, otpCode: string) => {
    dispatch(userApi.util.resetApiState());
    const res = await loginWithOtpMutation({ email, otpCode }).unwrap();
    localStorage.setItem(USER_TOKEN_KEY, res.token);
    dispatch(setCredentials(res));
    return res.user;
  };

  const requestSignupOtp = async (email: string) => {
    await requestSignupOtpMutation({ email }).unwrap();
  };

  const register = async (input: {
    email: string;
    firstName: string;
    lastName: string;
    country?: string;
    referralCode?: string;
    otpCode: string;
  }) => {
    dispatch(userApi.util.resetApiState());
    const res = await registerMutation(input).unwrap();
    localStorage.setItem(USER_TOKEN_KEY, res.token);
    dispatch(setCredentials(res));
    return res.user;
  };

  const upgradeInfluencer = async (input: {
    codeName: string;
    twitterHandle?: string;
    instagramHandle?: string;
    tiktokHandle?: string;
    bio?: string;
  }) => {
    const res = await upgradeInfluencerMutation(input).unwrap();
    localStorage.setItem(USER_TOKEN_KEY, res.token);
    dispatch(setCredentials(res));
    dispatch(userApi.util.resetApiState());
    return res.user;
  };

  const updateProfile = async (input: {
    firstName?: string;
    lastName?: string;
    email?: string;
    country?: string;
  }) => {
    const res = await updateProfileMutation(input).unwrap();
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem(USER_TOKEN_KEY);
    localStorage.removeItem(SHIPPING_STORAGE_KEY);
    dispatch(clearAuth());
    dispatch(userApi.util.resetApiState());
  };

  return {
    user: user ?? null,
    token,
    loading,
    requestLoginOtp,
    requestingLoginOtp,
    loginWithOtp,
    loggingIn,
    register,
    registering,
    requestSignupOtp,
    requestingSignupOtp,
    upgradeInfluencer,
    upgradingInfluencer,
    updateProfile,
    updatingProfile,
    logout,
  };
}
