const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: `${API_BASE_URL}/signin`,
    REGISTER: `${API_BASE_URL}/users/register`,
  },

  USER: {
    INDEX: `${API_BASE_URL}/users`,
    CHANGE_PASSWORD: `${API_BASE_URL}/users/change_password`,
    SHOW: `${API_BASE_URL}/users/me`,
    UPDATE: `${API_BASE_URL}/users/me`,
  },

  CONTACT: {
    INDEX: `${API_BASE_URL}/api/contacts`,
    CREATE: `${API_BASE_URL}/api/contacts`,
  },

  CHAT: {
    INDEX: `${API_BASE_URL}/api/chats`,
    CREATE: `${API_BASE_URL}/api/chats`,
    SHOW: (chatId: number) => `${API_BASE_URL}/api/chats/${chatId}`,
    UPDATE: (chatId: number) => `${API_BASE_URL}/api/chats/${chatId}`,
    DESTROY: (chatId: number) => `${API_BASE_URL}/api/chats/${chatId}`,
    FETCH_IMAGES: (chatId: number) =>
      `${API_BASE_URL}/api/chats/${chatId}/fetch_images`,
  },

  MESSAGE: {
    INDEX: (chatId: number) => `${API_BASE_URL}/api/chats/${chatId}/messages`,
    CREATE: (chatId: number) => `${API_BASE_URL}/api/chats/${chatId}/messages`,
    UNSEND: (chatId: number, messageId: number) =>
      `${API_BASE_URL}/api/chats/${chatId}/messages/${messageId}/unsend`,
    DESTROY: (chatId: number, messageId: number) =>
      `${API_BASE_URL}/api/chats/${chatId}/messages/${messageId}`,
    READ: (chatId: number) =>
      `${API_BASE_URL}/api/chats/${chatId}/messages/read`,
  },
};

export default API_ENDPOINTS;
