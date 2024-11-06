import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function HomePage() {
    return (
        <div>
            <h1>Football Stats Management System</h1>

            {/* CountriesPageへのリンク */}
            <Link to="/countries" style={{fontSize:"1.2em"}}>Data Management</Link>
            <br />
            <Link to="/register-season" style={{fontSize:"1.2em"}}>Register New Season</Link>

            <br /><br />
            <hr />

            <h2>作成背景（Background）</h2>
            <p>
                SpringBootを使用したWebアプリケーション開発の学習成果として、自分の好きな国やリーグのサッカーの試合成績を管理できるRestAPIを用いたシステムを作成しました。
                <br />
                また、実際の登録や検索機能を使いやすくするために、このCreate React Appによるクライアントページを作成しました。
            </p>

            <h2>機能（Function）</h2>
            <ul>
                <li><strong>登録</strong>：国～選手までの基本データ、および試合結果を登録できます。</li>
                <li><strong>検索</strong>：上記の基本データおよび子順位表や個人成績などを検索できます。</li>
                <li><strong>更新</strong>：選手情報の更新（名前、背番号の変更およびクラブの移籍）ができます。</li>
            </ul>

            <h2>GitHubリポジトリ（GitHub Repository）</h2>
            <p>下記のリンクから、このシステムのリポジトリを確認できます。</p>
            <ul>
                <li><a href="https://github.com/AijiY/FootballStatsManagement" target='_blank'>Webアプリケーション</a></li>
                <li><a href="https://github.com/AijiY/StatsManagement_react" target='_blank'>クライアントページ</a></li>
            </ul>
        </div>
    );
}

export default HomePage;
