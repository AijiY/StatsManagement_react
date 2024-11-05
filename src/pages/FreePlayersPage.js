import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { getPlayersWithNoClub, } from '../apis/GetMappings.js';

function FreePlayersPage() {
    const apiUrl = process.env.REACT_APP_API_URL;

    const { showToast } = useToast();
    const navigate = useNavigate();

    const [players, setPlayers] = useState([]);

    useEffect(() => {
        getPlayersWithNoClub(setPlayers);
    }, []);


    return (
        <div>
            {/* Homeに戻るリンク */}
            <Link to="/">Home</Link>
            <br /> {/* 改行 */}
            {/* CountriesPageに戻るリンク */}
            <Link to="/countries">Back to Countries</Link>
            {!players || players.length === 0 ? (
                <p>There are no players without a club.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Transfer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player) => (
                            <tr key={player.id}>
                                <td className='text'>
                                    <Link to={`/countries/0/leagues/0/clubs/0/players/${player.id}`}>
                                        {player.name}
                                    </Link>
                                </td>
                                <td className='center'>
                                    <button onClick={() => navigate(`/transfer-player/${player.id}`)}>Go</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>    
                </table>
            )}
        </div>
    );
}

export default FreePlayersPage;