import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { getClubsByLeague, getCurrentSeason, getLeague, getSeasonGameReslt, getSeasons, getStanding } from '../apis/GetMappings';

function ClubsPage() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const { showToast } = useToast();
  const nameInputRef = useRef(null); // クラブ名入力欄の参照を作成

  const { countryId } = useParams(); // URLから国IDを取得
  const { leagueId } = useParams(); // URLからリーグIDを取得
  const [clubs, setClubs] = useState([]);
  const [newClubName, setNewClubName] = useState(''); // 新規登録用のstate
  const [league, setLeague] = useState(''); // リーグ名を管理するstate
  const [standing, setStanding] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonGameResult, setSeasonGameResult] = useState([]);

  const location = useLocation();
  const initialState = {showClubsList: true, showGameResults: false};
  const navigationsState = location.state || initialState;
  
  const [isClubsListView, setIsClubsListView] = useState(navigationsState.showClubsList); // クラブ一覧表示切り替え用のstate
  const [isStaidingView, setIsStandingView] = useState(false); // 順位表表示切り替え用のstate
  const [isGameResultsView, setIsGameResultsView] = useState(navigationsState.showGameResults); // 試合結果表示切り替え用のstate

  useEffect(() => {
    getSeasons(setSeasons);
    getCurrentSeason(setSelectedSeason);
  }, []);

  useEffect(() => {
    getClubsByLeague(leagueId, setClubs);
    getLeague(leagueId, setLeague);
  }, [leagueId]);

  useEffect(() => {
    if (selectedSeason) { // selectedSeasonが設定されている場合のみ実行
      getStanding(leagueId, selectedSeason.id, setStanding);
      getSeasonGameReslt(leagueId, selectedSeason.id, setSeasonGameResult);
    }
  }, [leagueId, selectedSeason]);

  // ビュー切り替え用の関数
  const switchToClubsList = () => {
    setIsClubsListView(true);
    setIsStandingView(false);
    setIsGameResultsView(false);
  };

  const switchToStanding = () => {
    setIsClubsListView(false);
    setIsStandingView(true);
    setIsGameResultsView(false);
  };

  const switchToGameResults = () => {
    setIsClubsListView(false);
    setIsStandingView(false);
    setIsGameResultsView(true);
  };

  const handleSeasonChange = (e) => {
    const selectedSeasonId = Number(e.target.value);
    const season = seasons.find((season) => season.id === selectedSeasonId); // idに基づいてシーズンを検索
    setSelectedSeason(season); // 選択したシーズンオブジェクトをセット
  };

  // フォームの入力値を管理
  const handleInputChange = (e) => {
    setNewClubName(e.target.value);
  };

  // 新しいクラブを登録する処理
  const handleFormSubmit = (e) => {
    e.preventDefault(); // ページリロードを防ぐ

    // リクエストボディを作成
    const clubForJson = {
      leagueId: parseInt(leagueId), // URLから取得したリーグID
      name: newClubName, // フォームから取得したクラブ名
    };

    fetch(`${apiUrl}/club`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // JSON形式で送信
      },
      body: JSON.stringify(clubForJson), // JSONとして送信
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return response.text().then((text) => { throw new Error(text); });
      })
      .then((newClub) => {
        setClubs([...clubs, newClub]); // 新しいクラブをリストに追加
        setNewClubName(''); // 入力欄をリセット
        showToast(`Club '${newClub.name}' registered successfully!`);
        if (nameInputRef.current) {
          nameInputRef.current.focus(); // クラブ名入力欄にフォーカス
        }
      })
      .catch((error) => {
        alert('Error: ' + error.message);
        console.error(error);
      });
  };

  return (
    <div>
      {/* Homeに戻るリンク */}
      <Link to="/">Home</Link>
      <br /> {/* 改行 */}
      {/* LeaguePageに戻るリンク */}
      <Link to={`/countries/${countryId}/leagues`}>Back to Leagues</Link>

      <br /><br />
      
      {/* 3つの表示切替ボタン */}
      <span className='button-container'>
        <button onClick={switchToClubsList} disabled={isClubsListView}>Clubs</button>
        <button onClick={switchToStanding} disabled={isStaidingView}>Standing</button>
        <button onClick={switchToGameResults} disabled={isGameResultsView}>Game Results</button>
      </span>

      {/* クラブ一覧の表示 */}
      {isClubsListView && (
        <>
          {/* リーグ名を表示 */}
          {league && <h1>{league.name} Clubs</h1>} {/* リーグ名を表示する要素を追加 */}
          {/* クラブ一覧 */}
          {!clubs || clubs.length === 0 ? (
            <p>No clubs data</p>
          ) : (
            <ul>
              {clubs.map((club) => (
                <li key={club.id}>
                  <Link to={`/countries/${countryId}/leagues/${leagueId}/clubs/${club.id}/players`}>{club.name}</Link>
                </li>
              ))}
            </ul>
          )}
          {/* 新しいクラブの登録フォーム */}
          <h2>Register New Club</h2>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Club name"
              value={newClubName}
              onChange={handleInputChange}
              required
              ref={nameInputRef}
            />
            <button type="submit">Register</button>
          </form>
        </>
      )}

      {/* 順位表の表示 */}
      {isStaidingView && (
        <>
          {/* リーグ名を表示 */}
          {league && <h1>{league.name} Staning</h1>} {/* リーグ名を表示する要素を追加 */}
          <label htmlFor="season-select">Choose a season:</label>
            <select id="season-select" value={selectedSeason?.id || ''} onChange={handleSeasonChange}>
              {seasons.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.name}
                </option>
              ))}
            </select>
          <br /><br />
          {!standing || standing.clubForStandings.length === 0 ? (
            <p>No standing data (No games played)</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Pos.</th>
                  <th>Club</th>
                  <th>Pts.</th>
                  <th>Gms.</th>
                  <th>Wns.</th>
                  <th>Drw.</th>
                  <th>Lss.</th>
                  <th>G.F.</th>
                  <th>G.A.</th>
                  <th>G.D.</th>
                </tr>
              </thead>
              <tbody>
                {standing.clubForStandings.map((clubForStanding) => (
                  <tr key={clubForStanding.club.id}>
                    <td className='center'>{clubForStanding.position}</td>
                    <td className='text'>
                      <Link to={`/countries/${countryId}/leagues/${leagueId}/clubs/${clubForStanding.club.id}/players`}>
                        {clubForStanding.club.name}
                      </Link>
                    </td>
                    <td>{clubForStanding.points}</td>
                    <td>{clubForStanding.gamesPlayed}</td>
                    <td>{clubForStanding.wins}</td>
                    <td>{clubForStanding.draws}</td>
                    <td>{clubForStanding.losses}</td>
                    <td>{clubForStanding.goalsFor}</td>
                    <td>{clubForStanding.goalsAgainst}</td>
                    <td>{clubForStanding.goalDifference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* 試合結果の表示 */}
      {isGameResultsView && (
        <>
          {/* リーグ名を表示：リダイレクト時のエラー解消のため分岐をつぃいか */}
          {league ? (
            <h1>{league.name} Game Results</h1>
          ) : (
            <p>Loading league information...</p>
          )}
          {/* 試合結果登録画面へのリンク */}

          {selectedSeason && selectedSeason.current === true && 
          <Link to={`/countries/${countryId}/leagues/${leagueId}/register-game-result`} style={{fontSize : 'large'}}>Register Game Result</Link>}

          <br /><br />

          <label htmlFor="season-select">Choose a season:</label>
          <select id="season-select" value={selectedSeason?.id || ''} onChange={handleSeasonChange}>
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.name}
              </option>
            ))}
          </select>
          
          {!seasonGameResult || !seasonGameResult.dayGameResults || seasonGameResult.dayGameResults.length === 0 ? (
            <p>No game result data</p>
          ) : (
            seasonGameResult.dayGameResults.map((dayGameResult) => (
              <div key={dayGameResult.gameDate}>
                <h3>{dayGameResult.gameDate}</h3>
                <table>
                  {/* <thead>
                    <tr>
                      <th>Home</th>
                      <th>Score</th>
                      <th>Away</th>
                    </tr>
                  </thead> */}
                  <tbody>
                    {dayGameResult.gameResults.map((gameResult) => (
                      <tr key={gameResult.id}>
                        <td className='home'>
                          <Link to={`/countries/${countryId}/leagues/${leagueId}/clubs/${gameResult.homeClubId}/players`}>
                            {gameResult.homeClubName}
                          </Link>
                        </td>
                        <td className='score-text'> {gameResult.homeScore} - {gameResult.awayScore} </td>
                        <td className='away'>
                          <Link to={`/countries/${countryId}/leagues/${leagueId}/clubs/${gameResult.awayClubId}/players`}>
                            {gameResult.awayClubName}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default ClubsPage;
