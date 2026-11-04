import type { SaleLanguage } from "./sale-content";

export interface SalesPrivacyContent {
  title: string; intro: string; back: string; sections: [string, string][];
  gaTitle: string; gaOff: string; gaOn: string; accept: string; reject: string; regulator: string;
}

export const salesPrivacy: Record<SaleLanguage, SalesPrivacyContent> = {
  "fr": {
    "title": "Confidentialité et données personnelles",
    "intro": "Comment nous utilisons les données de visite et les informations transmises pour demander la brochure ou organiser une visite de l’appartement.",
    "back": "Retour à l’appartement à vendre",
    "gaTitle": "Statistiques Google Analytics",
    "gaOff": "Désactivées. Aucun chargement de Google Analytics sans votre accord.",
    "gaOn": "Activées avec votre accord. Vous pouvez les désactiver ici à tout moment.",
    "accept": "Activer Google Analytics",
    "reject": "Désactiver Google Analytics",
    "regulator": "Contacter l’autorité espagnole de protection des données (AEPD)",
    "sections": [
      [
        "Qui gère vos données ?",
        "Les propriétaires de l’appartement Jávea Bliss gèrent les demandes de vente. Pour toute question ou pour exercer vos droits : admin@javeabliss.com."
      ],
      [
        "Brochure et visites",
        "Vos coordonnées servent à vérifier votre e-mail, fournir la brochure, répondre à votre demande et organiser le suivi ou une visite. Chaque brochure téléchargée porte votre nom, votre e-mail, la date et une référence personnelle. Évitez de partager cette copie publiquement."
      ],
      [
        "Données utilisées",
        "Le formulaire demande vos nom, e-mail, téléphone, type d’acheteur, agence le cas échéant et langue. Il conserve votre accord et les accès à la brochure. Les journaux de visite enregistrent aussi l’IP, la date, les pages consultées, le navigateur et la provenance. La ville et le pays sont estimés localement à partir de l’IP, sans GPS ni envoi de l’IP à un service de localisation externe."
      ],
      [
        "Finalités et fondements",
        "Nous répondons aux démarches que vous engagez pour l’achat et utilisons notre intérêt légitime pour la sécurité et le suivi de nos échanges. Les coordonnées et la vérification de l’e-mail sont nécessaires pour obtenir la brochure. Google Analytics est facultatif et repose sur votre accord ; son refus ne bloque aucun service."
      ],
      [
        "Cookies et mesure d’audience",
        "La langue peut être mémorisée pendant un an et l’accès à la brochure pendant 24 heures. Les statistiques internes fonctionnent côté serveur, sans cookie de mesure d’audience. Google Analytics ne se charge que si vous l’activez ci-dessous. Ce choix et les cookies Analytics ont une durée maximale de six mois. Vous pouvez retirer votre accord ici."
      ],
      [
        "Prestataires et sécurité",
        "L’accès est réservé aux propriétaires et aux prestataires nécessaires : Replit pour l’hébergement, Neon pour la base de données, Resend pour les e-mails et Google pour la typographie du site, ainsi que pour Analytics si vous l’activez. Certains traitements peuvent avoir lieu hors de l’Espace économique européen ; contactez-nous pour les informations sur les lieux et garanties applicables. Les accès administrateur et les brochures sont protégés ; vos coordonnées ne sont pas publiées sur le site."
      ],
      [
        "Conservation",
        "Le nettoyage périodique supprime les demandes non vérifiées après 48 heures et les demandes vérifiées 365 jours après leur vérification, avec leur historique de téléchargement. Les statistiques internes ont un historique distinct, conservé pour suivre l’audience et sécuriser le site pendant sa présentation à la vente ; cette conservation doit être réexaminée lorsque ces finalités prennent fin."
      ],
      [
        "Vos droits",
        "Selon les conditions applicables, vous pouvez demander l’accès, la rectification, l’effacement, la limitation, la portabilité ou vous opposer au traitement. Vous pouvez retirer votre accord sans effet sur les traitements déjà effectués. Écrivez à admin@javeabliss.com. Vous pouvez aussi adresser une réclamation à l’AEPD."
      ]
    ]
  },
  "en": {
    "title": "Privacy and personal data",
    "intro": "How we use visit data and the details you provide to request the brochure or arrange a viewing of the apartment.",
    "back": "Return to the apartment for sale",
    "gaTitle": "Google Analytics statistics",
    "gaOff": "Disabled. Google Analytics does not load without your agreement.",
    "gaOn": "Enabled with your agreement. You can disable it here at any time.",
    "accept": "Enable Google Analytics",
    "reject": "Disable Google Analytics",
    "regulator": "Contact the Spanish data protection authority (AEPD)",
    "sections": [
      [
        "Who handles your data?",
        "The owners of the Jávea Bliss apartment handle sales enquiries. For questions or to exercise your rights, contact admin@javeabliss.com."
      ],
      [
        "Brochure and viewings",
        "We use your details to verify your email, provide the brochure, answer your enquiry and arrange follow-up or a viewing. Each downloaded brochure carries your name, email, date and a personal reference. Please avoid sharing this copy publicly."
      ],
      [
        "Data used",
        "The form asks for your name, email, telephone number, buyer type, agency where applicable and language. Your agreement and brochure access are recorded. Visit logs also record IP address, date, pages viewed, browser and referral source. Town and country are estimated locally from the IP, without GPS or sending the IP to an external location service."
      ],
      [
        "Purposes and legal grounds",
        "We respond to the steps you take towards a purchase and rely on our legitimate interests for security and following up our exchanges. Contact details and email verification are needed to obtain the brochure. Google Analytics is optional and based on your agreement; declining it does not restrict any service."
      ],
      [
        "Cookies and audience measurement",
        "Your language may be remembered for one year and brochure access for 24 hours. Internal statistics run on the server without audience-measurement cookies. Google Analytics loads only if you enable it below. This choice and Analytics cookies last no more than six months. You can withdraw your agreement here."
      ],
      [
        "Providers and security",
        "Access is restricted to the owners and necessary providers: Replit for hosting, Neon for the database, Resend for email and Google for the website’s fonts, as well as Analytics if you enable it. Some processing may occur outside the European Economic Area; contact us for information about locations and applicable safeguards. Administrator access and brochures are protected; your contact details are not published on the website."
      ],
      [
        "Retention",
        "Periodic cleanup removes unverified requests after 48 hours and verified requests 365 days after verification, together with their download history. Internal statistics have a separate history, kept to monitor the audience and secure the website while it presents the apartment for sale; retention must be reviewed when these purposes end."
      ],
      [
        "Your rights",
        "Subject to the applicable conditions, you may request access, correction, deletion, restriction or portability, or object to processing. You can withdraw your agreement without affecting processing already carried out. Write to admin@javeabliss.com. You may also lodge a complaint with the AEPD."
      ]
    ]
  },
  "es": {
    "title": "Privacidad y datos personales",
    "intro": "Cómo utilizamos los datos de visita y la información que facilita para solicitar el folleto o concertar una visita al apartamento.",
    "back": "Volver al apartamento en venta",
    "gaTitle": "Estadísticas de Google Analytics",
    "gaOff": "Desactivadas. Google Analytics no se carga sin su autorización.",
    "gaOn": "Activadas con su autorización. Puede desactivarlas aquí en cualquier momento.",
    "accept": "Activar Google Analytics",
    "reject": "Desactivar Google Analytics",
    "regulator": "Contactar con la Agencia Española de Protección de Datos (AEPD)",
    "sections": [
      [
        "¿Quién gestiona sus datos?",
        "Los propietarios del apartamento Jávea Bliss gestionan las consultas de venta. Para cualquier pregunta o para ejercer sus derechos: admin@javeabliss.com."
      ],
      [
        "Folleto y visitas",
        "Sus datos sirven para verificar su correo, facilitar el folleto, responder a su consulta y organizar el seguimiento o una visita. Cada folleto descargado lleva su nombre, correo, fecha y una referencia personal. Evite compartir esta copia públicamente."
      ],
      [
        "Datos utilizados",
        "El formulario solicita nombre, correo, teléfono, tipo de comprador, agencia si corresponde e idioma. Se registran su autorización y los accesos al folleto. Los registros de visita incluyen IP, fecha, páginas consultadas, navegador y procedencia. La localidad y el país se estiman localmente a partir de la IP, sin GPS ni envío de la IP a un servicio externo de localización."
      ],
      [
        "Finalidades y bases jurídicas",
        "Atendemos las gestiones que inicia para la compra y nos basamos en nuestro interés legítimo para la seguridad y el seguimiento de las comunicaciones. Los datos de contacto y la verificación del correo son necesarios para obtener el folleto. Google Analytics es opcional y requiere su autorización; rechazarlo no limita ningún servicio."
      ],
      [
        "Cookies y medición de audiencia",
        "El idioma puede recordarse durante un año y el acceso al folleto durante 24 horas. Las estadísticas internas funcionan en el servidor, sin cookies de medición de audiencia. Google Analytics solo se carga si lo activa a continuación. Esta elección y las cookies de Analytics duran como máximo seis meses. Puede retirar su autorización aquí."
      ],
      [
        "Proveedores y seguridad",
        "El acceso se limita a los propietarios y proveedores necesarios: Replit para el alojamiento, Neon para la base de datos, Resend para los correos y Google para las fuentes de la web y para Analytics si lo activa. Algunos tratamientos pueden realizarse fuera del Espacio Económico Europeo; contáctenos para conocer los lugares y las garantías aplicables. La administración y los folletos están protegidos; sus datos de contacto no se publican en la web."
      ],
      [
        "Conservación",
        "La limpieza periódica elimina las solicitudes no verificadas después de 48 horas y las verificadas 365 días después de su verificación, junto con su historial de descargas. Las estadísticas internas tienen un historial independiente, conservado para seguir la audiencia y proteger la web mientras presenta el apartamento en venta; su conservación deberá revisarse cuando terminen esas finalidades."
      ],
      [
        "Sus derechos",
        "En las condiciones aplicables, puede solicitar acceso, rectificación, supresión, limitación o portabilidad, u oponerse al tratamiento. Puede retirar su autorización sin afectar al tratamiento ya realizado. Escriba a admin@javeabliss.com. También puede presentar una reclamación ante la AEPD."
      ]
    ]
  },
  "de": {
    "title": "Datenschutz und personenbezogene Daten",
    "intro": "Wie wir Besuchsdaten und Ihre Angaben verwenden, wenn Sie die Broschüre anfordern oder eine Wohnungsbesichtigung vereinbaren.",
    "back": "Zurück zur Wohnung zum Kauf",
    "gaTitle": "Google-Analytics-Statistiken",
    "gaOff": "Deaktiviert. Google Analytics wird ohne Ihre Zustimmung nicht geladen.",
    "gaOn": "Mit Ihrer Zustimmung aktiviert. Sie können es hier jederzeit deaktivieren.",
    "accept": "Google Analytics aktivieren",
    "reject": "Google Analytics deaktivieren",
    "regulator": "Spanische Datenschutzbehörde (AEPD) kontaktieren",
    "sections": [
      [
        "Wer verwaltet Ihre Daten?",
        "Die Eigentümer der Wohnung Jávea Bliss bearbeiten Kaufanfragen. Bei Fragen oder zur Ausübung Ihrer Rechte: admin@javeabliss.com."
      ],
      [
        "Broschüre und Besichtigungen",
        "Ihre Angaben dienen der E-Mail-Bestätigung, der Bereitstellung der Broschüre, der Beantwortung Ihrer Anfrage sowie weiteren Gesprächen oder einer Besichtigung. Jede heruntergeladene Broschüre trägt Ihren Namen, Ihre E-Mail-Adresse, das Datum und eine persönliche Referenz. Bitte teilen Sie diese Kopie nicht öffentlich."
      ],
      [
        "Verwendete Daten",
        "Das Formular fragt nach Name, E-Mail, Telefonnummer, Käufertyp, gegebenenfalls Agentur und Sprache. Ihre Zustimmung und Broschürenzugriffe werden gespeichert. Besuchsprotokolle enthalten auch IP-Adresse, Datum, aufgerufene Seiten, Browser und Herkunft. Stadt und Land werden lokal anhand der IP geschätzt, ohne GPS oder Übermittlung an einen externen Standortdienst."
      ],
      [
        "Zwecke und Rechtsgrundlagen",
        "Wir bearbeiten Ihre Schritte zu einem möglichen Kauf und stützen Sicherheit und die weitere Kommunikation auf unser berechtigtes Interesse. Kontaktdaten und E-Mail-Bestätigung sind für die Broschüre erforderlich. Google Analytics ist freiwillig und setzt Ihre Zustimmung voraus; eine Ablehnung schränkt keinen Dienst ein."
      ],
      [
        "Cookies und Besuchsstatistiken",
        "Die Sprache kann ein Jahr und der Broschürenzugang 24 Stunden gespeichert werden. Interne Statistiken laufen auf dem Server ohne Cookies zur Reichweitenmessung. Google Analytics wird nur geladen, wenn Sie es unten aktivieren. Diese Wahl und Analytics-Cookies gelten höchstens sechs Monate. Sie können Ihre Zustimmung hier widerrufen."
      ],
      [
        "Dienstleister und Sicherheit",
        "Zugriff haben nur die Eigentümer und notwendige Dienstleister: Replit für das Hosting, Neon für die Datenbank, Resend für E-Mails und Google für die Schriftarten der Website sowie bei aktiviertem Analytics. Manche Verarbeitungen können außerhalb des Europäischen Wirtschaftsraums stattfinden; Informationen zu Standorten und geltenden Garantien erhalten Sie auf Anfrage. Verwaltung und Broschüren sind geschützt; Ihre Kontaktdaten werden nicht auf der Website veröffentlicht."
      ],
      [
        "Aufbewahrung",
        "Die regelmäßige Bereinigung entfernt unbestätigte Anfragen nach 48 Stunden und bestätigte Anfragen 365 Tage nach Bestätigung samt Downloadverlauf. Interne Statistiken haben eine getrennte Historie zur Beobachtung der Besucherzahlen und zum Schutz der Website während des Wohnungsverkaufs; ihre Aufbewahrung muss nach Wegfall dieser Zwecke überprüft werden."
      ],
      [
        "Ihre Rechte",
        "Unter den geltenden Voraussetzungen können Sie Auskunft, Berichtigung, Löschung, Einschränkung oder Übertragbarkeit verlangen oder der Verarbeitung widersprechen. Ein Widerruf berührt die bisherige Verarbeitung nicht. Schreiben Sie an admin@javeabliss.com. Sie können sich auch bei der AEPD beschweren."
      ]
    ]
  },
  "nl": {
    "title": "Privacy en persoonsgegevens",
    "intro": "Hoe we bezoekgegevens en de informatie gebruiken die u verstrekt om de brochure aan te vragen of een bezichtiging te regelen.",
    "back": "Terug naar het appartement te koop",
    "gaTitle": "Google Analytics-statistieken",
    "gaOff": "Uitgeschakeld. Google Analytics wordt niet geladen zonder uw toestemming.",
    "gaOn": "Ingeschakeld met uw toestemming. U kunt dit hier op elk moment uitschakelen.",
    "accept": "Google Analytics inschakelen",
    "reject": "Google Analytics uitschakelen",
    "regulator": "Contact opnemen met de Spaanse privacytoezichthouder (AEPD)",
    "sections": [
      [
        "Wie beheert uw gegevens?",
        "De eigenaren van het appartement Jávea Bliss behandelen verkoopaanvragen. Voor vragen of het uitoefenen van uw rechten: admin@javeabliss.com."
      ],
      [
        "Brochure en bezichtigingen",
        "Uw gegevens worden gebruikt om uw e-mail te bevestigen, de brochure te verstrekken, uw aanvraag te beantwoorden en vervolgcontact of een bezichtiging te regelen. Elke gedownloade brochure bevat uw naam, e-mailadres, de datum en een persoonlijke referentie. Deel deze kopie liever niet openbaar."
      ],
      [
        "Gebruikte gegevens",
        "Het formulier vraagt om naam, e-mail, telefoonnummer, type koper, eventueel makelaarskantoor en taal. Uw toestemming en brochuretoegang worden vastgelegd. Bezoeklogboeken bevatten ook IP-adres, datum, bezochte pagina’s, browser en herkomst. Plaats en land worden lokaal geschat op basis van het IP, zonder GPS of verzending naar een externe locatiedienst."
      ],
      [
        "Doeleinden en grondslagen",
        "We beantwoorden uw stappen naar een mogelijke aankoop en gebruiken ons gerechtvaardigd belang voor beveiliging en vervolgcontact. Contactgegevens en e-mailbevestiging zijn nodig om de brochure te ontvangen. Google Analytics is optioneel en vereist uw toestemming; weigeren beperkt geen enkele dienst."
      ],
      [
        "Cookies en bezoekersstatistieken",
        "De taal kan een jaar en brochuretoegang 24 uur worden onthouden. Interne statistieken werken op de server zonder cookies voor bezoekersmeting. Google Analytics wordt alleen geladen als u dit hieronder inschakelt. Deze keuze en Analytics-cookies gelden maximaal zes maanden. U kunt uw toestemming hier intrekken."
      ],
      [
        "Dienstverleners en beveiliging",
        "Alleen de eigenaren en noodzakelijke dienstverleners hebben toegang: Replit voor hosting, Neon voor de database, Resend voor e-mail en Google voor de lettertypen van de website en voor Analytics als u dit inschakelt. Sommige verwerkingen kunnen buiten de Europese Economische Ruimte plaatsvinden; neem contact op voor informatie over locaties en toepasselijke waarborgen. Beheer en brochures zijn beveiligd; uw contactgegevens worden niet op de website gepubliceerd."
      ],
      [
        "Bewaartermijnen",
        "Periodieke opschoning verwijdert onbevestigde aanvragen na 48 uur en bevestigde aanvragen 365 dagen na bevestiging, samen met hun downloadgeschiedenis. Interne statistieken hebben een afzonderlijke historie voor bezoekersanalyse en beveiliging zolang de website het appartement te koop aanbiedt; de bewaring moet worden herzien zodra deze doeleinden vervallen."
      ],
      [
        "Uw rechten",
        "Onder de toepasselijke voorwaarden kunt u inzage, correctie, verwijdering, beperking of overdraagbaarheid vragen, of bezwaar maken tegen verwerking. U kunt uw toestemming intrekken zonder gevolgen voor eerdere verwerking. Schrijf naar admin@javeabliss.com. U kunt ook een klacht indienen bij de AEPD."
      ]
    ]
  },
  "it": {
    "title": "Privacy e dati personali",
    "intro": "Come utilizziamo i dati di visita e le informazioni fornite per richiedere la brochure o organizzare una visita all’appartamento.",
    "back": "Torna all’appartamento in vendita",
    "gaTitle": "Statistiche di Google Analytics",
    "gaOff": "Disattivate. Google Analytics non viene caricato senza il suo consenso.",
    "gaOn": "Attivate con il suo consenso. Può disattivarle qui in qualsiasi momento.",
    "accept": "Attivare Google Analytics",
    "reject": "Disattivare Google Analytics",
    "regulator": "Contattare l’autorità spagnola per la protezione dei dati (AEPD)",
    "sections": [
      [
        "Chi gestisce i dati?",
        "I proprietari dell’appartamento Jávea Bliss gestiscono le richieste di vendita. Per domande o per esercitare i suoi diritti: admin@javeabliss.com."
      ],
      [
        "Brochure e visite",
        "I dati servono per verificare l’e-mail, fornire la brochure, rispondere alla richiesta e organizzare i contatti successivi o una visita. Ogni brochure scaricata riporta nome, e-mail, data e un riferimento personale. Eviti di condividere pubblicamente questa copia."
      ],
      [
        "Dati utilizzati",
        "Il modulo richiede nome, e-mail, telefono, tipo di acquirente, eventuale agenzia e lingua. Vengono registrati il consenso e gli accessi alla brochure. I registri di visita includono anche IP, data, pagine consultate, browser e provenienza. Città e paese sono stimati localmente dall’IP, senza GPS né invio dell’IP a un servizio esterno di localizzazione."
      ],
      [
        "Finalità e basi giuridiche",
        "Rispondiamo alle iniziative intraprese per l’acquisto e utilizziamo il nostro legittimo interesse per la sicurezza e il seguito delle comunicazioni. I dati di contatto e la verifica dell’e-mail sono necessari per ottenere la brochure. Google Analytics è facoltativo e richiede il consenso; rifiutarlo non limita alcun servizio."
      ],
      [
        "Cookie e statistiche di visita",
        "La lingua può essere ricordata per un anno e l’accesso alla brochure per 24 ore. Le statistiche interne funzionano sul server senza cookie di misurazione del pubblico. Google Analytics si carica solo se lo attiva qui sotto. Questa scelta e i cookie di Analytics durano al massimo sei mesi. Può ritirare qui il consenso."
      ],
      [
        "Fornitori e sicurezza",
        "L’accesso è riservato ai proprietari e ai fornitori necessari: Replit per l’hosting, Neon per il database, Resend per le e-mail e Google per i caratteri del sito e per Analytics se lo attiva. Alcuni trattamenti possono avvenire fuori dallo Spazio economico europeo; ci contatti per informazioni sui luoghi e sulle garanzie applicabili. Amministrazione e brochure sono protette; i suoi dati di contatto non vengono pubblicati sul sito."
      ],
      [
        "Conservazione",
        "La pulizia periodica elimina le richieste non verificate dopo 48 ore e quelle verificate 365 giorni dopo la verifica, insieme alla cronologia dei download. Le statistiche interne hanno uno storico separato per seguire il pubblico e proteggere il sito mentre presenta l’appartamento in vendita; la conservazione dovrà essere riesaminata quando tali finalità terminano."
      ],
      [
        "I suoi diritti",
        "Alle condizioni applicabili, può chiedere accesso, rettifica, cancellazione, limitazione o portabilità, oppure opporsi al trattamento. Può ritirare il consenso senza effetti sui trattamenti già effettuati. Scriva a admin@javeabliss.com. Può anche presentare un reclamo all’AEPD."
      ]
    ]
  }
};
