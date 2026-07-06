import { useLanguage } from '@/contexts/LanguageContext';

const DutchRenovationPromo = () => {
  const { language } = useLanguage();

  if (language !== 'nl') {
    return null;
  }

  return (
    <section id="verbouwing-special" className="bg-gray-50 py-12" data-testid="section-dutch-renovation">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-emerald-500">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🏠 Huis Gekocht in Javea? Verblijf in Luxe tijdens uw Verbouwing
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Bent u een villa aan het renoveren in Javea of Moraira? Zoek niet verder naar tijdelijke woonruimte.
            Javea Bliss biedt het perfecte "tussenhuis" voor huiseigenaren.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-xl mb-2">Speciaal "Verbouwings-Tarief"</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span>✅</span>
                  <span><strong>€100/nacht</strong> (bij verblijf &gt; 30 dagen)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>✅</span>
                  <span><strong>Alles Inclusief:</strong> Water, Elektra, Supersnelle WiFi (600Mbps)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>✅</span>
                  <span><strong>Opslag:</strong> Ruim terras voor opslag van fietsen/spullen</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>✅</span>
                  <span><strong>Locatie:</strong> 2 min lopen van bouwmarkten en Arenal</span>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center bg-emerald-50 rounded-lg p-4">
              <p className="italic text-emerald-800">
                "Wij verbleven 2 maanden in Javea Bliss terwijl onze finca gerenoveerd werd.
                Het was een oase van rust na een drukke dag op de bouwplaats."
                <br />
                <span className="font-bold">– Klaas & Marieke, Utrecht (Nov 2024)</span>
              </p>
            </div>
          </div>
          <div className="mt-6">
            <a 
              href="#booking" 
              className="inline-block bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-emerald-700 transition"
              data-testid="button-dutch-renovation-cta"
            >
              Beschikbaarheid Checken voor Lange Termijn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DutchRenovationPromo;
