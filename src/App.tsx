/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AuthFlow } from './components/auth/AuthFlow';
import { Layout } from './components/layout/Layout';
import { HomeDashboard } from './components/home/HomeDashboard';
import { GroupsList } from './components/groups/GroupsList';
import { GroupDetails } from './components/groups/GroupDetails';
import { PaymentFlow } from './components/payment/PaymentFlow';
import { PaymentsList } from './components/payment/PaymentsList';
import { ProfileSettings } from './components/profile/ProfileSettings';
import { NotificationsList } from './components/notifications/NotificationsList';
import { EditProfile } from './components/profile/EditProfile';
import { SecuritySettings } from './components/profile/SecuritySettings';
import { GroupAction } from './components/groups/GroupAction';
import { JoinGroupModal } from './components/groups/JoinGroupModal';
import { CreateGroupFlow } from './components/groups/CreateGroupFlow';
import { PaymentDrawer } from './components/payment/PaymentDrawer';
import { PaymentSuccess } from './components/payment/PaymentSuccess';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { AnimatePresence, motion } from 'motion/react';

function AppContent() {
  const { currentRoute } = useNavigation();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
           key={currentRoute}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           transition={{ duration: 0.2 }}
        >
          {currentRoute === 'home' && <HomeDashboard />}
          {currentRoute === 'groups' && <GroupsList />}
          {currentRoute === 'group-details' && <GroupDetails />}
          {currentRoute === 'payment-flow' && <PaymentFlow />}
          {currentRoute === 'payment' && <PaymentsList />}
          {currentRoute === 'profile' && <ProfileSettings />}
          {currentRoute === 'notifications' && <NotificationsList />}
          {currentRoute === 'edit-profile' && <EditProfile />}
          {currentRoute === 'security' && <SecuritySettings />}
          {currentRoute === 'group-action' && <GroupAction />}
          {currentRoute === 'join-group' && <JoinGroupModal />}
          {currentRoute === 'create-group' && <CreateGroupFlow />}
          {currentRoute === 'payment-drawer' && <PaymentDrawer />}
          {currentRoute === 'payment-success' && <PaymentSuccess />}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AuthFlow onComplete={() => setIsAuthenticated(true)} />;
  }

  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}
