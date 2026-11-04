import type { SaleLanguage } from './sale-content';

interface SaleStory {
  label: string;
  title: string;
  paragraphs: string[];
  imageAlt: string;
}

export const saleStory: Record<SaleLanguage, SaleStory> = {
  "fr": {
    "label": "Un mot du propriétaire",
    "title": "Pensé pour y vivre",
    "paragraphs": [
      "Il y a des appartements que l’on achète pour y passer quelques jours. Et puis il y a ceux dans lesquels on se projette vraiment. Lorsque ma sœur et moi avons acheté celui-ci à Jávea, fin 2024, nous y voyions un investissement, mais aussi le début d’une histoire familiale. Nous imaginions qu’un jour, l’un de nous pourrait s’y installer.",
      "C’est avec cette idée en tête que j’ai entrepris sa rénovation. Je voulais un appartement agréable à retrouver en vacances, bien sûr, mais surtout confortable à vivre au quotidien. Nous avons accordé autant d’attention à ce qui se voit — les matériaux, les finitions — qu’à ce qui se ressent : le calme, grâce à l’isolation phonique, et le confort apporté par l’isolation thermique.",
      "Le même soin a guidé les choix les plus discrets. Les fenêtres, les interrupteurs équipés de variateurs d’intensité, les placards : chaque détail a été pensé pour rendre la vie plus simple et plus douce. Jusqu’aux ustensiles de cuisine, à la vaisselle et aux verres en cristal, choisis comme on le ferait pour sa propre maison. Nous voulions pouvoir arriver, poser nos valises et nous sentir chez nous.",
      "Depuis, la vie a pris une autre direction. Ma sœur est retournée vivre en Suisse et n’envisage plus de s’installer à Jávea. Notre projet familial a évolué ; l’appartement, lui, est prêt à accueillir une nouvelle histoire. Nous le proposons aujourd’hui à la vente, sans urgence, avec l’espoir que ses prochains propriétaires s’y sentiront aussi bien que nous l’avions imaginé."
    ],
    "imageAlt": "La cuisine vert forêt et l’espace repas de Jávea Bliss"
  },
  "en": {
    "label": "A word from the owner",
    "title": "Designed to be lived in",
    "paragraphs": [
      "There are apartments you buy for a few days away. And then there are those where you can truly picture yourself living. When my sister and I bought this one in Jávea at the end of 2024, we saw it as an investment, but also as the start of a new chapter for our family. We imagined that one day, one of us might settle here.",
      "It was with that thought in mind that I began the renovation. Of course I wanted an apartment that would be a pleasure to return to on holiday, but above all, one that would be comfortable for everyday living. We paid as much attention to what you see — the materials and finishes — as to what you feel: the peace and quiet offered by sound insulation, and the comfort provided by thermal insulation.",
      "The same care guided the less obvious choices. The windows, the light switches with dimmer controls, the cupboards: every detail was considered to make daily life simpler and more pleasant. Even the kitchen utensils, crockery and crystal glasses were chosen just as we would choose them for our own home. We wanted to be able to arrive, put down our suitcases and feel at home.",
      "Since then, life has taken a different direction. My sister has returned to live in Switzerland and no longer plans to settle in Jávea. Our family project has evolved; the apartment is ready for a new chapter. We are now offering it for sale, without any rush, with the hope that its next owners will feel the sense of home we had imagined for ourselves."
    ],
    "imageAlt": "The forest-green kitchen and dining area at Jávea Bliss"
  },
  "es": {
    "label": "Unas palabras del propietario",
    "title": "Pensado para vivir en él",
    "paragraphs": [
      "Hay apartamentos que se compran para pasar unos días. Y luego están aquellos en los que uno se imagina de verdad viviendo. Cuando mi hermana y yo compramos este apartamento en Jávea, a finales de 2024, veíamos en él una inversión, pero también el comienzo de una historia familiar. Imaginábamos que, algún día, uno de nosotros podría instalarse aquí.",
      "Con esa idea emprendí la reforma. Quería un apartamento al que diera gusto volver de vacaciones, por supuesto, pero sobre todo un lugar cómodo para vivir a diario. Prestamos tanta atención a lo que se ve —los materiales, los acabados— como a lo que se siente: la tranquilidad que aporta el aislamiento acústico y el confort del aislamiento térmico.",
      "El mismo cuidado guio las decisiones menos visibles. Las ventanas, los interruptores con reguladores de intensidad, los armarios: cada detalle se pensó para hacer la vida más sencilla y agradable. Hasta los utensilios de cocina, la vajilla y las copas de cristal, elegidos como lo haríamos para nuestra propia casa. Queríamos poder llegar, dejar las maletas y sentirnos en casa.",
      "Desde entonces, la vida ha tomado otro rumbo. Mi hermana ha vuelto a vivir en Suiza y ya no contempla instalarse en Jávea. Nuestro proyecto familiar ha cambiado; el apartamento, en cambio, está listo para acoger una nueva historia. Hoy lo ponemos a la venta, sin prisa, con la esperanza de que sus próximos propietarios se sientan aquí tan a gusto como nosotros habíamos imaginado."
    ],
    "imageAlt": "La cocina verde bosque y el comedor de Jávea Bliss"
  },
  "de": {
    "label": "Ein Wort des Eigentümers",
    "title": "Als Zuhause gedacht",
    "paragraphs": [
      "Manche Wohnungen kauft man, um dort ein paar Tage zu verbringen. Und dann gibt es jene, in denen man sich sein Leben vorstellen kann. Als meine Schwester und ich diese Wohnung in Jávea Ende 2024 kauften, sahen wir darin eine Investition, aber auch den Beginn einer gemeinsamen Familiengeschichte. Wir stellten uns vor, dass eines Tages einer von uns hier leben könnte.",
      "Mit diesem Gedanken begann ich die Renovierung. Natürlich wollte ich eine Wohnung, in die man im Urlaub gerne zurückkehrt. Vor allem aber sollte sie im Alltag ein angenehmes Zuhause sein. Wir schenkten dem Sichtbaren — den Materialien und der Verarbeitung — ebenso viel Aufmerksamkeit wie dem, was man spürt: der Ruhe durch die Schalldämmung und dem Wohnkomfort durch die Wärmedämmung.",
      "Dieselbe Sorgfalt galt auch den unauffälligeren Entscheidungen. Die Fenster, die Lichtschalter mit Dimmern, die Schränke: Jedes Detail sollte den Alltag einfacher und angenehmer machen. Das reichte bis zu den Küchenutensilien, dem Geschirr und den Kristallgläsern, die wir so auswählten, wie wir es für unser eigenes Zuhause tun würden. Wir wollten ankommen, die Koffer abstellen und uns zu Hause fühlen.",
      "Inzwischen hat das Leben eine andere Richtung genommen. Meine Schwester ist in die Schweiz zurückgekehrt und plant nicht mehr, sich in Jávea niederzulassen. Unser Familienprojekt hat sich verändert; die Wohnung ist bereit für eine neue Geschichte. Wir bieten sie heute ohne Zeitdruck zum Verkauf an und hoffen, dass sich ihre nächsten Eigentümer hier so wohlfühlen werden, wie wir es uns vorgestellt hatten."
    ],
    "imageAlt": "Die waldgrüne Küche und der Essbereich von Jávea Bliss"
  },
  "nl": {
    "label": "Een woord van de eigenaar",
    "title": "Bedoeld om zelf in te wonen",
    "paragraphs": [
      "Er zijn appartementen die je koopt om er af en toe een paar dagen door te brengen. En er zijn appartementen waarin je jezelf echt ziet wonen. Toen mijn zus en ik dit appartement in Jávea eind 2024 kochten, zagen we het als een investering, maar ook als het begin van een familieverhaal. We stelden ons voor dat een van ons zich hier ooit zou kunnen vestigen.",
      "Met die gedachte ben ik aan de renovatie begonnen. Natuurlijk wilde ik een appartement waar het fijn thuiskomen is tijdens de vakantie, maar vooral een plek waar je ook elke dag comfortabel kunt wonen. We besteedden evenveel aandacht aan wat je ziet — de materialen en de afwerking — als aan wat je ervaart: de rust dankzij de geluidsisolatie en het comfort van de warmte-isolatie.",
      "Diezelfde zorg bepaalde ook de minder opvallende keuzes. De ramen, de lichtschakelaars met dimmers, de kasten: elk detail is doordacht om het dagelijks leven eenvoudiger en aangenamer te maken. Tot en met het keukengerei, het servies en de kristallen glazen, gekozen zoals je dat voor je eigen huis zou doen. We wilden kunnen aankomen, onze koffers neerzetten en ons thuis voelen.",
      "Sindsdien heeft het leven een andere wending genomen. Mijn zus is weer in Zwitserland gaan wonen en is niet langer van plan zich in Jávea te vestigen. Ons familieproject is veranderd; het appartement is klaar voor een nieuw verhaal. We bieden het nu zonder haast te koop aan, in de hoop dat de volgende eigenaren zich hier net zo thuis zullen voelen als wij ons hadden voorgesteld."
    ],
    "imageAlt": "De bosgroene keuken en de eethoek van Jávea Bliss"
  },
  "it": {
    "label": "Una parola dal proprietario",
    "title": "Pensato per viverci",
    "paragraphs": [
      "Ci sono appartamenti che si acquistano per trascorrervi qualche giorno. E poi ci sono quelli in cui ci si immagina davvero di vivere. Quando mia sorella e io abbiamo comprato questo appartamento a Jávea, alla fine del 2024, vi vedevamo un investimento, ma anche l’inizio di una storia di famiglia. Immaginavamo che un giorno uno di noi avrebbe potuto stabilirsi qui.",
      "È con questa idea in mente che ho intrapreso la ristrutturazione. Volevo un appartamento in cui fosse piacevole tornare in vacanza, certo, ma soprattutto comodo da vivere ogni giorno. Abbiamo dedicato la stessa attenzione a ciò che si vede — i materiali, le finiture — e a ciò che si percepisce: la tranquillità, grazie all’isolamento acustico, e il comfort offerto dall’isolamento termico.",
      "La stessa cura ha guidato anche le scelte meno evidenti. Le finestre, gli interruttori con regolazione dell’intensità luminosa, gli armadi: ogni dettaglio è stato pensato per rendere la vita più semplice e piacevole. Fino agli utensili da cucina, alle stoviglie e ai bicchieri di cristallo, scelti come si farebbe per la propria casa. Volevamo poter arrivare, posare le valigie e sentirci a casa.",
      "Da allora, la vita ha preso un’altra direzione. Mia sorella è tornata a vivere in Svizzera e non prevede più di trasferirsi a Jávea. Il nostro progetto familiare è cambiato; l’appartamento, invece, è pronto ad accogliere una nuova storia. Oggi lo proponiamo in vendita, senza fretta, con la speranza che i prossimi proprietari vi si sentano bene come noi avevamo immaginato."
    ],
    "imageAlt": "La cucina verde bosco e la zona pranzo di Jávea Bliss"
  }
};

