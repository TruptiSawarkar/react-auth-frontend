const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
    async getProfile(token) {
        const response = await fetch(`${API_URL}/user/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }

        return response.json();
    },

    async updateProfile(token, profileData) {
        const response = await fetch(`${API_URL}/user/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        return response.json();
    },

    async saveUserData(token, data) {
        const response = await fetch(`${API_URL}/user/data`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to save data');
        }

        return response.json();
    },

    async getUserData(token) {
        const response = await fetch(`${API_URL}/user/data`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get data');
        }

        return response.json();
    },

    async testConnection() {
        try {
            const response = await fetch(`${API_URL}/test`);
            return response.ok;
        } catch (error) {
            return false;
        }
    }
};