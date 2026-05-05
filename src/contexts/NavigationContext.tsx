import { createContext, useContext, useState, ReactNode } from 'react';

type Route = 'home' | 'groups' | 'group-details' | 'payment-flow' | 'payment' | 'profile' | 'notifications' | 'edit-profile' | 'security' | 'group-action' | 'create-group' | 'join-group' | 'payment-drawer' | 'payment-success';

interface NavigationState {
  currentRoute: Route;
  activeGroupId?: string;
  navigate: (route: Route, params?: { groupId?: string }) => void;
  goBackTo?: Route;
}

export const NavigationContext = createContext<NavigationState | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');
  const [activeGroupId, setActiveGroupId] = useState<string>();
  const [goBackTo, setGoBackTo] = useState<Route | undefined>();

  const navigate = (route: Route, params?: { groupId?: string, goBackTo?: Route }) => {
    setCurrentRoute(route);
    if (params?.groupId !== undefined) {
      setActiveGroupId(params.groupId);
    }
    if (params?.goBackTo !== undefined) {
      setGoBackTo(params.goBackTo);
    }
  };

  return (
    <NavigationContext.Provider value={{ currentRoute, activeGroupId, navigate, goBackTo }}>
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within NavigationProvider');
  return context;
};
