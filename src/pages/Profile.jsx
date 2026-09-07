import { useEffect, useState } from "react";
import api, { BASE_SERVER_URL } from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";

export default function Profile() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const { setUser: setContextUser } = useAuth();

    const [preferences, setPreferences] = useState({
        conversation_style: "",
        coach_background: "",
    });

    const [saved, setSaved] = useState(false);

    useEffect(() => {

        loadProfile();

    }, []);

    const loadProfile = async () => {
        try {
            const userResponse = await api.get("/user");
            setUser(userResponse.data);

            const preferenceResponse = await api.get(
                `/coach-preferences/${userResponse.data.id}`
            );

            if (preferenceResponse.data) {
                setPreferences({
                    conversation_style:
                        preferenceResponse.data.conversation_style || "",
                    coach_background:
                        preferenceResponse.data.coach_background || "",
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
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

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        setUploadingAvatar(true);
        try {
            const res = await api.post("/user/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setUser(res.data);
            setContextUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
        } catch (error) {
            console.error("Error al subir avatar:", error);
            alert("No se pudo subir la foto. Asegúrate de que es una imagen de menos de 2MB.");
        } finally {
            setUploadingAvatar(false);
            e.target.value = "";
        }
    };

    return (
        
            <MainLayout>

                <div className="page-container">

                    <h1>Perfil</h1>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "40px" }}>Cargando perfil...</div>
                    ) : (
                        <>
                            {user && (
                                <div className="glass-card" style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
                                    <div style={{ position: "relative" }}>
                                        {user.avatar ? (
                                            <img 
                                              src={user.avatar.startsWith('http') ? user.avatar : `${BASE_SERVER_URL}${user.avatar}`} 
                                              alt="Avatar" 
                                              style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--accent)" }} 
                                            />
                                        ) : (
                                            <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", border: "2px solid var(--border)", fontWeight: "bold" }}>
                                                {user.nickname.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, textAlign: "left" }}>
                                        <h2 style={{ margin: "0 0 5px 0" }}>{user.nickname}</h2>
                                        <p style={{ margin: "0 0 15px 0", color: "var(--text-h)" }}>{user.email}</p>
                                        <label style={{ display: "inline-block", padding: "8px 16px", backgroundColor: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", cursor: uploadingAvatar ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: "bold", opacity: uploadingAvatar ? 0.7 : 1 }}>
                                            {uploadingAvatar ? "Subiendo..." : "Cambiar foto"}
                                            <input type="file" style={{ display: "none" }} accept="image/*" onChange={handleAvatarChange} disabled={uploadingAvatar} />
                                        </label>
                                    </div>
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

                            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                                {["motivador", "cercano", "formal"].map((estilo) => (
                                    <button
                                        key={estilo}
                                        type="button"
                                        className={preferences.conversation_style === estilo ? "edit-btn" : "tone-btn"}
                                        onClick={() => setPreferences({
                                            ...preferences,
                                            conversation_style: estilo
                                        })}
                                        style={{
                                            flex: 1,
                                            padding: "10px",
                                            borderRadius: "8px",
                                            border: "1px solid var(--border)",
                                            backgroundColor: preferences.conversation_style === estilo ? "var(--accent)" : "var(--bg)",
                                            color: preferences.conversation_style === estilo ? "#fff" : "var(--text)",
                                            cursor: "pointer",
                                            transition: "all 0.3s ease",
                                            fontWeight: preferences.conversation_style === estilo ? "bold" : "normal"
                                        }}
                                    >
                                        {estilo.charAt(0).toUpperCase() + estilo.slice(1)}
                                    </button>
                                ))}
                            </div>

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
                                opacity: !preferences.conversation_style ? 0.5 : 1,
                                cursor: !preferences.conversation_style ? "not-allowed" : "pointer"
                            }}
                            onClick={
                                preferences.conversation_style ? savePreferences : undefined
                            }
                            disabled={!preferences.conversation_style}
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
                        </>
                    )}

                </div>
            </MainLayout>
    );
}