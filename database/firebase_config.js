// Importar las funciones necesarias desde la CDN de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { updateEmail } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

import { 
  getAuth, 
  deleteUser, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  updateProfile, 
  sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { 
  getDatabase, 
  ref, 
  get, 
  update, 
  remove, 
  set, 
  push 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCY18rzCiDj7p2aDE6LZJgn8vVO4mB5jY4",
  authDomain: "resetapp-8857e.firebaseapp.com",
  databaseURL: "https://resetapp-8857e-default-rtdb.firebaseio.com/",
  projectId: "resetapp-8857e",
  storageBucket: "resetapp-8857e.firebasestorage.app",
  messagingSenderId: "314485103893",
  appId: "1:314485103893:web:48bfac17c10c6381c65d1c"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Función de inicio de sesión
export async function loginUser(mail, password) {
  try {
    const res = await signInWithEmailAndPassword(auth, mail, password);
    console.log("Usuario autenticado correctamente:", res.user);
    return { success: true, uid: res.user?.uid, displayName: res.user?.displayName };
  } catch (error) {
    console.error("Error en loginUser:", error);
    console.error("Error en loginUser:", error.code, error.message); 
    let message = 'Hay un error con tu mail o contraseña.';
    if (error.code === 'auth/user-not-found') {
      message = 'Este mail no está registrado.';
    } else if (error.code === 'auth/wrong-password') {
      message = 'Contraseña incorrecta.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'El correo electrónico es inválido.';
    }
    return { success: false, message };
  }
}

// Función de inicio de sesión con Google
export async function loginWithGoogle() {
  try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Usuario autenticado con Google:", user);

      // Guardar el estado de login en localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', user.displayName || 'Usuario');
      localStorage.setItem('uid', user.uid || 'No hay uid');

      return { success: true, user };
  } catch (error) {
      console.error("Error en loginWithGoogle:", error);
      return { success: false, message: 'Error al iniciar sesión con Google.' };
  }
}

// Función para registrar un usuario
export async function registerUser(mail, password, nick) {
    try {
      const res = await createUserWithEmailAndPassword(auth, mail, password);
      const user = res.user;
      console.log("Usuario registrado correctamente:", user);
      await updateProfile(user, { displayName: nick });
      return { success: true };
    } catch (error) {
      console.error("Error en registerUser:", error);
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, message: 'Este mail ya está registrado' };
      }
      return { success: false, message: 'Error durante el registro' };
    }
  }

// Función para actualizar una receta
export async function updateRecipe(id, recipe) {
  const recipeRef = ref(database, 'recetas/' + id);
  await update(recipeRef, {
    title: recipe.title,
    description: recipe.description,
    ingredients: recipe.ingredients,
    preparation: recipe.preparation,
    chips: recipe.chips,
    image: recipe.image,
    servings: recipe.servings
  });
  console.log("Receta actualizada correctamente.");
}

// Función para obtener recetas
export const getRecipes = async () => {
  const db = getDatabase();
  const recipesRef = ref(db, 'recetas');  // Ruta donde están almacenadas las recetas
  const snapshot = await get(recipesRef);

  if (snapshot.exists()) {
      const recipes = snapshot.val();
      console.log('Recetas obtenidas:', recipes);  // Verifica la estructura de los datos
      return recipes;
  } else {
      console.error('No hay recetas en la base de datos.');
      return null;
  }
};

// Función para restablecer la contraseña
export async function resetPassword(mail) {
  try {
    console.log("Enviando correo de restablecimiento a:", mail);
    await sendPasswordResetEmail(auth, mail);
    console.log("Correo de restablecimiento enviado.");
    return { success: true };
  } catch (error) {
    console.error("Error en resetPassword:", error);
    if (error.code === 'auth/user-not-found') {
      return { success: false, message: 'Este mail no está registrado.' };
    }
    return { success: false, message: 'Hay un error con el Mail ingresado.' };
  }
}

// Función para eliminar la cuenta de usuario
export async function deleteUserAccount(user) {
  try {
    console.log("Eliminando cuenta del usuario:", user);
    await deleteUser(user);
    console.log("Cuenta eliminada correctamente.");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar la cuenta:", error);
    return { success: false, message: 'No se pudo eliminar la cuenta.' };
  }
}

// Función para eliminar una receta
export async function deleteRecipe(recipeId) {
  try {
    const recipeRef = ref(database, 'recetas/' + recipeId);
    await remove(recipeRef);
    console.log("Receta eliminada de Firebase");
  } catch (error) {
    console.error("Error al eliminar la receta de Firebase:", error);
    throw new Error("No se pudo eliminar la receta.");
  }
}

// Función para obtener el usuario actual
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
}

// Función para actualizar el email del usuario
export async function updateUserEmail(newEmail) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      return { success: false, message: 'No hay usuario autenticado' };
    }
    await updateEmail(user, newEmail);
    console.log("Email actualizado correctamente.");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar email:", error);
    if (error.code === 'auth/invalid-email') {
      return { success: false, message: 'El mail no es correcto, verificalo' };
    } else if (error.code === 'auth/email-already-in-use') {
      return { success: false, message: 'Este mail ya está en uso por otra cuenta' };
    } else if (error.code === 'auth/requires-recent-login') {
      return { success: false, message: 'Para mayor seguridad, vuelve a iniciar sesión antes de actualizar tus datos', requiresReauth: true };
    }
    return { success: false, message: 'Ocurrió un error al actualizar el email' };
  }
}

// Función para actualizar el nombre del usuario
export async function updateUserProfile(displayName) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      return { success: false, message: 'No hay usuario autenticado' };
    }
    await updateProfile(user, { displayName });
    console.log("Perfil actualizado correctamente.");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return { success: false, message: 'Ocurrió un error al actualizar el perfil' };
  }
}

// Función para obtener los likes de un usuario
export async function getLikes(uid) {
  const likeRef = ref(database, `likes&favs/${uid}/likes`);
  const snapshot = await get(likeRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data);
  } else {
    return [];
  }
}