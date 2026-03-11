import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import UserContext from '@/contexts/UserContext';

type UserContextValue = NonNullable<React.ContextType<typeof UserContext>>;

const defaultUserContext: UserContextValue = {
  profile: null,
  isLoading: false,
  isAdmin: false,
  isManager: false,
  isOperator: false,
  isShipCrew: false,
  isVeterinarian: false,
  isQA: false,
  isFinance: false,
  isViewer: false,
  hasHealthAccess: true,
  hasOperationalAccess: true,
  hasTreatmentEditAccess: false,
  hasFinanceAccess: false,
  hasTransportExecutionAccess: false,
  hasLocationAssignments: false,
  hasAreaAccess: () => true,
  hasStationAccess: () => true,
  hasContainerAccess: () => true,
  isAllGeographies: true,
  isScotland: false,
  isFaroeIslands: false,
  isAllSubsidiaries: true,
  isBroodstock: false,
  isFreshwater: false,
  isFarming: false,
  isLogistics: false,
};

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

export function createMockUserContext(
  overrides: Partial<UserContextValue> = {}
): UserContextValue {
  return {
    ...defaultUserContext,
    ...overrides,
  };
}

export function createAppTestWrapper(options?: {
  queryClient?: QueryClient;
  userContext?: Partial<UserContextValue>;
}) {
  const queryClient = options?.queryClient ?? createTestQueryClient();
  const userContext = createMockUserContext(options?.userContext);

  return function Wrapper({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={userContext}>
          {children}
        </UserContext.Provider>
      </QueryClientProvider>
    );
  };
}

export function renderWithAppProviders(
  ui: React.ReactElement,
  options?: RenderOptions & {
    queryClient?: QueryClient;
    userContext?: Partial<UserContextValue>;
  }
) {
  const { queryClient, userContext, ...renderOptions } = options || {};
  return render(ui, {
    wrapper: createAppTestWrapper({ queryClient, userContext }),
    ...renderOptions,
  });
}
