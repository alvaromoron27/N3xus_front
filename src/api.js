/* eslint-disable no-throw-literal */
import axios from "axios";

//URL base del backend
//const baseURL = "https://n3xus.onrender.com/api";
const baseURL = "http://localhost:3021/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Función para registrar usuario
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/register", userData);
    return response.data;
  } catch (error) {
    console.error("Error registrando usuario:", error);
    throw error;
  }
};

// Función para reenviar correo de confirmación
export const resendConfirmationEmail = async (identificador) => {
  try {
    const response = await axiosInstance.post("/resend-confirmation", {
      identificador,
    });
    return response.data;
  } catch (error) {
    console.error("Error reenviando correo de confirmación:", error);
    throw error;
  }
};

// Función para loguear usuario
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/login", credentials);
    return response.data;
  } catch (error) {
    // Verificar si hay una respuesta del servidor
    if (error.response) {
      // Verificar si el error es por cuenta no confirmada
      if (error.response.status === 403 && error.response.data.unconfirmed) {
        throw {
          message: "Cuenta no confirmada",
          response: error.response,
        };
      }
    } else {
      console.error("Error sin respuesta:", error);
    }
    // Propagar el error para el manejo en el componente
    throw error;
  }
};

// Función para eliminar la cuenta
export const deleteAccount = async (userId) => {
  try {
    await axiosInstance.delete("/delete-account", { data: { userId } });
  } catch (error) {
    console.error("Error eliminando la cuenta:", error);
    throw error;
  }
};

export const recoverPassword = async (email) => {
  try {
    const response = await axiosInstance.post("/reset", { email });
    return response.data;
  } catch (error) {
    console.error("Error recuperando contraseña:", error);
    throw error;
  }
};

// Función para restablecer la contraseña
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axiosInstance.post("/reset-password", {
      token,
      contraseña: newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error restableciendo la contraseña:", error);
    throw error;
  }
};

// Función para verificar si el token de recuperación es válido
export const verifyResetToken = async (token) => {
  try {
    const response = await axiosInstance.get(`/verify-reset-token/${token}`);
    return response.data;
  } catch (error) {
    console.error("Error verificando el token de recuperación:", error);
    throw error;
  }
};


export const confirmAccount = async (token) => {
  try {
    const response = await axiosInstance.post("/confirm-account", { token });
    return response;
  } catch (error) {
    console.error("Error al confirmar la cuenta:", error);
    throw error;
  }
};

export const editAvatar = async (file, user_id) => {
  const formData = new FormData();
  formData.append("avatar", file);
  formData.append("user_id", user_id);

  try {
    const response = await axiosInstance.post("/edit-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al subir el avatar:", error);
    throw error;
  }
};


export const editUsername = async (userId, tempUsername) => {
  try {
    const response = await axiosInstance.post("/edit-username", {
      user_id: userId,
      username: tempUsername,
    });
    return response;
  } catch (error) {
    console.error("Error al editar el nombre de usuario:", error);
    throw error;
  }
};

export const editName = async (userId, tempName) => {
  try {
    const response = await axiosInstance.post("/edit-name", {
      user_id: userId,
      name: tempName,
    });
    return response;
  } catch (error) {
    console.error("Error al editar el nombre de usuario:", error);
    throw error;
  }
};

export const editSurname = async (userId, tempSurname) => {
  try {
    const response = await axiosInstance.post("/edit-surname", {
      user_id: userId,
      surname: tempSurname,
    });
    return response;
  } catch (error) {
    console.error("Error al editar el apellido:", error);
    throw error;
  }
};

export const editEmail = async (userId, tempEmail) => {
  try {
    const response = await axiosInstance.post("/edit-email", {
      user_id: userId,
      email: tempEmail,
    });
    return response;
  } catch (error) {
    console.error("Error al editar el apellido:", error);
    throw error;
  }
};

