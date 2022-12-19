import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from 'components';
import Training from 'pages/Training';

const App: FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to='/treening/teemad/common-teemad' />} />
        <Route path='/treening/teemad/common-teemad' element={<Training />} />
      </Route>
    </Routes>
  );
};

export default App;
