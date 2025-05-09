import { API_BASE_URL } from "@/constants/api";

export const getAvatarUrl = (path: string | undefined) => {
    if (!path) return '/src/assets/avatar.png';

    if (path.startsWith('file://')) {
        // Convert local path to server URL
        const fileName = path.split('/').pop() || '';
        return `${API_BASE_URL}/uploads/${fileName}`;
    }
    return path;
};