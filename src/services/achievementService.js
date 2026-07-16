import api from "./api";

export const getAchievements = async () => {

    const response = await api.get(
        "/achievements"
    );

    return response.data;
};

export const getUserAchievements = async (
    userId
) => {

    const response = await api.get(
        `/users/${userId}/achievements`
    );

    return response.data;
};