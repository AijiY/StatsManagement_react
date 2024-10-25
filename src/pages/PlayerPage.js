import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSeasons, getCurrentSeason, getPlayer, getPlayerCareerStats, getPlayerSeasonStats} from '../apis/GetMappings';
import { getGameResult, getClub } from './../apis/GetMappings';

function PlayerPage() {
    const apiUrl = process.env.REACT_APP_API_URL;
    
    const { countryId } = useParams(); // URLから国IDを取得
    const { leagueId } = useParams(); // URLからリーグIDを取得
    const { clubId } = useParams(); // URLからクラブIDを取得
    const { playerId } = useParams(); // URLから選手IDを取得
    const [player, setPlayer] = useState([]);
    const [playerSeasonStats, setPlayerSeasonStats] = useState([]); // 選手のシーズン成績を管理するstate
    const [playerCareerStats, setPlayerCareerStats] = useState([]); // 選手の通算成績を管理するstate
    const [seasons, setSeasons] = useState([]); // シーズン一覧を管理するstate
    const [selectedSeason, setSelectedSeason] = useState(null); // 選択中のシーズンを管理するstate
    const [isSeasonStatsView, setIsSeasonStatsView] = useState(true); // シーズン成績表示切り替え用のstate
    const [gameId, setGameId] = useState(null);
    const [gameResult, setGameResult] = useState(null);
    const [opponentClubId, setOpponentClubId] = useState(null);
    const [opponentClub, setOpponentClub] = useState(null);

    useEffect(() => {
        getSeasons(setSeasons);
        getCurrentSeason(setSelectedSeason);
    }, []);

    useEffect(() => {
        getPlayer(playerId, setPlayer);
        getPlayerCareerStats(playerId, setPlayerCareerStats);
    }, [playerId]);

    useEffect(() => {
        if (selectedSeason) { // selectedSeasonが設定されている場合のみ実行
            getPlayerSeasonStats(playerId, selectedSeason.id, setPlayerSeasonStats);
        }
    }, [playerId, selectedSeason]);

    useEffect(() => {
        if (gameId) {
            getGameResult(gameId, setGameResult);
        }
    }, [gameId]);

    useEffect(() => {
        if (opponentClubId) {
            getClub(opponentClubId, setOpponentClub);
        }
    }, [opponentClubId]);


    const handleSeasonChange = (e) => {
        const selectedSeasonId = Number(e.target.value);
        const season = seasons.find((season) => season.id === selectedSeasonId); // idに基づいてシーズンを検索
        setSelectedSeason(season); // 選択したシーズンオブジェクトをセット
    };


    return (
        <div>
            {/* Homeに戻るリンク */}
            <Link to="/">Home</Link>
            <br />
            {/* クラブページに戻るリンク */}
            <Link to={`/countries/${countryId}/leagues/${leagueId}/clubs/${clubId}/players`}>Back to Players</Link>
            {/* 選手名 */}
            {player && <h1>{player.name}</h1>}

            {/* シーズン成績と通算成績の表示切り替えボタン */}
            <button onClick={() => setIsSeasonStatsView(!isSeasonStatsView)}>
                {isSeasonStatsView ? 'Show Career Stats' : 'Show Season Stats'}
            </button>

            {/* シーズン成績 */}
            
            {isSeasonStatsView && (
                <div>
                    {/* シーズン選択リスト */}
                    <lable htmlFor="season">Season:</lable>
                    <select id="season" value={selectedSeason?.id || ''} onChange={handleSeasonChange}>
                        {seasons.map((season) => (
                            <option key={season.id} value={season.id}>
                                {season.name}
                            </option>
                        ))}
                    </select>
                    {/* シーズン成績 */}
                    <h2>Season Stats</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Games</th>
                                <th>Goals</th>
                                <th>Assists</th>
                                <th>Yellow Cards</th>
                                <th>Red Cards</th>
                            </tr>
                        </thead>
                        {playerSeasonStats.map((seasonStat) => (
                            <tbody key={seasonStat.seasonId}>
                                <tr>
                                    <td>{seasonStat.games}</td>
                                    <td>{seasonStat.goals}</td>
                                    <td>{seasonStat.assists}</td>
                                    <td>{seasonStat.yellowCards}</td>
                                    <td>{seasonStat.redCards}</td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                    
                    {/* 試合ごとの成績 */}
                    <h2>Game Stats</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Opponent</th>
                                <th>Score</th>
                                <th>Goals</th>
                                <th>Assists</th>
                                <th>Yellow Cards</th>
                                <th>Red Cards</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playerSeasonStats.map((seasonStat) => (
                                seasonStat.playerGameStats.map((gameStat) => (
                                    <tr key={gameStat.gameId}>
                                        <td>{gameStat.gameDate}</td>
                                        <td>{gameStat.opponentClubName}</td>
                                        <td>{gameStat.score}</td>
                                        <td>{gameStat.goals}</td>
                                        <td>{gameStat.assists}</td>
                                        <td>{gameStat.yellowCards}</td>
                                        <td>{gameStat.redCards}</td>
                                    </tr>
                                ))
                            ))}                            
                        </tbody>
                    </table>

                </div>
            )}

            {/* 通算成績 */}
            {!isSeasonStatsView && (
                <div>
                    <h2>Career Stats</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Season</th>
                                <th>Clubs</th>
                                <th>Games</th>
                                <th>Goals</th>
                                <th>Assists</th>
                                <th>Yellow Cards</th>
                                <th>Red Cards</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playerCareerStats.map((playerSeasonStat) => (
                                <tr key={playerSeasonStat.seasonId}>
                                    <td>{playerSeasonStat.seasonName}</td>
                                    <td>{playerSeasonStat.clubName}</td>
                                    <td>{playerSeasonStat.games}</td>
                                    <td>{playerSeasonStat.goals}</td>
                                    <td>{playerSeasonStat.assists}</td>
                                    <td>{playerSeasonStat.yellowCards}</td>
                                    <td>{playerSeasonStat.redCards}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );

};

export default PlayerPage;