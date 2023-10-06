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
import RegexDetail from 'pages/Training/IntentsFollowupTraining/RegexDetail';
import TrainAndTest from 'pages/Training/TrainAndTest';

const App: FC = () => {
  const store = useUserInfoStore();
  if(import.meta.env.REACT_APP_LOCAL === 'true') {
    const { data: userInfo } = useQuery<UserInfo>({
      queryKey: [import.meta.env.REACT_APP_AUTH_PATH, 'auth'],
      onSuccess: (response: { data: { custom_jwt_userinfo: UserInfo } }) =>
          store.setUserInfo(response),
    });
  } else {
    const { data: userInfo } = useQuery<UserInfo>({
      queryKey: [import.meta.env.REACT_APP_AUTH_PATH, 'auth'],
      onSuccess: (data: { data: { custom_jwt_userinfo: UserInfo } }) =>
          store.setUserInfo(data.data.custom_jwt_userinfo),
    });
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to='/training/intents' />} />
        <Route path='/training/intents' element={<Intents />} />
        <Route path='/training/common-intents' element={<CommonIntents />} />
        <Route path='/training/intents-followup-training' element={<IntentsFollowupTraining />} />
        <Route path='/training/regex/:id' element={<RegexDetail />} />
        <Route path='/training/responses' element={<Responses />} />
        <Route path='/training/configuration' element={<Configuration />} />
        <Route path='/training/stories' element={<Stories />} />
        <Route path='/training/stories/new' element={<StoriesDetail mode='new' />} />
        <Route path='/training/stories/:id' element={<StoriesDetail mode='edit' />} />
        <Route path='/training/slots' element={<Slots />} />
        <Route path='/training/slots/new' element={<SlotsDetail mode='new' />} />
        <Route path='/training/slots/:id' element={<SlotsDetail mode='edit' />} />
        <Route path='/training/forms' element={<Forms />} />
        <Route path='/training/forms/new' element={<FormsDetail mode='new' />} />
        <Route path='/training/forms/:id' element={<FormsDetail mode='edit' />} />
        <Route path='/history/history' element={<History />} />
        <Route path='/history/appeal' element={<Appeals />} />
        <Route path='/analytics/overview' element={<IntentsOverview />} />
        <Route path='/analytics/testcases' element={<Testcases />} />
        <Route path='/analytics/models' element={<Models />} />
        <Route path='/analytics/models/:id' element={<ModelsDetail />} />
        <Route path='/train-new-model' element={<TrainAndTest />} />
      </Route>
    </Routes>
  );
};

export default App;
