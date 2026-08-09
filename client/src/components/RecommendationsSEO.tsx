import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

const RecommendationsSEO = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoContent = {
      en: {
        title: "Best Restaurants Javea 2025 | Guide to La Bambula, Chabada & More",
        description: "Insider guide to Javea's best restaurants: La Bambula, La Siesta, Chabada. Stay at Javea Bliss, the luxury apartment within walking distance of them all.",
        keywords: "Jávea restaurants, Chabada Jávea, La Bambula Jávea, La Siesta Javea, Bohemians Jávea, Arenal Beach restaurants, best food Jávea, Xàbia restaurants, Costa Blanca dining"
      },
      es: {
        title: "Mejores Restaurantes Javea 2025 | Guía La Bambula, Chabada y Más",
        description: "Guía insider de los mejores restaurantes de Javea: La Bambula, La Siesta, Chabada. Alójate en Javea Bliss, apartamento de lujo a poca distancia de todos.",
        keywords: "restaurantes Jávea, Chabada Jávea, La Bambula Jávea, La Siesta Javea, Bohemians Jávea, restaurantes Playa Arenal, mejor comida Jávea"
      },
      fr: {
        title: "Meilleurs Restaurants Javea 2025 | Guide La Bambula, Chabada & Plus",
        description: "Guide insider des meilleurs restaurants de Javea: La Bambula, La Siesta, Chabada. Séjournez à Javea Bliss, appartement de luxe à distance de marche.",
        keywords: "restaurants Jávea, Chabada Jávea, La Bambula Jávea, La Siesta Javea, Bohemians Jávea, restaurants plage Arenal"
      },
      nl: {
        title: "Beste Restaurants Javea 2025 | Gids La Bambula, Chabada & Meer",
        description: "Insider gids voor Javea's beste restaurants: La Bambula, La Siesta, Chabada. Verblijf in Javea Bliss, luxe appartement op loopafstand van alles.",
        keywords: "restaurants Jávea, Chabada Jávea, La Bambula Jávea, La Siesta Javea, Bohemians Jávea, restaurants Arenal Beach"
      },
      de: {
        title: "Beste Restaurants Javea 2025 | Guide La Bambula, Chabada & Mehr",
        description: "Insider-Guide zu Javeas besten Restaurants: La Bambula, La Siesta, Chabada. Übernachten Sie in Javea Bliss, Luxus-Apartment in Gehweite.",
        keywords: "Restaurants Jávea, Chabada Jávea, La Bambula Jávea, La Siesta Javea, Bohemians Jávea, Restaurants Arenal Beach"
      },
      it: {
        title: "Migliori Ristoranti Javea 2025 | Guida La Bambula, Chabada e Altro",
        description: "Guida insider ai migliori ristoranti di Javea: La Bambula, La Siesta, Chabada. Soggiorna a Javea Bliss, appartamento di lusso a pochi passi da tutto.",
        keywords: "ristoranti Jávea, Chabada Jávea, La Bambula Jávea, La Siesta Javea, Bohemians Jávea, ristoranti spiaggia Arenal"
      }
    };

    const currentContent = seoContent[language as keyof typeof seoContent] || seoContent.en;
    
    document.title = currentContent.title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', currentContent.description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = currentContent.description;
      document.head.appendChild(meta);
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', currentContent.keywords);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = currentContent.keywords;
      document.head.appendChild(meta);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', currentContent.title);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      meta.content = currentContent.title;
      document.head.appendChild(meta);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', currentContent.description);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:description');
      meta.content = currentContent.description;
      document.head.appendChild(meta);
    }

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', currentContent.title);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'twitter:title';
      meta.content = currentContent.title;
      document.head.appendChild(meta);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', currentContent.description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'twitter:description';
      meta.content = currentContent.description;
      document.head.appendChild(meta);
    }

    // ItemList structured data for restaurant guide
    const itemListData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Top Restaurants in Javea Arenal",
      "description": "A curated list of the best dining spots near Javea Bliss apartment.",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "La Bambula",
          "url": "https://labambula.es"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Chabada",
          "url": "https://chabadajavea.com"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "La Siesta",
          "url": "https://lasiestajavea.com"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Bohemians",
          "url": "https://bohemiansjavea.com"
        }
      ]
    };

    const existingScript = document.querySelector('script[type="application/ld+json"][data-recommendations]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-recommendations', 'true');
    script.textContent = JSON.stringify(itemListData);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector('script[type="application/ld+json"][data-recommendations]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [language]);

  return null;
};

export default RecommendationsSEO;
