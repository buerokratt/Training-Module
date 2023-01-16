import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from 'components';
import Intents from 'pages/Training/Intents';
import CommonIntents from 'pages/Training/Intents/CommonIntents';
import Responses from 'pages/Training/Responses';
import Configuration from 'pages/Training/Configuration';
import Stories from 'pages/Training/Stories';
import StoriesDetail from 'pages/Training/Stories/StoriesDetail';
import Slots from 'pages/Training/Slots';
import SlotsNew from 'pages/Training/Slots/SlotsNew';
import Forms from 'pages/Training/Forms';
import History from 'pages/HistoricalConversations/History';
import Appeals from 'pages/HistoricalConversations/Appeals';
import IntentsOverview from 'pages/ModelBankAndAnalytics/IntentsOverview';
import Testcases from 'pages/ModelBankAndAnalytics/Testcases';
import Models from 'pages/ModelBankAndAnalytics/Models';
import FormsDetail from './pages/Training/Forms/FormsDetail';

const App: FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to='/treening/treening/teemad' />} />
        <Route path='/treening/treening/teemad' element={<Intents />} />
        <Route path='/treening/treening/avalikud-teemad' element={<CommonIntents />} />
        <Route path='/treening/treening/vastused' element={<Responses />} />
        <Route path='/treening/treening/konfiguratsioon' element={<Configuration />} />
        <Route path='/treening/treening/kasutuslood' element={<Stories />} />
        <Route path='/treening/treening/kasutuslood/:id' element={<StoriesDetail />} />
        <Route path='/treening/treening/pilud' element={<Slots />} />
        <Route path='/treening/treening/pilud/uus' element={<SlotsNew />} />
        <Route path='/treening/treening/vormid' element={<Forms />} />
        <Route path='/treening/treening/vormid/uus' element={<FormsDetail mode="new"/>} />
        <Route path='/treening/treening/vormid/:id' element={<FormsDetail mode="edit" />} />
        <Route path='/treening/ajaloolised-vestlused/ajalugu' element={<History />} />
        <Route path='/treening/ajaloolised-vestlused/poordumised' element={<Appeals />} />
        <Route path='/treening/mudelipank-ja-analuutika/teemade-ulevaade' element={<IntentsOverview />} />
        <Route path='/treening/mudelipank-ja-analuutika/testlood' element={<Testcases />} />
        <Route path='/treening/mudelipank-ja-analuutika/mudelite-vordlus' element={<Models />} />
      </Route>
    </Routes>
  );
};

export default App;
