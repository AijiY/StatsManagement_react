import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { getCountries } from "../apis/GetMappings.js";

function CountriesPage() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const { showToast } = useToast();
  const nameInputRef = useRef(null); // 国名入力欄の参照を作成

  const [countries, setCountries] = useState([]);
  const [newCountryName, setNewCountryName] = useState(""); // 新規登録用のstate
  const [isLoading, setIsLoading] = useState(true); // このページは初期ページであり、読み込みに時間がかかるため、読み込み中の状態を管理

  useEffect(() => {
    getCountries(setCountries).finally(() => setIsLoading(false));
  }, []);

  // フォームの入力値を管理
  const handleInputChange = (e) => {
    setNewCountryName(e.target.value);
  };

  // 新しい国を登録する処理
  const handleFormSubmit = (e) => {
    e.preventDefault(); // ページリロードを防ぐ

    fetch(`${apiUrl}/country`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        name: newCountryName,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return response.text().then((text) => {
          throw new Error(text);
        });
      })
      .then((newCountry) => {
        setCountries([...countries, newCountry]); // 新しい国をリストに追加
        setNewCountryName(""); // 入力欄をリセット
        // 成功メッセージをトーストで表示
        showToast(`Country '${newCountry.name}' registered successfully!`);
        // 国名入力欄にフォーカスを移動
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      })
      .catch((error) => {
        alert("Error: " + error.message);
        console.error(error);
      });
  };

  return (
    <div>
      <nav>
        {/* Homeに戻るリンク */}
        <Link to="/">Home</Link>
      </nav>

      <main>
        <section>
          <h1>Countries</h1>
          {isLoading ? (
            <p>Loading...</p>
          ) : !countries || countries.length === 0 ? (
            <p>No country data</p>
          ) : (
            <ul>
              {countries.map((country) => (
                <li key={country.id}>
                  <Link to={`/countries/${country.id}/leagues`}>
                    {country.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/countries/0/leagues/0/clubs/0/players">その他</Link>
              </li>
            </ul>
          )}
        </section>

        {/* 新しい国の登録フォーム */}
        <section>
          <h2>Register New Country</h2>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Country name"
              value={newCountryName}
              onChange={handleInputChange}
              required
              ref={nameInputRef}
            />
            <button type="submit">Register</button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default CountriesPage;
