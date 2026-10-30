import { useEffect, useState } from "react";

function App() {
  const [authData, setAuthData] = useState(() => {
    const saved = localStorage.getItem("authData");
    return saved ? JSON.parse(saved) : null;
  });

  const [character, setCharacter] = useState(null);
  const [quests, setQuests] = useState([]);
  const [dailyData, setDailyData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");

  const [loginForm, setLoginForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  function xpNeeded(level) {
    return 100 + (level - 1) * 50;
  }

  function getCompletedQuestIds() {
    if (!character?.completedQuests) return [];

    if (Array.isArray(character.completedQuests)) {
      return character.completedQuests;
    }

    if (typeof character.completedQuests === "string") {
      try {
        const parsed = JSON.parse(character.completedQuests);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  }

  function loadCharacter() {
    if (!authData?.user?.characterId) return;

    fetch(`http://localhost:5000/characters/${authData.user.characterId}`)
      .then((res) => res.json())
      .then((data) => setCharacter(data))
      .catch(() => setMessage("Failed to load character"));
  }

  function loadQuests() {
    fetch("http://localhost:5000/quests")
      .then((res) => res.json())
      .then((data) => setQuests(data))
      .catch(() => setMessage("Failed to load quests"));
  }

  function loadDailyQuests() {
    fetch("http://localhost:5000/daily-quests")
      .then((res) => res.json())
      .then((data) => setDailyData(data))
      .catch(() => setMessage("Failed to load daily quests"));
  }

  function loadLeaderboard() {
  fetch("http://localhost:5000/characters/leaderboard")
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setLeaderboard(data);
      } else {
        setLeaderboard([]);
        setMessage("Leaderboard failed to load");
      }
    })
    .catch(() => {
      setLeaderboard([]);
      setMessage("Failed to load leaderboard");
    });
}

  useEffect(() => {
    if (authData) {
      loadCharacter();
      loadQuests();
      loadDailyQuests();
      loadLeaderboard();
    }
  }, [authData]);

  function handleRegister() {
    fetch("http://localhost:5000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(loginForm)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
          return;
        }

        const newAuthData = {
          user: data.user,
          token: data.token
        };

        localStorage.setItem("authData", JSON.stringify(newAuthData));
        setAuthData(newAuthData);
        setMessage("Registration successful");
        setLoginForm({
          name: "",
          email: "",
          password: ""
        });
      })
      .catch(() => setMessage("Registration failed"));
  }

  function handleLogin() {
    fetch("http://localhost:5000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: loginForm.email,
        password: loginForm.password
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
          return;
        }

        const newAuthData = {
          user: data.user,
          token: data.token
        };

        localStorage.setItem("authData", JSON.stringify(newAuthData));
        setAuthData(newAuthData);
        setMessage("Login successful");
        setLoginForm({
          name: "",
          email: "",
          password: ""
        });
      })
      .catch(() => setMessage("Login failed"));
  }

  function handleLogout() {
    localStorage.removeItem("authData");
    setAuthData(null);
    setCharacter(null);
    setQuests([]);
    setDailyData(null);
    setLeaderboard([]);
    setMessage("Logged out");
  }

  function completeQuest(questId) {
    if (!authData?.user?.characterId || !authData?.token) return;

    fetch("http://localhost:5000/quests/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.token}`
      },
      body: JSON.stringify({
        questId,
        characterId: authData.user.characterId
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
          return;
        }

        setMessage(`Completed: ${data.quest}`);
        loadCharacter();
        loadLeaderboard();
      })
      .catch(() => {
        setMessage("Something went wrong while completing quest");
      });
  }

 function completeDailyQuest(questId) {
  if (!authData?.user?.characterId || !authData?.token) return;

  fetch("http://localhost:5000/daily-quests/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authData.token}`
    },
    body: JSON.stringify({
      questId,
      characterId: authData.user.characterId
    })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        setMessage(data.error);
        return;
      }

      setMessage(data.message || "Daily Quest Completed Successfully 🎉");
      loadCharacter();
      loadLeaderboard();
      loadDailyQuests();
    })
    .catch(() => {
      setMessage("Network error while completing daily quest");
    });
}

  function filterButtonStyle(value) {
    return {
      padding: "10px 16px",
      margin: "0 6px 10px 6px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      background: filter === value ? "#3b82f6" : "#334155",
      color: "white",
      transition: "0.3s"
    };
  }

  function difficultyBadgeStyle(difficulty) {
    return {
      padding: "6px 12px",
      borderRadius: "999px",
      fontWeight: "bold",
      background:
        difficulty === "easy"
          ? "#16a34a"
          : difficulty === "medium"
          ? "#f59e0b"
          : "#dc2626",
      color: "white",
      display: "inline-block"
    };
  }

  function rankStyle(rank) {
    return {
      fontWeight: "bold",
      color:
        rank === 1
          ? "#facc15"
          : rank === 2
          ? "#d1d5db"
          : rank === 3
          ? "#fb923c"
          : "white"
    };
  }

  if (!authData) {
    return (
      <>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div
          style={{
            background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
            color: "white",
            minHeight: "100vh",
            padding: "40px",
            fontFamily: "Arial",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "rgba(30, 41, 59, 0.8)",
              backdropFilter: "blur(10px)",
              padding: "30px",
              borderRadius: "14px",
              border: "1px solid #334155",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              animation: "fadeIn 0.5s ease-in-out"
            }}
          >
            <h1 style={{ textAlign: "center" }}>💰 Financial Literacy RPG</h1>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              Login / Register
            </h2>

            <input
              type="text"
              placeholder="Name (for register)"
              value={loginForm.name}
              onChange={(e) =>
                setLoginForm({ ...loginForm, name: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "12px",
                borderRadius: "8px",
                border: "none",
                boxSizing: "border-box"
              }}
            />

            <input
              type="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "12px",
                borderRadius: "8px",
                border: "none",
                boxSizing: "border-box"
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "16px",
                borderRadius: "8px",
                border: "none",
                boxSizing: "border-box"
              }}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleLogin}
                onMouseOver={(e) => (e.target.style.background = "#2563eb")}
                onMouseOut={(e) => (e.target.style.background = "#3b82f6")}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#3b82f6",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "0.3s"
                }}
              >
                Login
              </button>

              <button
                onClick={handleRegister}
                onMouseOver={(e) => (e.target.style.background = "#16a34a")}
                onMouseOut={(e) => (e.target.style.background = "#22c55e")}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#22c55e",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "0.3s"
                }}
              >
                Register
              </button>
            </div>

            {message && (
              <p style={{ marginTop: "16px", textAlign: "center" }}>{message}</p>
            )}
          </div>
        </div>
      </>
    );
  }

  if (!character) {
    return (
      <div
        style={{
          background: "#0f172a",
          color: "white",
          minHeight: "100vh",
          padding: "40px",
          fontFamily: "Arial"
        }}
      >
        <h2>Loading character...</h2>
      </div>
    );
  }

 const currentXp = character?.currentLevelXp ?? 0;
 const requiredXp = character?.nextLevelXp ?? 100;
 const xpPercent = Math.min((currentXp / requiredXp) * 100, 100);
 const completedQuestIds = getCompletedQuestIds();

  const filteredQuests = quests.filter(
    (quest) => filter === "all" || quest.difficulty === filter
  );

  return (
    <div
      style={{
        background: "#0f172a",
        color: "white",
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "Arial"
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        💰 Financial Literacy RPG
      </h1>

      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        Welcome, {authData?.user?.name} 👋
      </h3>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#ef4444",
            color: "white",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          border: "1px solid #334155",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
          background: "#1e293b",
          textAlign: "center"
        }}
      >
        <h2>👤 Character: {character.name}</h2>
        <p>Level: {character.level}</p>
        <p>XP: {currentXp} / {requiredXp}</p>
        <p>Gold: {character.gold}</p>
        <p>Completed Quests: {completedQuestIds.length}</p>

        <div
          style={{
            marginTop: "25px",
            maxWidth: "500px",
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          <div
            style={{
              height: "30px",
              background: "#1f2937",
              borderRadius: "999px",
              overflow: "hidden",
              border: "2px solid #64748b"
            }}
          >
            <div
              style={{
                width: `${xpPercent}%`,
                height: "100%",
                background: "linear-gradient(90deg,#22c55e,#3b82f6)",
                transition: "width 0.4s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold"
              }}
            >
              {Math.floor(xpPercent)}%
            </div>
          </div>

          <p style={{ marginTop: "10px", fontWeight: "bold" }}>
            XP Progress: {currentXp} / {requiredXp}
          </p>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #334155",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
          background: "#1e293b"
        }}
      >
        <h2 style={{ textAlign: "center" }}>🏆 Leaderboard</h2>

        {leaderboard.length === 0 ? (
          <p style={{ textAlign: "center" }}>No leaderboard data</p>
        ) : (
          leaderboard.map((player) => (
            <div
              key={player.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                marginBottom: "10px",
                borderRadius: "10px",
                background:
                  player.id === authData?.user?.characterId
                    ? "#1d4ed8"
                    : "#0f172a",
                border: "1px solid #475569"
              }}
            >
              <div style={rankStyle(player.rank)}>
                #{player.rank} {player.name}
              </div>
              <div>
                Level {player.level} | XP {player.xp} | Gold {player.gold}
              </div>
            </div>
          ))
        )}
      </div>

      {dailyData?.quests && (
        <div
          style={{
            border: "1px solid #334155",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
            background: "#1e293b"
          }}
        >
          <h2 style={{ textAlign: "center" }}>📅 Daily Quests</h2>
          <p style={{ textAlign: "center" }}>Date: {dailyData.date}</p>

          {dailyData.quests.map((quest) => {
            const alreadyCompleted = completedQuestIds.includes(quest.id);

            return (
              <div
                key={quest.id}
                style={{
                  border: "1px solid #475569",
                  borderRadius: "10px",
                  padding: "15px",
                  marginBottom: "12px",
                  background: "#0f172a",
                  textAlign: "center"
                }}
              >
                <h3>{quest.title}</h3>
                <p>{quest.description}</p>
                <div style={{ marginBottom: "10px" }}>
                  <span style={difficultyBadgeStyle(quest.difficulty)}>
                    {quest.difficulty.toUpperCase()}
                  </span>
                </div>
                <p>XP Reward: {quest.xpReward}</p>
                <p>Gold Reward: {quest.goldReward}</p>

                <button
                  onClick={() => completeDailyQuest(quest.id)}
                  disabled={alreadyCompleted}
                  style={{
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: "8px",
                    background: alreadyCompleted ? "gray" : "#22c55e",
                    color: "white",
                    cursor: alreadyCompleted ? "not-allowed" : "pointer"
                  }}
                >
                  {alreadyCompleted ? "Completed" : "Complete Daily Quest"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div
        style={{
          border: "1px solid #334155",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
          background: "#1e293b"
        }}
      >
        <h2 style={{ textAlign: "center" }}>📘 Quests</h2>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <button style={filterButtonStyle("all")} onClick={() => setFilter("all")}>
            All
          </button>
          <button style={filterButtonStyle("easy")} onClick={() => setFilter("easy")}>
            Easy
          </button>
          <button
            style={filterButtonStyle("medium")}
            onClick={() => setFilter("medium")}
          >
            Medium
          </button>
          <button style={filterButtonStyle("hard")} onClick={() => setFilter("hard")}>
            Hard
          </button>
        </div>

        {filteredQuests.length === 0 ? (
          <p style={{ textAlign: "center" }}>No quests available</p>
        ) : (
          filteredQuests.map((quest) => {
            const alreadyCompleted = completedQuestIds.includes(quest.id);

            return (
              <div
                key={quest.id}
                style={{
                  border: "1px solid #475569",
                  borderRadius: "10px",
                  padding: "15px",
                  marginBottom: "12px",
                  background: "#0f172a",
                  textAlign: "center"
                }}
              >
                <h3>{quest.title}</h3>
                <p>{quest.description}</p>
                <p>Category: {quest.category}</p>

                <div style={{ marginBottom: "10px" }}>
                  <span style={difficultyBadgeStyle(quest.difficulty)}>
                    {quest.difficulty.toUpperCase()}
                  </span>
                </div>

                <p>XP Reward: {quest.xpReward}</p>
                <p>Gold Reward: {quest.goldReward}</p>

                <button
                  onClick={() => completeQuest(quest.id)}
                  disabled={alreadyCompleted}
                  style={{
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: "8px",
                    background: alreadyCompleted ? "gray" : "#22c55e",
                    color: "white",
                    cursor: alreadyCompleted ? "not-allowed" : "pointer"
                  }}
                >
                  {alreadyCompleted ? "Completed" : "Complete Quest"}
                </button>
              </div>
            );
          })
        )}
      </div>

      <div
        style={{
          border: "1px solid #334155",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
          background: "#1e293b",
          textAlign: "center"
        }}
      >
        <h2>🏆 Achievements</h2>

        {character.achievements.length === 0 ? (
          <p>No achievements yet</p>
        ) : (
          character.achievements.map((a) => (
            <div key={a.id} style={{ marginBottom: "10px" }}>
              <b>{a.title}</b> — {a.description}
            </div>
          ))
        )}
      </div>

      {message && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "10px",
            background: "#334155",
            textAlign: "center"
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default App;