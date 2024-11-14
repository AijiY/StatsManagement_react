import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { getClub, getCountry, getLeague, getPlayer } from "../apis/GetMappings";

function PatchPlayerPage() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const { showToast } = useToast();
  const navigate = useNavigate();

  const { playerId } = useParams();
  const [player, setPlayer] = useState("");

  const [club, setClub] = useState("");
  const [league, setLeague] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    getPlayer(playerId, setPlayer);
  }, [playerId]);
  useEffect(() => {
    if (player) {
      getClub(player.clubId, setClub);
    }
  }, [player]);
  useEffect(() => {
    if (club) {
      getLeague(club.leagueId, setLeague);
    }
  }, [club]);
  useEffect(() => {
    if (league) {
      getCountry(league.countryId, setCountry);
    }
  }, [league]);

  // フォームの入力値を管理
  const handleInputChange = (e) => {
    const { name, value } = e.target; // 変更されたフィールドのnameとvalueを取得
    if (name === "playerName") {
      setPlayer({ ...player, name: value }); // 選手名を更新
    } else if (name === "number") {
      setPlayer({ ...player, number: value }); // 背番号を更新
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const playerForPatch = {
      name: player.name,
      number: player.number,
    };

    fetch(`${apiUrl}/player-patch/${playerId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerForPatch),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return response.text().then((text) => {
          throw new Error(text);
        });
      })
      .then(() => {
        showToast(`Player ${player.name} is updated!`);
        navigate(
          `/countries/${country.id}/leagues/${league.id}/clubs/${club.id}/players`
        );
      })
      .catch((error) => {
        alert("Error: " + error.message);
        console.error(error);
      });
  };

  const handleGoBack = () => {
    navigate(-1); // 前のページに戻る
  };

  return (
    <div>
      <nav>
        {/* Homeに戻るリンク */}
        <Link to="/">Home</Link>
        <br /> {/* 改行 */}
        {/* 元のページに戻るリンク */}
        <Link onClick={handleGoBack}>Back</Link>
      </nav>

      <main>
        <h1>Update Player's Number or Name</h1>
        <form onSubmit={handleFormSubmit}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label style={{ width: "70px" }}>Number:</label>
              <input
                type="number"
                name="number"
                value={player.number}
                onChange={handleInputChange}
                required
                style={{ width: "40px" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label style={{ width: "70px" }}>Name:</label>
              <input
                type="text"
                name="playerName"
                value={player.name}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <button type="submit" onClick={handleFormSubmit}>
            Update
          </button>
        </form>
      </main>
    </div>
  );
}

export default PatchPlayerPage;
