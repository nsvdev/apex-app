import { createSelector } from 'reselect';

export const token = createSelector(
  (state: any) => state.auth.token,
  (token) => token
);

export const profileSelector = createSelector(
  (state: any) => state.user,
  (user) => ({
    user
  })
);

// Loading
export const loadingSelector = createSelector(
  (state: any) => state.user,
  (state: any) => state.onboarding.showOnboarding,
  (user, showOnboarding) => ({
    user,
    showOnboarding
  })
);

// Auth
export const authSelector = createSelector(
  (state: any) => state.auth,
  (auth) => ({
    auth
  })
);

// Onboarding
export const onboardingSelector = createSelector(
  (state: any) => state.onboarding.data,
  (onboardingData) => ({
    onboardingData
  })
);

// Services
export const servicesSelector = createSelector(
  (state: any) => state.services,
  (state: any) => state.penalty,
  (state: any) => state.auth.token,
  (services, penalty, token) => ({
    services,
    penalty,
    token
  })
);


export const penaltyCreationSelector = createSelector(
  (state: any) => state.penalty,
  (state: any) => state.auth,
  (state: any) => state.user,
  (penalty, auth, user) => ({
    penalty,
    auth,
    user
  })
);

// Мойи дела
export const applicationsSelector = createSelector(
  (state: any) => state.personalArea.applications,
  (applications) => ({
    applications
  })
);

// Личный кабинет
export const personalAreaSelector = createSelector(
  (state: any) => state.personalArea.applications,
  (state: any) => state.auth,
  (state: any) => state.personalArea.isCasesFetching,
  (applications, auth, isCasesFetching) => ({
    applications,
    auth,
    isCasesFetching
  })
);