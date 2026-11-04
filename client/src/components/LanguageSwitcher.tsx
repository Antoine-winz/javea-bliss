import { useLanguage, Language } from "../contexts/LanguageContext";
import { trackLanguageSwitch } from "@/lib/analytics";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  return (
    <select
      aria-label={({ fr: "Langue du site", en: "Website language", es: "Idioma del sitio", de: "Sprache der Website", nl: "Taal van de website", it: "Lingua del sito" })[language]}
      value={language}
      onChange={(event) => {
        const next = event.target.value as Language;
        trackLanguageSwitch(language, next);
        setLanguage(next);
      }}
      className="min-h-11 max-w-[10rem] cursor-pointer rounded-none bg-transparent px-2 py-2 font-sans text-base font-medium text-inherit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 md:text-sm"
    >
      {languages.map((lang) => <option key={lang.code} value={lang.code} className="bg-bone text-ink">{lang.flag} {lang.name}</option>)}
    </select>
  );
};

export default LanguageSwitcher;
