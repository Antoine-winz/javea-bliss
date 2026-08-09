import { useEffect } from 'react';
import { Link } from 'wouter';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const BASE_URL = 'https://javeabliss.com';

interface PageContent {
  title: string;
  description: string;
  canonical: string;
  h1: string;
  sections: { heading: string; body: string }[];
}

const pages: Record<string, PageContent> = {
  'holiday-apartment-javea-arenal-beach': {
    title: 'Holiday Apartment in Javea near Arenal Beach | Jávea Bliss',
    description: 'Book a renovated 2-bedroom holiday apartment 250 m from Arenal Beach in Jávea. Sleeps 4, air conditioning, Wi-Fi, balcony, lift, free parking. Direct booking from €130/night.',
    canonical: '/en/holiday-apartment-javea-arenal-beach/',
    h1: 'Holiday Apartment in Javea, 250 m from Arenal Beach',
    sections: [
      {
        heading: 'About the Apartment',
        body: 'Jávea Bliss is a fully renovated 2-bedroom holiday apartment located in the Arenal district of Jávea (Xàbia), on the Costa Blanca, Spain. The apartment sits just 250 metres from Arenal Beach — an easy 3-minute walk to the golden sand, the promenade, and the sea.',
      },
      {
        heading: "What's Included",
        body: 'The apartment includes 2 bedrooms sleeping up to 4 guests, a fully equipped kitchen, air conditioning in every room, 600 Mbps fibre Wi-Fi, a balcony, a lift, and free private parking. Check-in is from 16:00, check-out by 12:00.',
      },
      {
        heading: 'Perfect for Beach Holidays',
        body: 'Arenal Beach is one of the finest beaches on the Costa Blanca — a 480-metre Blue Flag sandy beach with lifeguards, beach bars, and water sports. From your apartment, you can walk to the beach before breakfast and stroll back for lunch. Chabada and La Bambula are both within 5 minutes on foot.',
      },
      {
        heading: 'Rates & Availability',
        body: 'Direct booking rates start from €130/night in low season, €160/night in spring and autumn, and €210/night in July–September. Long stays of 35+ nights receive a special rate of €100/night.',
      },
    ],
  },
  '2-bedroom-apartment-javea': {
    title: '2-Bedroom Apartment in Javea | Jávea Bliss — Sleeps 4 Guests',
    description: 'Spacious 2-bedroom holiday apartment in Jávea (Xàbia) with air conditioning, Wi-Fi, kitchen, balcony and lift. 250 m from Arenal Beach. Direct booking from €130/night.',
    canonical: '/en/2-bedroom-apartment-javea/',
    h1: '2-Bedroom Holiday Apartment in Javea — Sleeps up to 4',
    sections: [
      {
        heading: 'A Comfortable 2-Bedroom Layout',
        body: 'Jávea Bliss offers a generous 2-bedroom layout perfect for families, couples travelling together, or groups of up to 4 guests. The main bedroom has a double bed and the second bedroom has twin beds. The living-room sofa converts to a single bed if a fifth berth is needed.',
      },
      {
        heading: 'Fully Equipped for a Real Stay',
        body: "Unlike a hotel room, this apartment gives you a full kitchen with oven, hob, dishwasher and washing machine, a comfortable living area, a private balcony, and fast Wi-Fi. Whether you're staying for a week or a month, everything you need is here.",
      },
      {
        heading: 'Amenities at a Glance',
        body: '2 bedrooms, up to 4 guests, air conditioning, 600 Mbps fibre Wi-Fi, fully equipped kitchen, balcony, lift to every floor, free private parking, TV with international channels. Check-in from 16:00.',
      },
      {
        heading: 'Location',
        body: "The apartment is in the Arenal neighbourhood — the beating heart of Jávea's beach life. Arenal Beach, supermarkets, restaurants, and the promenade are all within a 5-minute walk.",
      },
    ],
  },
  'where-to-stay-in-javea': {
    title: 'Where to Stay in Javea — The Arenal Neighbourhood Guide | Jávea Bliss',
    description: "Planning where to stay in Javea? Discover why the Arenal Beach neighbourhood is the best base for your holiday — walkable, vibrant, and 250 m from the sea.",
    canonical: '/en/where-to-stay-in-javea/',
    h1: 'Where to Stay in Javea — Why Arenal is the Best Area',
    sections: [
      {
        heading: "Javea's Three Districts",
        body: "Jávea (Xàbia) is split into three main areas: the Old Town (historic village), the Port (fishing harbour), and Arenal Beach. For a beach holiday, Arenal is by far the best base — it's a lively, walkable neighbourhood centred on a beautiful 480-metre sandy beach.",
      },
      {
        heading: 'The Arenal Area',
        body: "The Arenal district has everything you need within walking distance: the beach, a promenade, supermarkets, pharmacies, restaurants, and bars. It's the most convenient part of Javea for holidaymakers who don't want to rely on a car every day.",
      },
      {
        heading: 'Why Stay at Jávea Bliss',
        body: "Jávea Bliss is our holiday apartment near Arenal Beach — just 250 metres from the sand. It's a renovated 2-bedroom apartment for up to 4 guests, with air conditioning, Wi-Fi, a full kitchen, balcony, lift, and free parking. Book directly from €130/night.",
      },
      {
        heading: 'Getting Around Javea',
        body: "The centre of Arenal is compact and walkable. Buses connect Arenal to the Port and Old Town. For trips to Cala Granadella, Montgó Natural Park, or neighbouring towns like Dénia and Calpe, a hire car is handy — though not essential for a beach-focused week.",
      },
    ],
  },
  'javea-arenal-beach-guide': {
    title: 'Javea Arenal Beach — Complete Visitor Guide | Jávea Bliss',
    description: 'Everything you need to know about Arenal Beach in Javea: facilities, beach bars, parking, best time to visit, and nearby restaurants. Stay 250 m away at Jávea Bliss.',
    canonical: '/en/javea-arenal-beach-guide/',
    h1: 'Arenal Beach Javea — A Complete Guide',
    sections: [
      {
        heading: 'About Arenal Beach',
        body: "Playa del Arenal is the main beach of Jávea (Xàbia). It's a 480-metre Blue Flag sandy beach with a gentle slope into calm, crystal-clear water — perfect for swimming, snorkelling, and families with young children. The beach sits in a sheltered bay backed by a palm-lined promenade.",
      },
      {
        heading: 'Facilities at the Beach',
        body: "Arenal Beach has lifeguards (June–September), sunbed hire, beach volleyball, water sports, showers, changing rooms, and accessible ramps. The promenade alongside has restaurants, ice cream shops, and cafés.",
      },
      {
        heading: 'Best Restaurants Near Arenal',
        body: "Chabada and La Bambula are the two best-known spots on the promenade — Chabada for a drink from breakfast onwards, La Bambula for live music into the night. For paella by the sand there is La Fontana, and for a proper dinner, La Masena or Bohemians a short walk back from the seafront.",
      },
      {
        heading: 'Best Time to Visit',
        body: 'July and August are the busiest months; the beach fills up by 10am. For a more relaxed experience with warm water and fewer crowds, May–June and September–October are ideal. The sea temperature stays above 20°C until late October.',
      },
      {
        heading: 'Staying Near Arenal Beach',
        body: 'Our 2-bedroom holiday apartment near Arenal Beach is just 250 metres from the waterfront. Book Jávea Bliss directly from €130/night — no booking fees, no middlemen.',
      },
    ],
  },
  'winter-rental-javea': {
    title: 'Winter Rental in Javea — Long-Stay Apartments from €100/Night | Jávea Bliss',
    description: 'Escape winter with a long-stay rental in Javea. Jávea Bliss offers monthly rates for 35+ night stays from €100/night. Mild climate, 300+ sunny days, 250 m from Arenal Beach.',
    canonical: '/en/winter-rental-javea/',
    h1: 'Winter Rental in Javea — Stay Warm from €100/Night',
    sections: [
      {
        heading: "Why Javea for Winter?",
        body: "Jávea enjoys one of the mildest climates in Spain — sheltered by the Montgó from cold northern winds, the town records over 300 sunny days a year. Winter daytime temperatures typically sit between 14°C and 18°C, dropping to around 8–10°C overnight. It's a world away from the grey skies of northern Europe.",
      },
      {
        heading: 'Long-Stay Rates at Jávea Bliss',
        body: 'For stays of 35 nights or more, Jávea Bliss offers a special long-stay rate of €100/night — significantly below the standard nightly rate. The apartment is fully equipped for a real extended stay: a complete kitchen, washing machine, fast Wi-Fi, heating, and air conditioning.',
      },
      {
        heading: 'Who Stays in Winter?',
        body: "Winter guests at Jávea Bliss include retirees from the UK, Netherlands, Germany, and Belgium who 'overwinter' (spend 2–3 months on the Costa Blanca), remote workers looking for a productive workspace with sunshine, and people whose homes are being renovated back home.",
      },
      {
        heading: 'What to Do in Javea in Winter',
        body: "Winter in Javea is ideal for hiking in Montgó Natural Park, cycling along the coast, exploring the Old Town and weekly market, visiting Cala Granadella, and eating well at year-round restaurants. The beach is quiet but the promenade remains open and popular.",
      },
      {
        heading: 'Book a Winter Stay',
        body: 'Interested in a winter rental at Jávea Bliss? Use our booking form to check availability and request a long-stay quote. Direct booking means no commission fees.',
      },
    ],
  },
  'javea-without-car': {
    title: 'Javea Without a Car — What You Can Do on Foot | Jávea Bliss',
    description: "Wondering if you need a car in Javea? Discover everything within walking distance of Arenal Beach — restaurants, supermarkets, beaches, and more. Stay car-free at Jávea Bliss.",
    canonical: '/en/javea-without-car/',
    h1: 'Javea Without a Car — A Car-Free Holiday Guide',
    sections: [
      {
        heading: 'The Arenal Neighbourhood is Very Walkable',
        body: "If you're staying in the Arenal area, you really don't need a car for day-to-day life. The beach is 250 metres away, the supermarket (Consum) is 5 minutes on foot, there's a pharmacy, a bakery, several restaurants, and a petrol station all within easy walking distance.",
      },
      {
        heading: 'Restaurants Within Walking Distance',
        body: "Chabada, La Bambula, La Fontana, La Masena, L'Oasis, Bohemians, Casa Lili, Carnaval — around twenty places to eat and drink sit within a 10-minute walk of Arenal Beach. You will be spoilt for choice without ever calling a taxi.",
      },
      {
        heading: 'Getting to Javea Without a Car',
        body: "Alicante Airport is the nearest airport at around 100 km — roughly an hour and a quarter by road. Valencia Airport is a similar distance. Both are served by airport taxis and shared shuttle services to Javea, and coaches run from Alicante and Valencia to Dénia and Javea. Locally, buses connect Javea's Old Town, Port, and Arenal.",
      },
      {
        heading: 'When a Car is Useful',
        body: 'A car makes it easier to visit Cala Granadella (15 min drive), Montgó Natural Park, and nearby towns like Calpe (with its famous Peñón de Ifach), Dénia, Moraira, and Altea. Day trips to Valencia (1.5 h) and Alicante (1 h) are also popular.',
      },
      {
        heading: 'Stay at Jávea Bliss — Free Parking Included',
        body: "If you do bring a car, our 2-bedroom holiday apartment near Arenal Beach includes free private parking. And if you're arriving by public transport, you'll be perfectly placed to enjoy Javea car-free.",
      },
    ],
  },
  'restaurants-near-arenal-beach-javea': {
    title: 'Best Restaurants Near Arenal Beach Javea | Jávea Bliss Guide',
    description: 'Discover the best restaurants near Arenal Beach in Javea — La Bambula, Chabada, Masena, and more. All within walking distance of our holiday apartment.',
    canonical: '/en/restaurants-near-arenal-beach-javea/',
    h1: 'Best Restaurants Near Arenal Beach in Javea',
    sections: [
      {
        heading: 'Chabada — drinks by the sand',
        body: "Chabada sits right on the Arenal promenade and opens from 8am straight through, which makes it as good for a morning coffee as for a sundowner. Happy hour runs 4–8pm and there is live music on Thursday evenings. About 300 metres from the apartment.",
      },
      {
        heading: 'La Bambula — live music and dancing',
        body: "The liveliest spot on this stretch: open 9am to 1am, and until 3am at weekends, with flamenco on Sundays, swing on Tuesdays and rock on Fridays. Come for a drink and stay for the music. Roughly 250 metres away — near enough to walk home.",
      },
      {
        heading: 'La Fontana — paella and pizza',
        body: "Right by the beach and open non-stop every day, La Fontana does both authentic paella and Italian pizza. A safe bet with children, or when half the group wants rice and the other half doesn't.",
      },
      {
        heading: 'La Masena — a proper dinner',
        body: "The choice for a longer, more refined meal. Open Monday lunchtime, then Wednesday to Sunday for lunch and dinner (until 11pm at weekends); closed Tuesdays. Worth booking ahead in summer.",
      },
      {
        heading: "L'Oasis — steaks and grilled meat",
        body: "The place locals name for a good steak. Open 12:30pm to 11pm daily, a short walk from the Arenal seafront.",
      },
      {
        heading: 'Bohemians — elegant and central',
        body: "Elegant dining in a polished setting, open from midday to midnight every day. Good for a dressed-up evening without leaving the neighbourhood.",
      },
      {
        heading: 'Casa Lili and Carnaval — Asian and fusion',
        body: "Casa Lili serves fresh, authentic Asian cooking (12:30–4pm and 6:30–11pm daily). Carnaval covers modern fusion — sushi, burgers and poke bowls — non-stop every day. Both are useful when you have had enough Mediterranean food for one week.",
      },
      {
        heading: 'Caramel — breakfast and pastries',
        body: "A French-style bakery open 7:30am to 7:30pm daily, for croissants and proper coffee before the beach.",
      },
      {
        heading: 'Local Tips',
        body: "In July and August, book ahead for dinner — the Arenal fills up. In low season some places cut their hours, so it is worth checking before you walk down. And with a full kitchen in the apartment, cooking in with something from the local market is always an option.",
      },
    ],
  },
  'best-beaches-near-javea-apartment': {
    title: 'Best Beaches Near Javea — Day Trips from Arenal | Jávea Bliss',
    description: 'Explore the best beaches near Javea: Arenal Beach (250 m), Cala Granadella, Playa Montañar, Cala Sardinera, and more. All reachable from our holiday apartment.',
    canonical: '/en/best-beaches-near-javea-apartment/',
    h1: 'Best Beaches Near Our Javea Holiday Apartment',
    sections: [
      {
        heading: 'Arenal Beach — Your Home Beach (250 m away)',
        body: "Playa del Arenal is the main sandy beach of Javea — 480 metres of soft sand with Blue Flag status, calm water, lifeguards in summer, and a lively promenade lined with restaurants. From our holiday apartment near Arenal Beach, it's just a 3-minute walk.",
      },
      {
        heading: 'Playa Montañar',
        body: 'A quieter sandy beach at the southern end of the Arenal area, Montañar is popular with locals and a great alternative to the main beach when Arenal gets busy in July and August. A 10-minute walk from the apartment.',
      },
      {
        heading: 'Cala Granadella',
        body: "Repeatedly voted one of Spain's most beautiful beaches, Cala Granadella is a stunning pebble cove with turquoise water, dramatic cliffs, and a small restaurant. About 15 minutes by car from Javea (or a challenging but rewarding hike).",
      },
      {
        heading: 'Cala Sardinera',
        body: "A small, less-visited cove on the way to Cabo de la Nao. Crystal-clear water perfect for snorkelling. Parking is limited so arrive early in summer.",
      },
      {
        heading: 'Cala del Portichol',
        body: "A secluded rocky cove south of Cabo de la Nao with exceptional underwater visibility. Bring snorkelling gear and water shoes — this is Javea's wild side.",
      },
    ],
  },
  'javea-3-day-itinerary': {
    title: 'Javea 3-Day Itinerary — What to Do in Javea | Jávea Bliss',
    description: 'Make the most of 3 days in Javea with our local guide. Beaches, restaurants, hikes, and hidden gems — all planned around a stay at our Arenal Beach apartment.',
    canonical: '/en/javea-3-day-itinerary/',
    h1: '3 Days in Javea — The Perfect Itinerary',
    sections: [
      {
        heading: 'Day 1 — Arenal Beach & Local Restaurants',
        body: 'Start your first morning with a walk to Arenal Beach — just 250 metres from Jávea Bliss. Hire a sunbed, swim in the clear Mediterranean water, and take a stroll along the promenade. For lunch, La Fontana does paella a few steps from the sand. In the evening, work along the promenade: a drink at Chabada as the sun goes down, then La Bambula, where there is live music most nights.',
      },
      {
        heading: 'Day 2 — Cala Granadella & Old Town',
        body: "In the morning, drive (or take a taxi) to Cala Granadella — one of Spain's most beautiful beaches, about 15 minutes from the apartment. Snorkel in the turquoise water and have lunch at the cala's restaurant. In the afternoon, visit Javea's charming Old Town (Pueblo): explore the Gothic church, the covered market, and the maze of narrow streets. Have dinner at Masena or another restaurant in the centre.",
      },
      {
        heading: 'Day 3 — Montgó, Cabo de la Nao & Departure',
        body: "On your final morning, hike part of the Montgó Natural Park trail for panoramic views over Javea and the sea. If you prefer a gentler start, drive to Cabo de la Nao — the famous headland with a lighthouse and dramatic coastal views. Stop at Cala Sardinera for a final swim. Return to the apartment, pack up, and check out by 12:00.",
      },
      {
        heading: 'Practical Tips',
        body: 'A hire car is helpful for Day 2 and Day 3 but not required for Day 1 — the Arenal is walkable. Book dinner ahead in July and August. The free private parking at Jávea Bliss means you can come and go without hunting for a space.',
      },
    ],
  },
};

