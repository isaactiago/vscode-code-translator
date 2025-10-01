export const normalizarPalavra = (texto: string): string => {
  return texto
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};
