import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from 'components';
import CommonIntents from 'pages/Training/Intents';
import Responses from 'pages/Training/Responses';
import Configuration from 'pages/Training/Configuration';
import Stories from 'pages/Training/Stories';
import StoriesDetail from 'pages/Training/Stories/StoriesDetail';

const App: FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to='/treening/treening/teemad' />} />
        <Route path='/treening/treening/teemad' element={<CommonIntents />} />
        <Route path='/treening/vastused' element={<Responses />} />
        <Route path='/treening/konfiguratsioon' element={<Configuration />} />
        <Route path='/treening/kasutuslood' element={<Stories />} />
        <Route path='/treening/kasutuslood/:id' element={<StoriesDetail />} />
      </Route>
    </Routes>
  );
};

export default App;
