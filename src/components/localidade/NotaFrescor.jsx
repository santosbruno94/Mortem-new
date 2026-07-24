// Legibilidade do perecível (telegrafia + anúncio): o corpo avisa, em fala
// concreta, que a leitura do tempo se esvai — antes de se perder, e no
// momento em que se perde. Calculado do IPM corrente; nenhuma regra depende.
// Visual: pequena etiqueta de pergaminho pousada sob a prosa.
export default function NotaFrescor({ ipm }) {
  let texto;
  if (ipm <= 24) {
    texto =
      'O corpo ainda guarda a hora com nitidez — mas não vai durar: a rigidez e o calor se desfazem com as horas. O que se quiser datar com precisão, date cedo.';
  } else if (ipm <= 36) {
    texto =
      'A rigidez já cede e o corpo esfria: a leitura do tempo perde o fio. Ainda dá para datar, porém com margem mais larga.';
  } else {
    texto =
      'O corpo afrouxou de todo e igualou o frio da sala: a hora da morte agora só se lê em dias, não em horas. A precisão, essa já se foi — mas o livor fixo ainda crava que foi há mais de meio dia.';
  }
  return (
    <div className="mt-4 carta-pergaminho rounded-sm px-3 py-2">
      <p className="text-tinta-clara text-sm font-serif italic leading-relaxed">{texto}</p>
    </div>
  );
}
