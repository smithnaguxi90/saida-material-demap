import { auth } from "./firebase.js";
import { mostrarErroFirebase } from "./app.js";
import {
  signInAnonymously,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";

export const initAuth = ({ onUserChanged, onError }) => {
  const initAuthFlow = async () => {
    if (typeof __initial_auth_token !== "undefined" && __initial_auth_token) {
      await signInWithCustomToken(auth, __initial_auth_token);
    }
  };

  initAuthFlow();

  onAuthStateChanged(auth, (user) => {
    onUserChanged(user);
  });

  return {
    async loginEmail(email, password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        return { ok: true };
      } catch (error) {
        mostrarErroFirebase(error, "Não foi possível entrar no sistema.");
        return { ok: false, error };
      }
    },
    async loginAnonimo() {
      try {
        await signInAnonymously(auth);
        return { ok: true };
      } catch (error) {
        mostrarErroFirebase(error, "Erro ao acessar anonimamente.");
        return { ok: false, error };
      }
    },
    async logout() {
      try {
        await signOut(auth);
        return { ok: true };
      } catch (error) {
        mostrarErroFirebase(error, "Erro ao sair do sistema.");
        return { ok: false, error };
      }
    },
    async redefinirSenha(email) {
      try {
        await sendPasswordResetEmail(auth, email);
        return { ok: true };
      } catch (error) {
        mostrarErroFirebase(error, "Erro ao redefinir a senha.");
        return { ok: false, error };
      }
    },
    async atualizarPerfil(displayName) {
      try {
        await updateProfile(auth.currentUser, { displayName });
        return { ok: true };
      } catch (error) {
        mostrarErroFirebase(error, "Erro ao atualizar o perfil.");
        return { ok: false, error };
      }
    },
  };
};
