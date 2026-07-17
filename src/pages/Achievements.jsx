import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import BilletinAvatar from "../components/BilletinAvatar";
import {
    getAchievements,
    getUserAchievements,
} from "../services/achievementService";
import api from "../services/api";

export default function Achievements() {

    const [allAchievements, setAllAchievements] =
        useState([]);

    const [unlocked, setUnlocked] =
        useState([]);

    useEffect(() => {
        loadAchievements();
    }, []);

    const loadAchievements = async () => {

        try {

            const userResponse =
                await api.get("/user");

            const user =
                userResponse.data;

            const achievements =
                await getAchievements();

            const userAchievements =
                await getUserAchievements(
                    user.id
                );

            setAllAchievements(
                achievements
            );

            setUnlocked(
                userAchievements
            );

        } catch (error) {

            console.error(error);
        }
    };

    const isUnlocked = (id) => {

        return unlocked.some(
            achievement =>
                achievement.id === id
        );
    };

    const unlockedCount =
        unlocked.length;

    const progress =
        allAchievements.length > 0
            ? (
                unlockedCount /
                allAchievements.length
            ) * 100
            : 0;

    const level =
        unlockedCount >= 15
            ? "💎 Maestro financiero"
            : unlockedCount >= 10
            ? "🥇 Inversor"
            : unlockedCount >= 5
            ? "🥈 Ahorrador"
            : "🥉 Principiante";

    return (

        <MainLayout>

            <div className="dashboard-header">

                <h1>
                    🏆 Logros
                </h1>

                <p>
                    Tu progreso en BilleterIA
                </p>

            </div>

            {/* BILLETÍN */}

            <div
                className="glass-card"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    marginBottom: "24px",
                }}
            >

                <BilletinAvatar
                    size={80}
                    mood={
                        progress >= 80
                            ? "happy"
                            : "normal"
                    }
                />

                <div>

                    <h3
                        style={{
                            marginBottom: "8px",
                        }}
                    >
                        Billetín dice
                    </h3>

                    <p
                        style={{
                            margin: 0,
                            color: "#94A3B8",
                        }}
                    >
                        {progress >= 80
                            ? "🎉 Estás muy cerca de completar todos los logros."
                            : `Has desbloqueado ${unlockedCount} logros. Sigue avanzando para subir de nivel.`}
                    </p>

                </div>

            </div>

            {/* NIVEL */}

            <div
                className="stats-grid"
                style={{
                    marginBottom: "24px",
                }}
            >

                <div className="glass-card">

                    <h3>
                        Nivel financiero
                    </h3>

                    <h2>
                        {level}
                    </h2>

                </div>

                <div className="glass-card">

                    <h3>
                        Logros desbloqueados
                    </h3>

                    <h2>
                        {unlockedCount}
                    </h2>

                </div>

                <div className="glass-card">

                    <h3>
                        Total logros
                    </h3>

                    <h2>
                        {allAchievements.length}
                    </h2>

                </div>

            </div>

            {/* PROGRESO */}

            <div
                className="glass-card achievements-summary"
            >

                <h3>
                    Progreso general
                </h3>

                <h2>
                    {progress.toFixed(0)}%
                </h2>

                <div className="progress-bar">

                    <div
                        className="progress-fill"
                        style={{
                            width: `${progress}%`,
                        }}
                    />

                </div>

                <p
                    style={{
                        color: "#94A3B8",
                        marginTop: "12px",
                    }}
                >
                    {unlockedCount} de{" "}
                    {allAchievements.length} logros completados
                </p>

            </div>

            {/* GRID LOGROS */}

            <div className="stats-grid">

                {allAchievements.map(
                    (achievement) => {

                        const unlockedAchievement =
                            isUnlocked(
                                achievement.id
                            );

                        return (

                            <div
                                key={achievement.id}
                                className="glass-card achievement-card"
                                style={{
                                    opacity:
                                        unlockedAchievement
                                            ? 1
                                            : 0.45,

                                    border:
                                        unlockedAchievement
                                            ? "1px solid rgba(79,209,197,.3)"
                                            : "1px solid rgba(255,255,255,.08)",
                                }}
                            >

                                <div
                                    style={{
                                        fontSize: "42px",
                                        marginBottom: "12px",
                                    }}
                                >
                                    {unlockedAchievement
                                        ? "🏆"
                                        : "🔒"}
                                </div>

                                <h3
                                    style={{
                                        color: "white",
                                        fontSize: "18px",
                                    }}
                                >
                                    {
                                        achievement.title
                                    }
                                </h3>

                                <p
                                    style={{
                                        color: "#94A3B8",
                                        minHeight: "50px",
                                    }}
                                >
                                    {
                                        achievement.description
                                    }
                                </p>

                                <p
                                    style={{
                                        marginTop: "20px",
                                        fontWeight: "600",
                                        color:
                                            unlockedAchievement
                                                ? "#22C55E"
                                                : "#94A3B8",
                                    }}
                                >

                                    {unlockedAchievement
                                        ? "✅ Desbloqueado"
                                        : "🔒 Bloqueado"}

                                </p>

                            </div>
                        );
                    }
                )}

            </div>

        </MainLayout>
    );
}