import SectionHeading from "../components/SectionHeading";

export default function Sobre() {
  return (
    <section className="container-default py-16">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card-surface p-8">
          <SectionHeading
            eyebrow="Sobre a Nail Gallery"
            title="Beleza, praticidade e estilo para realçar a sua essência"
            description="A Nail Gallery foi criada para quem ama unhas bonitas, delicadas e cheias de personalidade. Nossa marca une charme, feminilidade e praticidade para deixar o seu visual ainda mais especial em qualquer ocasião."
          />
        </div>

        <div className="card-surface p-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
            Nossa essência
          </p>
          <p className="text-sm leading-8 text-neutral-600">
            Acreditamos que a beleza está nos detalhes. Por isso, oferecemos
            modelos pensados para valorizar seu estilo, destacar sua
            personalidade e trazer mais praticidade para a sua rotina, sem abrir
            mão da elegância.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="card-surface p-6">
          <h3 className="mb-3 text-xl font-semibold">Modelos exclusivos</h3>
          <p className="text-sm leading-7 text-neutral-600">
            Unhas postiças criadas com cuidado para trazer mais charme,
            delicadeza e sofisticação ao seu visual.
          </p>
        </div>

        <div className="card-surface p-6">
          <h3 className="mb-3 text-xl font-semibold">Praticidade para você</h3>
          <p className="text-sm leading-7 text-neutral-600">
            Tenha unhas lindas de forma rápida e simples, perfeitas para
            acompanhar sua rotina com mais leveza e estilo.
          </p>
        </div>

        <div className="card-surface p-6">
          <h3 className="mb-3 text-xl font-semibold">Seu estilo em destaque</h3>
          <p className="text-sm leading-7 text-neutral-600">
            Cada detalhe é pensado para que você encontre modelos que combinam
            com sua personalidade e valorizam ainda mais a sua beleza.
          </p>
        </div>
      </div>
    </section>
  );
}