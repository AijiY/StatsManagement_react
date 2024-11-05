import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { getClub, getPlayer, getLeague, getCountry } from '../apis/GetMappings';


function MakePlayerFreePage() {
    const apiUrl = process.env.REACT_APP_API_URL;
  
    const { showToast } = useToast();
    const navigate = useNavigate();

    const { playerId } = useParams();
    const [player, setPlayer] = useState('');

    const [presentClub, setPresentClub] = useState('');
    const [presentLeague, setPresentLeague] = useState('');
    const [presentCountry, setPresentCountry] = useState('');

    useEffect(() => {
        getPlayer(playerId, setPlayer);
    }, [playerId]);
    useEffect(() => {
        if (player) {
            getClub(player.clubId, setPresentClub);
        }
    }, [player]);
    useEffect(() => {
        if (presentClub) {
            getLeague(presentClub.leagueId, setPresentLeague);
        }
    }, [presentClub]);
    useEffect(() => {
        if (presentLeague) {
            getCountry(presentLeague.countryId, setPresentCountry);
        }
    }, [presentLeague]);


    // プレイヤーを無所属にする処理
    const makePlayerFree = async (e) => {
        e.preventDefault();

        fetch(`${apiUrl}/player-make-free/${playerId}`, {
            method: 'PATCH'
        })
        .then((response) => {
            if (response.ok) {
            return response.json();
            }
            return response.text().then(text => { throw new Error(text); });
        })
        .then(() => {
            showToast(`Player ${player.name} is now free!`);
            // PlayersPageにリダイレクト
            navigate(`/countries/${presentCountry.id}/leagues/${presentLeague.id}/clubs/${presentClub.id}/players`);
        })
        .catch((error) => {
            alert('Error: ' + error.message);
            console.error(error);
        });
    };

    return (
        <div>
            <p>Are you sure you want to make {player.name} free?</p>
            <br />
            <form onSubmit={makePlayerFree} style={{ display: 'inline' }}>
                <button type="submit" style={{ marginRight: '10px' }}>Yes</button>
            </form>
            <button onClick={() => navigate(-1)}>No</button>
        </div>
    )
}

export default MakePlayerFreePage;