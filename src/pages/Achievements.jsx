import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
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
                                className="glass-card"
                                style={{
                                    opacity:
                                        unlockedAchievement
                                            ? 1
                                            : 0.45,
                                }}
                            >

                                <h2
                                    style={{
                                        fontSize:
                                            "50px",
                                    }}
                                >
                                    {unlockedAchievement
                                        ? "🏆"
                                        : "🔒"}
                                </h2>

                                <h3>
                                    {
                                        achievement.title
                                    }
                                </h3>

                                <p>
                                    {
                                        achievement.description
                                    }
                                </p>

                                <p>

                                    {unlockedAchievement
                                        ? "Desbloqueado"
                                        : "Bloqueado"}

                                </p>

                            </div>
                        );
                    }
                )}

            </div>

        </MainLayout>
    );
}