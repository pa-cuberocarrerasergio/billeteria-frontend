import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function Profile() {

    const [user, setUser] = useState(null);

    const [preferences, setPreferences] = useState({
        conversation_style: "motivador",
        coach_background: "",
    });

    const [saved, setSaved] = useState(false);

    useEffect(() => {

        loadProfile();

    }, []);

    const loadProfile = async () => {

        try {

            const userResponse =
                await api.get("/user");

            setUser(userResponse.data);

            const preferenceResponse =
                await api.get(
                    `/coach-preferences/${userResponse.data.id}`
                );

            if (preferenceResponse.data) {

                setPreferences({
                    conversation_style:
                        preferenceResponse.data
                            .conversation_style,
                    coach_background:
                        preferenceResponse.data
                            .coach_background,
                });
            }

        } catch (error) {

            console.error(error);
        }
    };

    const savePreferences = async () => {

        try {

            await api.put(
                `/coach-preferences/${user.id}`,
                preferences
            );

            setSaved(true);

            setTimeout(() => {

                setSaved(false);

            }, 3000);

        } catch (error) {

            console.error(error);
        }
    };

    return (
        
            <MainLayout>

                <div className="page-container">

                    <h1>Perfil</h1>

                    {user && (

                        <div
                            className="glass-card"
                            style={{
                                marginBottom: "20px",
                            }}
                        >

                            <h2>
                                {user.name}
                            </h2>

                            <p>
                                {user.email}
                            </p>

                        </div>
                    )}

                    <div className="glass-card">

                        <h2>
                            Configuración de Billetín
                        </h2>

                        <div
                            style={{
                                marginTop: "20px",
                            }}
                        >

                            <label>
                                Estilo de conversación
                            </label>

                            <select
                                value={
                                    preferences
                                        .conversation_style
                                }
                                onChange={(e) =>
                                    setPreferences({
                                        ...preferences,
                                        conversation_style:
                                            e.target.value,
                                    })
                                }
                            >
                                <option value="motivador">
                                    Motivador
                                </option>

                                <option value="cercano">
                                    Cercano
                                </option>

                                <option value="formal">
                                    Formal
                                </option>

                            </select>

                        </div>

                        <div
                            style={{
                                marginTop: "20px",
                            }}
                        >

                            <label>
                                Contexto personal
                            </label>

                            <textarea
                                rows="5"
                                value={
                                    preferences
                                        .coach_background
                                }
                                onChange={(e) =>
                                    setPreferences({
                                        ...preferences,
                                        coach_background:
                                            e.target.value,
                                    })
                                }
                            />

                        </div>

                        <button
                            className="edit-btn"
                            style={{
                                marginTop: "20px",
                            }}
                            onClick={
                                savePreferences
                            }
                        >
                            Guardar preferencias
                        </button>

                        {saved && (

                            <p
                                style={{
                                    color:
                                        "#22c55e",
                                }}
                            >
                                Preferencias guardadas
                            </p>
                        )}

                    </div>

                </div>
            </MainLayout>
    );
}