import type { SaleLanguage } from '@shared/sale-content';
import living from '@assets/javea-bliss-living-room-bright.jpeg';
import terrace from '@assets/Terasse1.4_1749116725138.jpeg';
import livingTerrace from '@assets/Livingroom1.2_1749116725138.jpeg';
import kitchen from '@assets/Kitchen1_optimized.jpeg';
import bedroomOne from '@assets/Bedroom2.3_1749116725138.jpeg';
import bedroomTwo from '@assets/Bedroom1.2_1749116725138.jpeg';
import bathroom from '@assets/Bathroom1_optimized.jpeg';
import dining from '@assets/javea-bliss-dining-living-room.jpeg';
import openKitchen from '@assets/Kitchen1.3_1749116725138.jpeg';

import wardrobe from '@assets/javea-bliss-bedroom-wardrobe.jpeg';
import balconyView from '@assets/Terasse1.2_1749116725138.jpeg';
import hall from '@assets/Hall_1749116725138.jpeg';

const photos = [living, terrace, livingTerrace, kitchen, bedroomOne, bedroomTwo, bathroom, dining, openKitchen, wardrobe, balconyView, hall, '/javeabliss-floor-plan-HD.png'];
const copy: Record<SaleLanguage, { title: string; intro: string; open: string; note: string; captions: string[] }> = {
  fr: { title: 'Découvrez votre prochain chez-vous', intro: 'Du salon au balcon, explorez chaque espace et le plan de l’appartement.', open: 'Voir en grand format', note: 'Plan schématique · Sans échelle · Mobilier indicatif', captions: ['Salon lumineux', 'Balcon couvert', 'Le salon ouvert sur le balcon', 'Cuisine rénovée', 'Chambre double', 'Seconde chambre double', 'Salle de bains avec douche', 'Espace salon et salle à manger', 'Cuisine ouverte sur le séjour', 'Chambre avec armoire intégrée', 'Vue du balcon', 'Distribution des chambres et de la salle de bains', 'Plan de l’appartement'] },
  es: { title: 'Descubra su próximo hogar', intro: 'Del salón al balcón, explore cada espacio y el plano del apartamento.', open: 'Ver en tamaño completo', note: 'Plano esquemático · Sin escala · Mobiliario orientativo', captions: ['Salón luminoso', 'Balcón cubierto', 'Salón abierto al balcón', 'Cocina renovada', 'Dormitorio doble', 'Segundo dormitorio doble', 'Baño con ducha', 'Salón-comedor', 'Cocina abierta al salón', 'Dormitorio con armario empotrado', 'Vista del balcón', 'Distribuidor de dormitorios y baño', 'Plano del apartamento'] },
  en: { title: 'Discover your next home', intro: 'From the living room to the balcony, explore each space and the apartment floor plan.', open: 'View full size', note: 'Schematic plan · Not to scale · Furniture for illustration', captions: ['Bright living room', 'Covered balcony', 'Living room opening onto the balcony', 'Renovated kitchen', 'Double bedroom', 'Second double bedroom', 'Bathroom with shower', 'Living and dining area', 'Open-plan kitchen and living area', 'Bedroom with fitted wardrobe', 'View from the balcony', 'Hallway connecting bedrooms and bathroom', 'Apartment floor plan'] },
  de: { title: 'Entdecken Sie Ihr neues Zuhause', intro: 'Vom Wohnzimmer bis zum Balkon: Entdecken Sie die Räume und den Grundriss der Wohnung.', open: 'In voller Größe ansehen', note: 'Schematischer Grundriss · Nicht maßstabsgetreu · Möblierung beispielhaft', captions: ['Helles Wohnzimmer', 'Überdachter Balkon', 'Wohnzimmer mit Zugang zum Balkon', 'Renovierte Küche', 'Doppelschlafzimmer', 'Zweites Doppelschlafzimmer', 'Badezimmer mit Dusche', 'Wohn- und Essbereich', 'Offene Küche mit Wohnbereich', 'Schlafzimmer mit Einbauschrank', 'Blick vom Balkon', 'Flur zu Schlafzimmern und Bad', 'Grundriss der Wohnung'] },
  nl: { title: 'Ontdek uw volgende thuis', intro: 'Van woonkamer tot balkon: bekijk alle ruimtes en de plattegrond van het appartement.', open: 'Bekijk op volledig formaat', note: 'Schematische plattegrond · Niet op schaal · Meubilair ter illustratie', captions: ['Lichte woonkamer', 'Overdekt balkon', 'Woonkamer met toegang tot het balkon', 'Gerenoveerde keuken', 'Tweepersoonsslaapkamer', 'Tweede tweepersoonsslaapkamer', 'Badkamer met douche', 'Woon- en eetgedeelte', 'Open keuken en woonkamer', 'Slaapkamer met inbouwkast', 'Uitzicht vanaf het balkon', 'Gang naar slaapkamers en badkamer', 'Plattegrond van het appartement'] },
  it: { title: 'Scopra la sua prossima casa', intro: 'Dal soggiorno al balcone, esplori ogni ambiente e la planimetria dell’appartamento.', open: 'Visualizza a dimensione intera', note: 'Pianta schematica · Non in scala · Arredi indicativi', captions: ['Soggiorno luminoso', 'Balcone coperto', 'Soggiorno con accesso al balcone', 'Cucina ristrutturata', 'Camera matrimoniale', 'Seconda camera matrimoniale', 'Bagno con doccia', 'Soggiorno e zona pranzo', 'Cucina aperta sul soggiorno', 'Camera con armadio a muro', 'Vista dal balcone', 'Disimpegno tra camere e bagno', 'Planimetria dell’appartamento'] },
};

export default function SalesGallery({ language }: { language: SaleLanguage }) {
  const t = copy[language];
  return (
    <section id="sale-gallery" aria-labelledby="sale-gallery-title" className="bg-[#f4f0e8] px-6 py-16 text-[#24352f] md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 id="sale-gallery-title" className="font-serif text-4xl md:text-5xl">{t.title}</h2>
        <p className="mt-5 max-w-2xl leading-8 text-[#53635c]">{t.intro}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((src, index) => (
            <figure key={src} id={index === photos.length - 1 ? 'floor-plan' : undefined} className={index === photos.length - 1 ? 'sm:col-span-2 lg:col-span-3' : undefined}>
              <a href={src} target="_blank" rel="noopener noreferrer" aria-label={`${t.open} — ${t.captions[index]}`} className="group block overflow-hidden border border-[#c9c2b6] bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24352f]">
                <img src={src} alt={t.captions[index]} loading="lazy" decoding="async" className={index === photos.length - 1 ? 'mx-auto max-h-[720px] w-full object-contain p-4' : 'aspect-[4/3] w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105'} width={index === photos.length - 1 ? 3933 : 1200} height={index === photos.length - 1 ? 4096 : 900} />
              </a>
              <figcaption className="mt-3 text-sm leading-6"><span className="mr-3 text-[#94764f]">{String(index + 1).padStart(2, '0')}</span>{t.captions[index]}{index === photos.length - 1 && <p className="mt-1 text-[#68756e]">{t.note}</p>}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
