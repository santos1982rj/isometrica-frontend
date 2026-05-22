import { useEffect } from 'react';

import { AppRoutes } from './routes/AppRoutes';
import { useAuthStore } from './core/store/authStore';
import { TrackingScripts } from './features/tracking/TrackingScripts';

function App() {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <>
      <TrackingScripts />
      <AppRoutes />
    </>
  );
}

export default App;