// Función para agregar un nuevo libro
export const addBook = async (formData) => {
  try {
    const response = await axiosInstance.post("/addBook", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al agregar el libro:", error);
    throw error;
  }
};

export const editBook = async (formData, bookId) => {
  try {
    const response = await axiosInstance.post(`/editBook/${bookId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al editar el libro:", error);
    throw error;
  }
};


// Función para obtener todos los libros
export const getAllBooks = async () => {
  try {
    const response = await axiosInstance.get("/allBooks");
    return response.data; // Devuelve los datos de todos los libros
  } catch (error) {
    console.error("Error obteniendo libros:", error);
    throw error;
  }
};

// Función para obtener los libros de las últimas 24 horas
export const getNewsBooks = async () => {
  try {
    const response = await axiosInstance.get("/newsBooks");
    return response.data; // Devuelve los datos de los libros nuevos
  } catch (error) {
    console.error("Error obteniendo libros nuevos:", error);
    throw error;
  }
};

// Función para obtener libros por categoría
export const getBooksByCategory = async (categoria) => {
  try {
    if (!categoria) {
      throw new Error("La categoría es requerida");
    }
    const response = await axiosInstance.get("/booksByCategory", {
      params: { categoria },
    });
    return response.data; // Devuelve los datos de los libros por categoría
  } catch (error) {
    console.error("Error obteniendo libros por categoría:", error);
    throw error; // Propaga el error para manejo en el lugar de llamada
  }
};

// Función para guardar un libro para un usuario
export const saveBook = async (userId, bookId) => {
  try {
    const response = await axiosInstance.post("/save-book", {
      user_id: userId,
      book_id: bookId,
    });
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error("Error al guardar el libro:", error);
    throw error; // Propaga el error para manejo en el lugar de llamada
  }
};

// Función para eliminar un libro guardado
export const removeSavedBook = async (userId, bookId) => {
  try {
    const response = await axiosInstance.delete(`/deleteSavedBook`, {
      data: { user_id: userId, book_id: bookId }, // Enviar los datos en el cuerpo de la solicitud DELETE
    });
    return response.data;
  } catch (error) {
    console.error("Error eliminando el book guardado:", error);
    return { success: false, message: "Error eliminando el book guardado." };
  }
};

// Función para obtener los libros subidos por un usuario
export const getBooksByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/getBooksByUser/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los libros del usuario:", error);
    throw error;
  }
};

// Función para eliminar un libro
export const deleteBook = async (bookId, userId) => {
  try {
    const response = await axiosInstance.delete(`/deleteBook/${bookId}`, {
      data: { user_id: userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el libro:", error);
    throw error;
  }
};

export const uploadUserAvatar = async (userId, avatarFile) => {
  try {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("avatar", avatarFile);

    const response = await axiosInstance.post("/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error("Error al subir el avatar del usuario:", error);
    throw error;
  }
};

export const uploadBookCover = async (bookId, coverFile) => {
  try {
    const formData = new FormData();
    formData.append("bookId", bookId);
    formData.append("cover", coverFile);

    const response = await axiosInstance.post("/upload-cover", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error("Error al subir la portada del libro:", error);
    throw error;
  }
};

// Función para agregar un nuevo comentario
export const writeComment = async (commentData) => {
  try {
    const response = await axiosInstance.post("/add-comment", commentData);
    return response.data;
  } catch (error) {
    console.error("Error al publicar el comentario:", error);
    throw error;
  }
};

// Función obtener comentarios paginados de un libro
export const getComments = async (bookId, limit = 5, offset = 0) => {
  try {
    const response = await axiosInstance.get(
      `/get-comments/${bookId}?limit=${limit}&offset=${offset}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    throw error;
  }
};

// Función obtener un usuario por su id
export const getUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`/get-user/${userId}`);
    return response.data.user; // devuelve el usuario
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    throw error;
  }
};

// Función para agregar una nueva respuesta a un comentario
export const writeReply = async (replyData) => {
  try {
    const response = await axiosInstance.post("/add-reply", replyData);
    return response.data;
  } catch (error) {
    console.error("Error al publicar la respuesta:", error);
    throw error;
  }
};

// Función para obtener respuestas paginadas de un comentario
export const getReplies = async (commentId, limit = 5, offset = 0) => {
  try {
    const response = await axiosInstance.get(
      `/get-replies?commentId=${commentId}&limit=${limit}&offset=${offset}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener respuestas:", error);
    throw error;
  }
};

export const getReplyCount = async (commentId) => {
  try {
    const response = await axiosInstance.get(
      `/get-replies?commentId=${commentId}&limit=0&offset=0`
    );
    return response.data.total; // solo usamos el total
  } catch (error) {
    console.error("Error al obtener el total de respuestas:", error);
    throw error;
  }
};

// Función para agregar un me gusta a comentario
export const addLike = async (likeData) => {
  try {
    const response = await axiosInstance.post("/add-likeComment", likeData);
    return response.data;
  } catch (error) {
    console.error("Error al añadir like:", error);
    throw error;
  }
};

// Función para eliminar un me gusta de un comentario
export const removeLike = async (likeData) => {
  try {
    const response = await axiosInstance.delete("/remove-likeComment", {
      data: likeData, // axios permite enviar body en DELETE usando esta sintaxis
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar like:", error);
    throw error;
  }
};

export const getLikes = async (commentId, userId) => {
  try {
    const url = userId
      ? `/likes-comment/${commentId}?userId=${userId}`
      : `/likes-comment/${commentId}`;

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error al obtener número de likes:", error);
    return { likeCount: 0, likedByUser: false };
  }
};


