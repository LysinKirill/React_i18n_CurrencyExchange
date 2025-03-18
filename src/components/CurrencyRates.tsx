import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CurrencyRates.css';

interface Rate {
    currency: string;
    rate: number;
}

const CurrencyRates: React.FC = () => {
    const [rates, setRates] = useState<Rate[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await axios.get('https://v1.apiplugin.io/v1/currency/Pi3nJmfG/rates?source=RUB', {
                    params: {
                        target: 'USD,EUR,GBP'
                    }
                });

                const data = response.data;
                if (data && data.rates) {
                    const ratesData: Rate[] = Object.keys(data.rates).map((currency) => ({
                        currency,
                        rate: 1 / data.rates[currency]
                    }));
                    setRates(ratesData);
                    setLastUpdated(new Date());
                }
            } catch (err) {
                setError('Не удалось загрузить данные о курсе валют.');
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
    }, []);

    if (loading) {
        return <div className="loading">Загрузка...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="currency-rates-container">
            <h1>Курс валют к рублю</h1>
            <div className="rates-card">
                <ul>
                    {rates.map((rate) => (
                        <li key={rate.currency}>
                            <span className="currency">1 {rate.currency}</span>
                            <span className="rate">
                                {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(rate.rate)}
                            </span>
                        </li>
                    ))}
                </ul>
                {lastUpdated && (
                    <p className="last-updated">
                        Данные актуальны на: {new Intl.DateTimeFormat('ru-RU', { dateStyle: 'full', timeStyle: 'long' }).format(lastUpdated)}
                    </p>
                )}
            </div>
        </div>
    );
};

export default CurrencyRates;