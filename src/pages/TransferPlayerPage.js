import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { getClub, getClubsByLeague, getCountries, getCountry, getLeague, getLeaguesByCountry, getPlayer } from '../apis/GetMappings';


function TransferPlayerPage() {
    const apiUrl = process.env.REACT_APP_API_URL;
  
    const { showToast } = useToast();
    const navigate = useNavigate();

    const { playerId } = useParams();
    const [player, setPlayer] = useState('');

    // const [club, setClub] = useState('');
    // const [league, setLeague] = useState('');
    // const [country, setCountry] = useState('');

    const [countries, setCountries] = useState([]);
    const [selectedCountryId, setSelectedCountryId] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [leagues, setLeagues] = useState([]);
    const [selectedLeagueId, setSelectedLeagueId] = useState('');
    const [selectedLeague, setSelectedLeague] = useState('');
    const [clubs, setClubs] = useState([]);
    const [selectedClubId, setSelectedClubId] = useState('');
    const [selectedClub, setSelectedClub] = useState('');


    useEffect(() => {
        getPlayer(playerId, setPlayer);
    }, [playerId]);
    // useEffect(() => {
    //     if (player) {
    //         getClub(player.club, setClub);
    //     }
    // }, [player]);
    // useEffect(() => {
    //     if (club) {
    //         getLeague(club.league, setLeague);
    //     }
    // }, [club]);
    // useEffect(() => {
    //     if (league) {
    //         getCountry(league.country, setCountry);
    //     }
    // }, [league]);

    useEffect(() => {
        getCountries(setCountries);
    }, []);
    useEffect(() => {
        if (selectedCountryId) {
            getCountry(selectedCountryId, setSelectedCountry);
            getLeaguesByCountry(selectedCountryId, setLeagues
            );
        }
    }, [selectedCountryId]);
    useEffect(() => {
        if (selectedLeagueId) {
            getLeague(selectedLeagueId, setSelectedLeague);
            getClubsByLeague(selectedLeagueId, setClubs);
        }
    }, [selectedLeagueId]);
    useEffect(() => {
        if (selectedClubId) {
            setSelectedClub(clubs.find((club) => club.id === Number(selectedClubId)));
        }
    }, [selectedClubId]);

    const handleSelectedCountryChange = (e) => {
        setSelectedCountryId(e.target.value);
    };

    const handleSelectedLeagueChange = (e) => {
        setSelectedLeagueId(e.target.value);
    };

    const handleSelectedClubChange = (e) => {
        setSelectedClubId(e.target.value);
    };

    const handleNumberInputChange = (e) => {
        setPlayer({ ...player, number: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const playerForTransfer = {
            clubId: selectedClub.id,
            number: player.number
        };

        fetch(`${apiUrl}/player-transfer/${playerId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerForTransfer)
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            return response.text().then(text => { throw new Error(text); });
        })
        .then(() => {
            showToast(`Player ${player.name} is now transferred to ${selectedClub.name}!`);
            // navigate先を元のクラブにするか、移籍先にするか要検討
            navigate(`/countries/${selectedCountry.id}/leagues/${selectedLeague.id}/clubs/${selectedClub.id}/players`);
        })
        .catch((error) => {
            alert('Error: ' + error.message);
            console.error(error);
        });
    };

    const handleGoBack = () => {
        navigate(-1); // 前のページに戻る
    };

    return (
        <div>
            {/* Homeに戻るリンク */}
            <Link to="/">Home</Link>
            <br /> {/* 改行 */} 
            {/* 元のページに戻るリンク */}
            <Link onClick={handleGoBack}>Back</Link>
            <h1>Transfer Player</h1>
            <form onSubmit={handleFormSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={{ width: '70px' }}>Country:</label>
                        <select 
                            id="countries" 
                            name="countries" 
                            required 
                            onChange={handleSelectedCountryChange}
                        >
                            <option value="">Select a country</option>
                            {countries.map((country) => (
                                <option key={country.id} value={country.id}>{country.name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={{ width: '70px' }}>League:</label>
                        <select 
                            id="leagues"
                            name="leagues"
                            required
                            disabled={!selectedCountry}
                            onChange={handleSelectedLeagueChange}
                        >
                            <option value="">Select a league</option>
                            {leagues.map((league) => (
                                <option key={league.id} value={league.id}>{league.name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={{ width: '70px' }}>Club:</label>
                        <select 
                            id="clubs"
                            name="clubs"
                            required
                            disabled={!selectedLeague}
                            onChange={handleSelectedClubChange}
                        >
                            <option value="">Select a club</option>
                            {clubs.map((club) => (
                                <option key={club.id} value={club.id}>{club.name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={{ width: '70px' }}>Number:</label>
                        <input
                            type="number"
                            id="number"
                            name="number"
                            value={player.number}
                            onChange={handleNumberInputChange}
                            required
                            style={{ width: '40px'}} // ラベルとの間隔を調整
                        />
                    </div>
                </div>
            <button type="submit">Transfer</button>
            </form>
        </div>
    );
}

export default TransferPlayerPage;