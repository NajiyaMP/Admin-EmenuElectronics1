
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Metalprice() {
    const [metalPrices, setMetalPrices] = useState([]);

    useEffect(() => {
        fetchMetalPrices();
    }, []);

    const fetchMetalPrices = async () => {
        try {
            const response = await axios.get('/api/metal-prices');
            setMetalPrices(response.data);
        } catch (error) {
            console.error('Error fetching metal prices:', error);
        }
    };

    return (
        <div>
            <h1>Metal Prices</h1>
            <ul>
                {metalPrices.map((metalPrice, index) => (
                    <li key={index}>{metalPrice.currency}: {metalPrice.price}</li>
                ))}
            </ul>
        </div>
    );
}

export default Metalprice;
