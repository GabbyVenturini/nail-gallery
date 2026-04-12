import SectionHeading from "../components/SectionHeading";

const table = [
  ["Curta", "1,4 cm a 1,8 cm", "Visual discreto e confortável"],
  ["Média", "1,9 cm a 2,4 cm", "Equilíbrio entre elegância e praticidade"],
  ["Longa", "2,5 cm ou mais", "Maior destaque e proposta fashion"],
];

export default function Medidas() {
  return (
    <section className="container-default py-16">
      <SectionHeading
        eyebrow="Guia de medidas"
        title="Escolha o tamanho ideal para sua coleção"
        description="Página de apoio para orientar a cliente sobre a seleção do comprimento durante a personalização."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="card-surface overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-blush text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
              <tr>
                <th className="px-5 py-4">Tamanho</th>
                <th className="px-5 py-4">Faixa</th>
                <th className="px-5 py-4">Indicação</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row) => (
                <tr key={row[0]} className="border-t border-neutral-200">
                  <td className="px-5 py-4 font-semibold">{row[0]}</td>
                  <td className="px-5 py-4 text-sm text-neutral-600">{row[1]}</td>
                  <td className="px-5 py-4 text-sm text-neutral-600">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-surface p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
            Observações
          </p>
          <ul className="space-y-4 text-sm leading-7 text-neutral-600">
            <li>• Meça sempre considerando o uso principal e sua rotina.</li>
            <li>• Para quem quer adaptação fácil, a recomendação inicial é Média.</li>
            <li>• O tamanho Longa atende melhor produções mais marcantes.</li>
            <li>• As medidas podem ser refinadas depois com catálogo real e fotos por coleção.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
