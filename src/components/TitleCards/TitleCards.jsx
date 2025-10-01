import React, { useState, useEffect, useRef } from 'react';
import './TitleCards.css';
import { Link } from 'react-router-dom';

const TitleCards = ({ title , category}) => {
    const [apiData, setApiData] = useState([]);
    const [error, setError] = useState(null);
    const cardsRef = useRef();

    const options = {
        method: 'GET',
        headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZDE3MDI2ZjQ4NjliZWRhZDk2MDNjMjBkNzJjMjVlOCIsIm5iZiI6MTc1ODIxNzM3MC4zMTIsInN1YiI6IjY4Y2M0NDlhMTkzNmFiMTcyNDRkYmExNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.emCn2QQz44Xa0FWI9j_aGp_ZZ52uqiAJVwdA2WrQyP4'
        }
    };

    const handleWheel = (e) => {
        e.preventDefault();
        if (cardsRef.current) {
        cardsRef.current.scrollLeft += e.deltaY;
        }
    };

    useEffect(() => {
        if (!cardsRef.current) return;

        fetch(`https://api.themoviedb.org/3/movie/${category? category : "now_playing"}?language=en-US&page=1`, options)
        .then((res) => {
            if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then((res) => setApiData(res.results || []))
        .catch((err) => {
            console.error(err);
            setError('Failed to fetch movies. Please check your API key or network.');
        });

        const cards = cardsRef.current;
        cards.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
        cards.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <div className="titleCards">
        <h2>{title ? title : 'Popular on Netflix'}</h2>
        {error && <p className="error">{error}</p>}

        <div className="card-list" ref={cardsRef}>
            {apiData.length > 0 ? (
            apiData.map((card, index) => (
                <Link to={`/player/${card.id}`} className="card" key={index}>
                {card.backdrop_path ? (
                    <img
                    src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`}
                    alt={card.original_title}
                    />
                ) : (
                    <div className="no-image">No Image</div>
                )}
                <p>{card.original_title}</p>
                </Link>
            ))
            ) : (
            !error && <p>Loading...</p>
            )}
        </div>
        </div>
    );
    };

export default TitleCards;
