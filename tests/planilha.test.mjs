import test from "node:test";
import assert from "node:assert/strict";
import { parseCsv, serializeCsv } from "../js/planilha.mjs";

test("parseCsv converte linhas com aspas e vírgulas", () => {
  const csv = 'Nome,Descrição\nJoão,"teste, com vírgula"\nMaria,"linha 2"';
  assert.deepEqual(parseCsv(csv), [
    ["Nome", "Descrição"],
    ["João", "teste, com vírgula"],
    ["Maria", "linha 2"],
  ]);
});

test("serializeCsv gera conteúdo csv válido", () => {
  const rows = [
    ["Nome", "Quantidade"],
    ["João", "3"],
    ["Maria", "5"],
  ];
  assert.equal(serializeCsv(rows), "Nome,Quantidade\nJoão,3\nMaria,5\n");
});
