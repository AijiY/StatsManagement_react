import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { getCountry, getLeaguesByCountry } from '../apis/GetMappings';

function LeaguesPage() {
  const apiUrl = process.env.REACT_APP_API_URL;
  
  const { showToast } = useToast();
  const nameInputRef  = useRef(null); // リーグ名入力欄の参照を作成

  const { countryId } = useParams(); // URLから国IDを取得
  const [leagues, setLeagues] = useState([]);
  const [newLeagueName, setNewLeagueName] = useState(''); // 新規登録用のstate
  const [country, setCountry] = useState([]); // 国を管理するstate

  useEffect(() => {
    getLeaguesByCountry(countryId, setLeagues);
    getCountry(countryId, setCountry);
  }, [countryId]);

  // フォームの入力値を管理
  const handleInputChange = (e) => {
    setNewLeagueName(e.target.value);
  };

  // 新しいリーグを登録する処理
  const handleFormSubmit = (e) => {
    e.preventDefault(); // ページリロードを防ぐ

    // リクエストボディを作成
    const leagueForJson = {
        countryId: parseInt(countryId), // URLから取得した国ID
        name: newLeagueName, // フォームから取得したリーグ名
      };

      fetch(`${apiUrl}/league`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // JSON形式で送信
        },
        body: JSON.stringify(leagueForJson), // JSONとして送信
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          return response.text().then((text) => { throw new Error(text); });
        })
        .then((newLeague) => {
          setLeagues([...leagues, newLeague]); // 新しいリーグをリストに追加
          setNewLeagueName(''); // 入力欄をリセット
          showToast(`League '${newLeague.name}' registered successfully!`);
          if (nameInputRef.current) {
            nameInputRef.current.focus();
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
      {/* CountriesPageに戻るリンク */}
      <Link to="/countries">Back to Countries</Link>
      {/* 国名を表示 */}
      {country && <h1>{country.name} Leagues</h1>} {/* 国名を表示する要素を追加 */}
      {!leagues || leagues.length === 0 ? (
        <p>No league data</p>
      ) : (
        <ul>
          {leagues.map((league) => (
            <li key={league.id}>
              <Link to={`/countries/${countryId}/leagues/${league.id}/clubs`}>{league.name}</Link>
            </li>
          ))}
        </ul>
      )}

      {/* 新しいリーグの登録フォーム */}
      <h2>Register New League</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="League name"
          value={newLeagueName}
          onChange={handleInputChange}
          required
          ref={nameInputRef} // リーグ名入力欄の参照を設定
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default LeaguesPage;
