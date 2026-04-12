import { Link } from "react-router-dom";
import { useStore } from "../store/StoreContext";

export default function Footer() {
  const { settings } = useStore();

  return (
    <footer className="mt-24 border-t border-neutral-200 bg-white">
      <div className="container-default grid gap-6 py-10 md:grid-cols-3">
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500">
            Nail Gallery
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-neutral-600">
            {settings.footerDescription}
          </p>
        </div>

        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500">
            Atendimento
          </p>
          <ul className="space-y-3 text-sm flex flex-col items-start">
            <li className="text-neutral-600 py-1 block">{settings.contactSchedule}</li>
            <li>
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-black transition-colors py-1 block">
                {settings.instagramText}
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.contactEmail}`} className="text-neutral-600 hover:text-black transition-colors py-1 block">
                E-mail: {settings.contactEmail}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500">
            Navegação
          </p>
          <ul className="space-y-3 text-sm flex flex-col items-start">
            <li>
              <Link to="/shop" className="text-neutral-600 hover:text-black transition-colors py-1 block">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/sobre" className="text-neutral-600 hover:text-black transition-colors py-1 block">
                Sobre
              </Link>
            </li>
            <li>
              <Link to="/medidas" className="text-neutral-600 hover:text-black transition-colors py-1 block">
                Guia de medidas
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
