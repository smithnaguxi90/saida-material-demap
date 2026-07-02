import { db, appId } from "./firebase.js";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch,
  updateDoc,
  getDocs,
  setDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

export const limparNotificacoesNoFirestore = async (uid, ids) => {
  try {
    const batch = writeBatch(db);
    ids.forEach((id) => {
      const ref = doc(db, "artifacts", appId, "users", uid, "notificacoes", id);
      batch.update(ref, { lida: true });
    });
    await batch.commit();
  } catch (error) {
    console.error("Erro ao limpar notificações no Firestore:", error);
    throw error;
  }
};

export const criarNotificacaoNoFirestore = async (
  uid,
  titulo,
  mensagem,
  tipo = "info",
) => {
  try {
    const ref = collection(
      db,
      "artifacts",
      appId,
      "users",
      uid,
      "notificacoes",
    );
    await addDoc(ref, {
      titulo,
      mensagem,
      tipo,
      lida: false,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    // Silencia o erro para não quebrar a experiência principal
    // Apenas registra no console
    console.warn("Falha ao criar notificação no Firestore:", error);
  }
};

export const escutarNotificacoes = (uid, callback) => {
  const ref = collection(db, "artifacts", appId, "users", uid, "notificacoes");
  const q = query(ref, orderBy("timestamp", "desc"), limit(20));
  return onSnapshot(q, callback, (error) =>
    console.error("Erro escuta notificações", error),
  );
};

export const salvarEncarregadoNoFirestore = async (nome) => {
  try {
    await setDoc(doc(db, "artifacts", appId, "encarregados", nome), { nome });
  } catch (error) {
    console.error("Erro ao salvar encarregado:", error);
    throw error;
  }
};

export const removerEncarregadoNoFirestore = async (nome) => {
  try {
    await deleteDoc(doc(db, "artifacts", appId, "encarregados", nome));
  } catch (error) {
    console.error("Erro ao remover encarregado:", error);
    throw error;
  }
};

export const escutarEncarregados = (callback) => {
  return onSnapshot(
    collection(db, "artifacts", appId, "encarregados"),
    callback,
    (err) => console.error("Erro ao escutar encarregados:", err),
  );
};

export const fetchBaseDoFirestore = async () => {
  try {
    const snap = await getDocs(collection(db, "artifacts", appId, "materiais"));
    let base = {};
    snap.forEach((d) => (base[d.id] = d.data().nome));
    return Object.keys(base).length > 0 ? base : null;
  } catch (error) {
    console.error("Erro ao buscar base de materiais:", error);
    throw error;
  }
};

export const salvarBaseNoFirestoreLote = async (baseDados) => {
  const keys = Object.keys(baseDados);
  try {
    for (let i = 0; i < keys.length; i += 500) {
      const chunk = keys.slice(i, i + 500);
      const batch = writeBatch(db);
      chunk.forEach((cod) => {
        batch.set(doc(db, "artifacts", appId, "materiais", cod), {
          nome: baseDados[cod],
        });
      });
      await batch.commit();
    }
  } catch (error) {
    console.error("Erro ao salvar base em lote:", error);
    throw error;
  }
  return keys.length;
};

export const adicionarLancamentoNoFirestore = async (uid, dados) => {
  try {
    const ref = collection(db, "artifacts", appId, "users", uid, "lancamentos");
    await addDoc(ref, { ...dados, timestamp: serverTimestamp() });
  } catch (error) {
    console.error("Erro ao adicionar lançamento:", error);
    throw error;
  }
};

export const deletarLancamentoNoFirestore = async (uid, docId) => {
  try {
    await deleteDoc(
      doc(db, "artifacts", appId, "users", uid, "lancamentos", docId),
    );
  } catch (error) {
    console.error("Erro ao deletar lançamento:", error);
    throw error;
  }
};

export const alternarBaixaNoFirestore = async (uid, idOuIds, novoStatus) => {
  try {
    if (Array.isArray(idOuIds)) {
      const batch = writeBatch(db);
      idOuIds.forEach((id) => {
        const ref = doc(
          db,
          "artifacts",
          appId,
          "users",
          uid,
          "lancamentos",
          id,
        );
        batch.update(ref, { baixa: novoStatus });
      });
      await batch.commit();
    } else {
      const ref = doc(
        db,
        "artifacts",
        appId,
        "users",
        uid,
        "lancamentos",
        idOuIds,
      );
      await updateDoc(ref, { baixa: novoStatus });
    }
  } catch (error) {
    console.error("Erro ao alternar baixa:", error);
    throw error;
  }
};

export const salvarLancamentosEmLote = async (uid, lancamentos) => {
  try {
    const batch = writeBatch(db);
    const ref = collection(db, "artifacts", appId, "users", uid, "lancamentos");
    lancamentos.forEach((l) =>
      batch.set(doc(ref), { ...l, timestamp: serverTimestamp() }),
    );
    if (lancamentos.length > 0) await batch.commit();
    return lancamentos.length;
  } catch (error) {
    console.error("Erro ao salvar lançamentos em lote:", error);
    throw error;
  }
};

export const escutarLancamentos = (uid, callback) => {
  const ref = collection(db, "artifacts", appId, "users", uid, "lancamentos");
  return onSnapshot(ref, callback, (error) =>
    console.error("Erro crítico ao escutar lançamentos:", error),
  );
};
