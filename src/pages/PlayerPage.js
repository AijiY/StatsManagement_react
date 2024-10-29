import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSeasons, getCurrentSeason, getPlayer, getPlayerCareerStats, getPlayerSeasonStats} from '../apis/GetMappings';
import { getGameResult, getClub } from './../apis/GetMappings';

import goalsIcon from '../assets/images/goals.png';
import assistsIcon from '../assets/images/assists.png';
import minutesIcon from '../assets/images/minutes.png';
import yellowCardsIcon from '../assets/images/yellow-cards.png';
import redCardsIcon from '../assets/images/red-cards.png';


function PlayerPage() {
    const apiUrl = process.env.REACT_APP_API_URL;
    
    const { countryId } = useParams(); // URLから国IDを取得
    const { leagueId } = useParams(); // URLからリーグIDを取得
    const { clubId } = useParams(); // URLからクラブIDを取得
    const { playerId } = useParams(); // URLから選手IDを取得
    const [player, setPlayer] = useState([]);
    const [playerSeasonStats, setPlayerSeasonStats] = useState([]); // 選手のシーズン成績を管理するstate
    const [playerCareerStats, setPlayerCareerStats] = useState([]); // 選手の通算成績を管理するstate
    const [playerCareerStatsWithoutTotal, setPlayerCareerStatsWithoutTotal] = useState([]); // 選手の通算成績を管理するstate
    const [playerCareerStatsTotal, setPlayerCareerStatsTotal] = useState([]); // 選手の通算成績を管理するstate
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
        if (playerCareerStats.length > 1) {
            setPlayerCareerStatsWithoutTotal(playerCareerStats.slice(0, -1));
            setPlayerCareerStatsTotal(playerCareerStats[playerCareerStats.length - 1]);
        }
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

            <br /><br />            

            {/* シーズン成績と通算成績の表示切り替えボタン */}
            <div className='button-container'>
                <button onClick={() => setIsSeasonStatsView(!isSeasonStatsView)} disabled={isSeasonStatsView}>
                    Show Season Stats
                </button>
                <button onClick={() => setIsSeasonStatsView(!isSeasonStatsView)} disabled={!isSeasonStatsView}>
                    Show Career Stats
                </button>
            </div>

            {/* シーズン成績 */}
            
            {isSeasonStatsView && (
                <div>
                    {/* 選手名 */}
                    {player && <h1>{player.name} Season Stats</h1>}
                    {/* シーズン選択リスト */}
                    <lable htmlFor="season">Season:</lable>
                    <select id="season" value={selectedSeason?.id || ''} onChange={handleSeasonChange}>
                        {seasons.map((season) => (
                            <option key={season.id} value={season.id}>
                                {season.name}
                            </option>
                        ))}
                    </select>

                    {/* 試合が登録されていなければシーズン成績も試合成績も表示しない */}
                    {!playerSeasonStats || playerSeasonStats.length === 0 ? (
                        <p>No games played in this season.</p>
                    ) : (
                        <div>    
                            {/* // シーズン成績 */}
                            <h2>Season Stats</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th rowSpan="2">Club</th>
                                        <th colSpan="3">Games</th>
                                        <th rowSpan="2"><img src={goalsIcon} alt="Goals" className='icon-large' /></th>
                                        <th rowSpan="2"><img src={assistsIcon} alt="Assists" className='icon-large' /></th>
                                        <th rowSpan="2"><img src={minutesIcon} alt="Minutes" className='icon-large' /></th>
                                        <th rowSpan="2"><img src={yellowCardsIcon} alt="Yellow Cards" className='icon-large' /></th>
                                        <th rowSpan="2"><img src={redCardsIcon} alt="Red Cards" className='icon-large' /></th>
                                    </tr>
                                    <tr>
                                        <th>Total</th>  
                                        <th>Start</th>  
                                        <th>Sub</th>    
                                    </tr>
                                </thead>
                                {playerSeasonStats.map((seasonStat) => (
                                    <tbody key={seasonStat.seasonId}>
                                        <tr>
                                            <td className='text'>{seasonStat.clubName}</td>
                                            <td>{seasonStat.games}</td>
                                            <td>{seasonStat.starterGames}</td>
                                            <td>{seasonStat.substituteGames}</td>
                                            <td>{seasonStat.goals}</td>
                                            <td>{seasonStat.assists}</td>
                                            <td>{seasonStat.minutes}</td>
                                            <td>{seasonStat.yellowCards}</td>
                                            <td>{seasonStat.redCards}</td>
                                        </tr>
                                    </tbody>
                                ))}
                            </table>
                            
                            {/* // 試合ごとの成績 */}
                            <h2>Game Stats</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Club</th>
                                        <th>Opponent</th>
                                        <th>Score</th>
                                        <th>Starter</th>
                                        <th><img src={goalsIcon} alt="Goals" className='icon-large' /></th>
                                        <th><img src={assistsIcon} alt="Assists" className='icon-large' /></th>
                                        <th><img src={minutesIcon} alt="Minutes" className='icon-large' /></th>
                                        <th><img src={yellowCardsIcon} alt="Yellow Cards" className='icon-large' /></th>
                                        <th><img src={redCardsIcon} alt="Red Cards" className='icon-large' /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {playerSeasonStats.map((seasonStat) => (
                                        seasonStat.playerGameStats.map((gameStat) => (
                                            <tr key={gameStat.gameId}>
                                                <td>{gameStat.gameDate}</td>
                                                <td className='text'>{seasonStat.clubName}</td>
                                                <td className='text'>{gameStat.opponentClubName}</td>
                                                <td className='score-text'>{gameStat.score}</td>
                                                <td className='center'>{gameStat.isStarter ? '〇' : '-'}</td>
                                                <td>{gameStat.goals}</td>
                                                <td>{gameStat.assists}</td>
                                                <td>{gameStat.minutes}</td>
                                                <td>{gameStat.yellowCards}</td>
                                                <td>{gameStat.redCards}</td>
                                            </tr>
                                        ))
                                    ))}                            
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* 通算成績 */}
            {!isSeasonStatsView && (
                <div>
                    {/* 選手名 */}
                    {player && <h1>{player.name} Career Stats</h1>}
                    {!playerCareerStats || playerCareerStats.length === 1 ? (
                        <p>No games played in career.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th rowSpan="2">Season</th>
                                    <th rowSpan="2">Club</th>
                                    <th colSpan="3">Games</th>
                                    <th rowSpan="2"><img src={goalsIcon} alt="Goals" className='icon-large' /></th>
                                    <th rowSpan="2"><img src={assistsIcon} alt="Assists" className='icon-large' /></th>
                                    <th rowSpan="2"><img src={minutesIcon} alt="Minutes" className='icon-large' /></th>
                                    <th rowSpan="2"><img src={yellowCardsIcon} alt="Yellow Cards" className='icon-large' /></th>
                                    <th rowSpan="2"><img src={redCardsIcon} alt="Red Cards" className='icon-large' /></th>
                                </tr>
                                <tr>
                                    <th>Total</th>  
                                    <th>Start</th>  
                                    <th>Sub</th>    
                                </tr>
                            </thead>
                            <tbody>
                                {playerCareerStatsWithoutTotal.map((playerSeasonStat) => (
                                    <tr key={playerSeasonStat.seasonId}>
                                        <td>{playerSeasonStat.seasonName}</td>
                                        <td>{playerSeasonStat.clubName}</td>
                                        <td>{playerSeasonStat.games}</td>
                                        <td>{playerSeasonStat.starterGames}</td>
                                        <td>{playerSeasonStat.substituteGames}</td>
                                        <td>{playerSeasonStat.goals}</td>
                                        <td>{playerSeasonStat.assists}</td>
                                        <td>{playerSeasonStat.minutes}</td>
                                        <td>{playerSeasonStat.yellowCards}</td>
                                        <td>{playerSeasonStat.redCards}</td>
                                    </tr>
                                ))}
                                <tr key={playerCareerStatsTotal.seasonId} className="total-row">
                                    <td colSpan={"2"} className='center'>Total</td>
                                    <td>{playerCareerStatsTotal.games}</td>
                                    <td>{playerCareerStatsTotal.starterGames}</td>
                                    <td>{playerCareerStatsTotal.substituteGames}</td>
                                    <td>{playerCareerStatsTotal.goals}</td>
                                    <td>{playerCareerStatsTotal.assists}</td>
                                    <td>{playerCareerStatsTotal.minutes}</td>
                                    <td>{playerCareerStatsTotal.yellowCards}</td>
                                    <td>{playerCareerStatsTotal.redCards}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            )}

        </div>
    );

};

export default PlayerPage;