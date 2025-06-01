/* eslint-disable no-throw-literal */
import axios from 'axios';

const baseURL = 'http://localhost:3021';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para registrar usuario
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registrando usuario:', error);
    throw error;
  }
};

// Función para reenviar correo de confirmación
export const resendConfirmationEmail = async (correo) => {
  try {
    const response = await axiosInstance.post('/resend-confirmation', { correo });
    return response.data;
  } catch (error) {
    console.error('Error reenviando correo de confirmación:', error);
    throw error;
  }
};

// Función para loguear usuario
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('/login', credentials);
    return response.data;
  } catch (error) {
    // Verificar si hay una respuesta del servidor
    if (error.response) {
      // Verificar si el error es por cuenta no confirmada
      if (error.response.status === 403 && error.response.data.unconfirmed) {
        throw {
          message: 'Cuenta no confirmada',
          response: error.response
        };
      }
    } else {
      console.error('Error sin respuesta:', error);
    }
    // Propagar el error para el manejo en el componente
    throw error;
  }
};

// Función para eliminar la cuenta
export const deleteAccount = async (userId) => {
  try {
    await axiosInstance.delete('/delete-account', { data: { userId } });
  } catch (error) {
    console.error('Error eliminando la cuenta:', error);
    throw error;
  }
};

export const recoverPassword = async (email) => {
  try {
      const response = await axiosInstance.post('/reset', { email });
      return response.data;
  } catch (error) {
      console.error('Error recuperando contraseña:', error);
      throw error;
  }
};

// Función para restablecer la contraseña
export const resetPassword = async (token, newPassword) => {
  try {
      const response = await axiosInstance.post('/reset-password', { token, contraseña: newPassword });
      return response.data;
  } catch (error) {
      console.error('Error restableciendo la contraseña:', error);
      throw error;
  }
};

export const confirmAccount = async (token) => {
  try{
    const response = await axiosInstance.post('/confirm-account', { token });
    return response;
  } catch (error) {
    console.error("Error al confirmar la cuenta:", error);
    throw error;
  }
}

// Función para agregar un nuevo ebook
export const addBook = async (bookData) => {
  try {
    const response = await axiosInstance.post('/addBook', bookData);
    return response.data;
  } catch (error) {
    console.error('Error al agregar el ebook:', error);
    throw error;
  }
};

// Función para obtener todos los ebooks
export const getAllBooks = async () => {
  try {
    const response = await axiosInstance.get('/allBooks');
    return response.data; // Devuelve los datos de todos los ebooks
  } catch (error) {
    console.error('Error obteniendo ebooks:', error);
    throw error;
  }
};

// Función para obtener los ebooks de las últimas 24 horas
export const getNewsBooks = async () => {
  try {
    const response = await axiosInstance.get('/newsBooks');
    return response.data; // Devuelve los datos de los ebooks nuevos
  } catch (error) {
    console.error('Error obteniendo ebooks nuevos:', error);
    throw error;
  }
};

// Función para obtener ebooks por categoría
export const getBooksByCategory = async (categoria) => {
  try {
    if (!categoria) {
      throw new Error('La categoría es requerida');
    }
    const response = await axiosInstance.get('/booksByCategory', {
      params: { categoria }
    });
    return response.data; // Devuelve los datos de los ebooks por categoría
  } catch (error) {
    console.error('Error obteniendo ebooks por categoría:', error);
    throw error; // Propaga el error para manejo en el lugar de llamada
  }
};

// Función para guardar un ebook para un usuario
export const saveBook = async (userId, bookId) => {
  try {
    const response = await axiosInstance.post('/save-book', {
      user_id: userId,
      book_id: bookId
    });
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error('Error al guardar el ebook:', error);
    throw error; // Propaga el error para manejo en el lugar de llamada
  }
};

// Función para eliminar un ebook guardado
export const removeSavedBook = async (userId, bookId) => {
  try {
    const response = await axiosInstance.delete(`/deleteSavedBook`, {
      data: { user_id: userId, book_id: bookId }, // Enviar los datos en el cuerpo de la solicitud DELETE
    });
    return response.data;
  } catch (error) {
    console.error('Error eliminando el book guardado:', error);
    return { success: false, message: 'Error eliminando el book guardado.' };
  }
};

// Función para obtener los ebooks subidos por un usuario
export const getBooksByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/getBooksByUser/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los ebooks del usuario:', error);
    throw error;
  }
};

// Función para eliminar un ebook
export const deleteBook = async (bookId) => {
  try {
    const response = await axiosInstance.delete(`/deleteBook/${bookId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el ebook:', error);
    throw error;
  }
};
