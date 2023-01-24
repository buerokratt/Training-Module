import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { Layout } from 'components';
import useUserInfoStore from 'store/store';
import { UserInfo } from 'types/userInfo';
import Intents from 'pages/Training/Intents';
import CommonIntents from 'pages/Training/Intents/CommonIntents';
import Responses from 'pages/Training/Responses';
import Configuration from 'pages/Training/Configuration';
import Stories from 'pages/Training/Stories';
import StoriesDetail from 'pages/Training/Stories/StoriesDetail';
import Slots from 'pages/Training/Slots';
import SlotsDetail from 'pages/Training/Slots/SlotsDetail';
import Forms from 'pages/Training/Forms';
import History from 'pages/HistoricalConversations/History';
import Appeals from 'pages/HistoricalConversations/Appeals';
import IntentsOverview from 'pages/ModelBankAndAnalytics/IntentsOverview';
import Testcases from 'pages/ModelBankAndAnalytics/Testcases';
import Models from 'pages/ModelBankAndAnalytics/Models';
import FormsDetail from 'pages/Training/Forms/FormsDetail';
import ModelsDetail from 'pages/ModelBankAndAnalytics/Models/ModelsDetail';
import IntentsFollowupTraining from 'pages/Training/IntentsFollowupTraining';

const App: FC = () => {
  const store = useUserInfoStore();
  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ['cs-custom-jwt-userinfo'],
    onSuccess: (data) => store.setUserInfo(data),
  });

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to='/treening/treening/teemad' />} />
        <Route path='/treening/treening/teemad' element={<Intents />} />
        <Route path='/treening/treening/avalikud-teemad' element={<CommonIntents />} />
        <Route path='/treening/treening/teemade-jareltreenimine' element={<IntentsFollowupTraining />} />
        <Route path='/treening/treening/vastused' element={<Responses />} />
        <Route path='/treening/treening/konfiguratsioon' element={<Configuration />} />
        <Route path='/treening/treening/kasutuslood' element={<Stories />} />
        <Route path='/treening/treening/kasutuslood/:id' element={<StoriesDetail />} />
        <Route path='/treening/treening/pilud' element={<Slots />} />
        <Route path='/treening/treening/pilud/uus' element={<SlotsDetail mode='new' />} />
        <Route path='/treening/treening/pilud/:id' element={<SlotsDetail mode='edit' />} />
        <Route path='/treening/treening/vormid' element={<Forms />} />
        <Route path='/treening/treening/vormid/uus' element={<FormsDetail mode='new' />} />
        <Route path='/treening/treening/vormid/:id' element={<FormsDetail mode='edit' />} />
        <Route path='/treening/ajaloolised-vestlused/ajalugu' element={<History />} />
        <Route path='/treening/ajaloolised-vestlused/poordumised' element={<Appeals />} />
        <Route path='/treening/mudelipank-ja-analuutika/teemade-ulevaade' element={<IntentsOverview />} />
        <Route path='/treening/mudelipank-ja-analuutika/testlood' element={<Testcases />} />
        <Route path='/treening/mudelipank-ja-analuutika/mudelite-vordlus' element={<Models />} />
        <Route path='/treening/mudelipank-ja-analuutika/mudelite-vordlus/:id' element={<ModelsDetail />} />
      </Route>
    </Routes>
  );
};

export default App;
