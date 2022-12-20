import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from 'components';
import CommonIntents from 'pages/Training/Intents';
import Responses from 'pages/Training/Responses';

const App: FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to='/treening/teemad/common-teemad' />} />
        <Route path='/treening/teemad/common-teemad' element={<CommonIntents />} />
        <Route path='/treening/vastused' element={<Responses />} />
      </Route>
    </Routes>
  );
};

export default App;
