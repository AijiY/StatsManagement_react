import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function HomePage() {
    return (
        <div>
            <h1>Football Stats Management System</h1>

            {/* CountriesPageへのリンク */}
            <Link to="/countries">Data Management</Link>
            <br />
            <Link to="/register-season">Register New Season</Link>
        </div>
    );
}

export default HomePage;
