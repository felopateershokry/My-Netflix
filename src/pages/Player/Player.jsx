import React, { useEffect, useState } from "react";
import "./Player.css";
import back_arrow_icon from "../../assets/back_arrow_icon.png";
import { useParams, useNavigate } from "react-router-dom";

// ⚠️ Replace with your actual TMDB API key
const TMDB_API_KEY = "YOUR_REAL_TMDB_API_KEY";

// Hardcoded fallback trailer (Avengers: Infinity War trailer)
const FALLBACK_VIDEO = {
  key: "6ZfuNTqbHE8",
  name: "Avengers: Infinity War Trailer",
  type: "Trailer",
  published_at: "2018-03-16",
};

const Player = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No movie ID provided");
      setApiData(FALLBACK_VIDEO);
      return;
    }

    setLoading(true);
    setError("");
    setApiData(null);

    // ✅ Use api_key instead of Bearer
    fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US&api_key=${TMDB_API_KEY}`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((resJson) => {
        const results = Array.isArray(resJson.results) ? resJson.results : [];

        // Prefer Trailer > any YouTube video > fallback
        const video =
          results.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
          results.find((v) => v.site === "YouTube") ||
          FALLBACK_VIDEO;

        setApiData({
          key: video.key,
          name: video.name,
          type: video.type,
          published_at: video.published_at || "",
        });
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Network/Fetch error: " + err.message);
        setApiData(FALLBACK_VIDEO); // fallback if API fails
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const embedUrl =
    apiData && apiData.key
      ? `https://www.youtube.com/embed/${apiData.key}`
      : "";

  return (
    <div className="player">
      <img
        src={back_arrow_icon}
        alt="back"
        onClick={() => navigate(-1)}
        style={{ cursor: "pointer" }}
      />

      {loading && <p>Loading trailer...</p>}

      {!loading && error && (
        <div className="no-trailer">
          <p>{error}</p>
        </div>
      )}

      {!loading && apiData && apiData.key && (
        <>
          <iframe
            width="90%"
            height="90%"
            src={embedUrl}
            title={apiData.name || "trailer"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="player-info">
            <p>{apiData.published_at?.slice(0, 10)}</p>
            <p>{apiData.name}</p>
            <p>{apiData.type}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Player;
