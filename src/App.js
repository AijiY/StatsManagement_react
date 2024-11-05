import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext.js';

import HomePage from './pages/HomePage.js';
import RegisterSeasonPage from './pages/RegisterSeasonPage.js';
import CountriesPage from './pages/CountriesPage.js';
import LeaguesPage from './pages/LeaguesPage.js';
import RegisterGameResultPage from './pages/RegisterGameResultPage.js';
import ClubsPage from './pages/ClubsPage.js';
import PlayersPage from './pages/PlayersPage.js';
import PlayerPage from './pages/PlayerPage.js';
import FreePlayersPage from './pages/FreePlayersPage.js';
import PatchPlayerPage from './pages/PatchPlayerPage.js';
import TransferPlayerPage from './pages/TransferPlayerPage.js';
import MakePlayerFreePage from './pages/MakePlayerFreePage.js';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* シーズン登録ページに遷移 */}
          <Route path="/register-season" element={<RegisterSeasonPage />} />
          {/* データ管理ページに遷移 */}
          <Route path="/countries" element={<CountriesPage />} />
          {/* 国IDに基づいてリーグページに遷移 */}
          <Route path="/countries/:countryId/leagues" element={<LeaguesPage />} />
          {/* 試合結果登録画面に遷移 */}
          <Route path="/countries/:countryId/leagues/:leagueId/register-game-result" element={<RegisterGameResultPage />} />
          {/* リーグIDに基づいてクラブページに遷移 */}
          <Route path="/countries/:countryId/leagues/:leagueId/clubs" element={<ClubsPage />} />
          {/* クラブIDに基づいて選手ページに遷移 */}
          <Route path="/countries/:countryId/leagues/:leagueId/clubs/:clubId/players" element={<PlayersPage />} />
          {/* 選手IDに基づいて選手詳細ページに遷移 */}
          <Route path="/countries/:countryId/leagues/:leagueId/clubs/:clubId/players/:playerId" element={<PlayerPage />} />
          {/* クラブ無所属選手ページに移動 */}
          <Route path="/countries/0/leagues/0/clubs/0/players" element={<FreePlayersPage />} />
          {/* 選手情報更新（クラブIDを除く）ページに移動 */}
          <Route path="/patch-player/:playerId" element={<PatchPlayerPage />} />
          {/* 選手移籍ページに移動 */}
          <Route path="/transfer-player/:playerId" element={<TransferPlayerPage />} />
          {/* 選手を無所属にするページに移動 */}
          <Route path="/make-player-free/:playerId" element={<MakePlayerFreePage />} />


          {/* 以下今後追加予定 */}
          {/* 選手情報更新 */}
          {/* 選手移籍 */}
          {/* クラブのリーグ昇格降格 */}
          {/* 各データのワード検索 */}
        </Routes>
      </Router>
    </ToastProvider>

  );
}

export default App;

