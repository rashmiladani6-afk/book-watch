/**
 * Main Application Component
 */

import { Providers } from './providers';
import { AppRoutes } from './routes';
import VerticalSidebar from '@/shared/components/layout/VerticalSidebar';

const App = () => {
  return (
    <Providers>
      <VerticalSidebar />
      <div className="md:ml-[72px]">
        <AppRoutes />
      </div>
    </Providers>
  );
};

export default App;