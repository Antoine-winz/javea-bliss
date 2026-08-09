import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, Language } from "../contexts/LanguageContext";
import { trackLanguageSwitch } from "@/lib/analytics";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      {/* Inherits colour from the nav so it works over the hero photo and on light
          surfaces alike — hence no background or border of its own. */}
      <DropdownMenuTrigger
        className="inline-flex items-center gap-1.5 font-sans text-[0.8125rem] tracking-[0.12em] uppercase transition-opacity hover:opacity-70 focus-visible:outline-none"
        aria-label="Change language"
      >
        <span className="text-base leading-none">{currentLanguage?.flag}</span>
        <span className="hidden sm:inline">{currentLanguage?.code.toUpperCase()}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[160px] rounded-none border-ink/12 bg-bone p-0"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => {
              trackLanguageSwitch(language, lang.code);
              setLanguage(lang.code);
            }}
            className={`cursor-pointer rounded-none px-4 py-3 text-[0.875rem] focus:bg-sand ${
              language === lang.code ? 'text-brass' : 'text-ink-soft'
            }`}
            data-testid={`lang-switch-${lang.code}`}
          >
            <span className="mr-3 text-base leading-none">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;