export const saleReason: Record<SaleLanguage, { question: string; answer: string }> = {
  "fr": {
    "question": "Pourquoi cet appartement est-il en vente ?",
    "answer": "Ma sœur et moi l’avons acheté fin 2024 avec l’idée que l’un de nous pourrait un jour y vivre. Je l’ai rénové dans cet esprit, en soignant le confort et les détails du quotidien. Depuis, ma sœur est retournée en Suisse et notre projet a changé. Nous le proposons donc à la vente, sans urgence."
  },
  "en": {
    "question": "Why is the apartment for sale?",
    "answer": "My sister and I bought it at the end of 2024 with the idea that one of us might live here one day. I renovated it with that in mind, paying close attention to comfort and the details of everyday life. Since then, my sister has returned to Switzerland and our plans have changed. We are therefore offering it for sale, without any rush."
  },
  "es": {
    "question": "¿Por qué se vende el apartamento?",
    "answer": "Mi hermana y yo lo compramos a finales de 2024 con la idea de que algún día uno de nosotros pudiera vivir aquí. Lo reformé con ese espíritu, cuidando el confort y los detalles del día a día. Desde entonces, mi hermana ha regresado a Suiza y nuestro proyecto ha cambiado. Por eso lo ponemos a la venta, sin prisa."
  },
  "de": {
    "question": "Warum wird die Wohnung verkauft?",
    "answer": "Meine Schwester und ich haben die Wohnung Ende 2024 mit der Vorstellung gekauft, dass eines Tages einer von uns hier leben könnte. In diesem Sinne habe ich sie renoviert und dabei besonders auf Wohnkomfort und die Details des Alltags geachtet. Inzwischen ist meine Schwester in die Schweiz zurückgekehrt, und unsere Pläne haben sich geändert. Deshalb bieten wir die Wohnung nun ohne Zeitdruck zum Verkauf an."
  },
  "nl": {
    "question": "Waarom staat het appartement te koop?",
    "answer": "Mijn zus en ik kochten het appartement eind 2024 met het idee dat een van ons er ooit zou kunnen wonen. Met die gedachte heb ik het gerenoveerd, met aandacht voor comfort en de details van het dagelijks leven. Inmiddels is mijn zus teruggekeerd naar Zwitserland en zijn onze plannen veranderd. Daarom bieden we het nu zonder haast te koop aan."
  },
  "it": {
    "question": "Perché l’appartamento è in vendita?",
    "answer": "Mia sorella e io lo abbiamo acquistato alla fine del 2024 con l’idea che un giorno uno di noi potesse viverci. L’ho ristrutturato con questo spirito, curando il comfort e i dettagli della vita quotidiana. Da allora, mia sorella è tornata in Svizzera e il nostro progetto è cambiato. Lo proponiamo quindi in vendita, senza fretta."
  }
};
