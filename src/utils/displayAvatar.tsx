import { API_BASE_URL } from "@/constants/api";

export const getAvatarUrl = (path: string | undefined) => {
    if (!path) return 'https://i.pinimg.com/236x/69/c4/2f/69c42f0fda1f02d565f835fe92ca6944.jpg';

    if (path.startsWith('file://')) {
        // Convert local path to server URL
        const fileName = path.split('/').pop() || '';
        return `${API_BASE_URL}/uploads/${fileName}`;
    }
    return path;
};