interface SEOLandingPageProps {
  slug: string;
}

const BookingCTA = () => (
  <div className="bg-ink text-bone p-8 md:p-10 mt-16">
    <h3 className="font-display text-2xl md:text-3xl mb-4">Stay at Jávea Bliss</h3>
    <p className="text-bone/75 font-light leading-relaxed max-w-xl mb-8">
      A renovated two-bedroom apartment for up to four guests, 250 m from Arenal Beach, with air
      conditioning, fast Wi-Fi, a full kitchen, terrace, lift and free parking. Book direct from
      €130 a night — no booking fees.
    </p>
    <div className="flex flex-wrap gap-4">
      <Link href="/en/#booking" className="btn-on-dark">
        Check Availability
      </Link>
      <Link href="/en/" className="link-underline text-bone/85 hover:text-bone">
        View the Apartment
      </Link>
    </div>
  </div>
);

const SEOLandingPage = ({ slug }: SEOLandingPageProps) => {
  const page = pages[slug];

  useEffect(() => {
    if (!page) return;
    document.title = page.title;

    const updateMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('description', page.description);
    updateMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1');
    updateMeta('og:title', page.title, true);
    updateMeta('og:description', page.description, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:site_name', 'Jávea Bliss', true);
    updateMeta('og:url', `${BASE_URL}${page.canonical}`, true);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${BASE_URL}${page.canonical}`;

    // These guides exist in English only. Advertising the other languages here would
    // point hreflang at pages that are not translations of this one, so drop any
    // alternates left in the document by the homepage and self-reference instead.
    document
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach(link => link.remove());

    ['en', 'x-default'].forEach(hreflang => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.setAttribute('hreflang', hreflang);
      link.href = `${BASE_URL}${page.canonical}`;
      document.head.appendChild(link);
    });
  }, [page]);

  if (!page) {
    return (
      <div>
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Page not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedGuides = [
    { href: '/en/javea-arenal-beach-guide/', label: 'Arenal Beach — Complete Visitor Guide' },
    { href: '/en/where-to-stay-in-javea/', label: 'Where to Stay in Javea' },
    { href: '/en/restaurants-near-arenal-beach-javea/', label: 'Best Restaurants Near Arenal Beach' },
    { href: '/en/best-beaches-near-javea-apartment/', label: 'Best Beaches Near Javea' },
    { href: '/en/winter-rental-javea/', label: 'Winter Rental in Javea' },
    { href: '/en/javea-without-car/', label: 'Visiting Javea Without a Car' },
    { href: '/en/javea-3-day-itinerary/', label: '3-Day Javea Itinerary' },
  ].filter((g) => g.href !== page.canonical);

  return (
    <div className="min-h-screen bg-bone">
      <Navigation />

      <main className="section pt-32 md:pt-40">
        <div className="shell-narrow">
          <nav className="font-sans text-[0.75rem] tracking-[0.1em] uppercase text-stone mb-8">
            <Link href="/en/" className="hover:text-ink transition-colors">Home</Link>
            <span className="mx-3 text-ink/25">/</span>
            <span className="text-ink-soft">{page.h1}</span>
          </nav>

          <h1 className="display-lg mb-7">{page.h1}</h1>
          <p className="lede mb-16">{page.description}</p>

          <div className="border-t border-ink/12">
            {page.sections.map((section, i) => (
              <div key={i} className="border-b border-ink/12 py-9">
                <h2 className="font-display text-2xl text-ink mb-4">{section.heading}</h2>
                <p className="text-[0.95rem] text-ink-soft leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>

          <BookingCTA />

          <div className="mt-16">
            <h3 className="eyebrow mb-7">Related Guides</h3>
            <ul>
              {relatedGuides.map(({ href, label }) => (
                <li key={href} className="hairline">
                  <Link
                    href={href}
                    className="block py-4 text-[0.95rem] text-ink-soft hover:text-brass transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SEOLandingPage;
