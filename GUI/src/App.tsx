import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Layout } from 'components';

const App: FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>

      </Route>
    </Routes>
  );
};

export default App;
