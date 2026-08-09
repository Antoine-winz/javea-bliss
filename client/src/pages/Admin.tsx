import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Lock, Settings, Calendar, RefreshCw, Clock, CheckCircle, LogOut, Copy, Check, BarChart3, Plus, Edit, Trash2, ExternalLink, Star, Eye, EyeOff, DollarSign, Ban, Zap } from "lucide-react";
import VisitorStats from "@/components/VisitorStats";
import CleaningSchedule from "@/components/CleaningSchedule";
import ReviewsManagement from "@/components/ReviewsManagement";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertPromotionalOfferSchema, insertGuestReviewSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface SyncStatus {
  isActive: boolean;
  lastSync: string;
  nextSync: string | null;
  syncUrl: string | null;
}

interface PromotionalOffer {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  validUntil: string;
  language: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GuestReview {
  id: number;
  guestName: string;
  country?: string;
  stayDate?: string;
  rating: number;
  reviewText: string;
  language: string;
  isVisible: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

const promotionalOfferFormSchema = insertPromotionalOfferSchema.extend({
  validUntil: z.string().min(1, "Valid until date is required"),
});

const reviewFormSchema = insertGuestReviewSchema.extend({
  rating: z.number().min(1).max(5),
  reviewText: z.string().min(10, "Review must be at least 10 characters"),
});

// Language-specific text suggestions
const getLanguageSuggestions = (language: string) => {
  const suggestions = {
    en: {
      titles: [
        "Unique ! Summer End Promotion – Javea Beach",
        "🔥 LIMITED TIME! 20% OFF Luxury Apartment",
        "Early Bird Special - Premium Coastal Rental",
        "Last Minute Deal - Arenal Beach Paradise",
        "Exclusive Offer - Jávea Holiday Apartment"
      ],
      descriptions: [
        "Enjoy a new 2 bedroom apartment – 300m from Javea Best Beach",
        "Experience luxury at unbeatable rates! Our stunning coastal apartment offers modern amenities, breathtaking views, and walking distance to pristine beaches.",
        "Perfect for couples or families seeking an unforgettable Costa Blanca getaway with premium comfort and exceptional value.",
        "Wake up to Mediterranean sunshine in this fully equipped apartment near Arenal Beach, restaurants, and local attractions.",
        "Discover your slice of paradise with this special promotional rate for our award-winning vacation rental."
      ]
    },
    es: {
      titles: [
        "¡Único! Promoción de Fin de Verano – Playa de Jávea",
        "🔥 ¡TIEMPO LIMITADO! 20% DE DESCUENTO Apartamento de Lujo",
        "Oferta Especial Anticipada - Alquiler Costero Premium",
        "Oferta de Última Hora - Paraíso Playa del Arenal",
        "Oferta Exclusiva - Apartamento Vacacional Jávea"
      ],
      descriptions: [
        "Disfruta de un nuevo apartamento de 2 dormitorios – 300m de la Mejor Playa de Jávea",
        "¡Experimenta el lujo a precios inmejorables! Nuestro impresionante apartamento costero ofrece comodidades modernas, vistas impresionantes y distancia a pie de playas vírgenes.",
        "Perfecto para parejas o familias que buscan una escapada inolvidable en la Costa Blanca con comodidad premium y valor excepcional.",
        "Despierta con el sol mediterráneo en este apartamento completamente equipado cerca de la Playa del Arenal, restaurantes y atracciones locales.",
        "Descubre tu rincón de paraíso con esta tarifa promocional especial para nuestro alquiler vacacional galardonado."
      ]
    },
    fr: {
      titles: [
        "Unique ! Promotion Fin d'Été – Plage de Jávea",
        "🔥 TEMPS LIMITÉ ! 20% DE RÉDUCTION Appartement de Luxe",
        "Offre Spéciale Anticipée - Location Côtière Premium",
        "Offre de Dernière Minute - Paradis Plage d'Arenal",
        "Offre Exclusive - Appartement de Vacances Jávea"
      ],
      descriptions: [
        "Profitez d'un nouvel appartement de 2 chambres – 300m de la Meilleure Plage de Jávea",
        "Vivez le luxe à des prix imbattables ! Notre magnifique appartement côtier offre des équipements modernes, des vues à couper le souffle et une distance de marche des plages immaculées.",
        "Parfait pour les couples ou les familles recherchant une escapade inoubliable sur la Costa Blanca avec un confort premium et une valeur exceptionnelle.",
        "Réveillez-vous au soleil méditerranéen dans cet appartement entièrement équipé près de la Plage d'Arenal, des restaurants et des attractions locales.",
        "Découvrez votre coin de paradis avec ce tarif promotionnel spécial pour notre location de vacances primée."
      ]
    },
    nl: {
      titles: [
        "Uniek ! Einde Zomer Promotie – Jávea Strand",
        "🔥 BEPERKTE TIJD! 20% KORTING Luxe Appartement",
        "Vroegboeker Aanbieding - Premium Kust Verhuur",
        "Last Minute Deal - Arenal Strand Paradijs",
        "Exclusieve Aanbieding - Jávea Vakantie Appartement"
      ],
      descriptions: [
        "Geniet van een nieuw 2 slaapkamer appartement – 300m van Jávea's Beste Strand",
        "Ervaar luxe tegen onverslaanbare prijzen! Ons prachtige kustappartement biedt moderne voorzieningen, adembenemende uitzichten en loopafstand naar ongerepte stranden.",
        "Perfect voor koppels of gezinnen die op zoek zijn naar een onvergetelijke Costa Blanca-vakantie met premium comfort en uitzonderlijke waarde.",
        "Word wakker met mediterrane zon in dit volledig uitgeruste appartement nabij Arenal Strand, restaurants en lokale attracties.",
        "Ontdek je stukje paradijs met dit speciale promotietarief voor onze bekroonde vakantieverhuur."
      ]
    },
    de: {
      titles: [
        "Einzigartig ! Sommerende Promotion – Jávea Strand",
        "🔥 BEGRENZTE ZEIT! 20% RABATT Luxus-Apartment",
        "Frühbucher-Angebot - Premium Küstenvermietung",
        "Last-Minute-Deal - Arenal Strand Paradies",
        "Exklusives Angebot - Jávea Ferienwohnung"
      ],
      descriptions: [
        "Genießen Sie ein neues 2-Schlafzimmer-Apartment – 300m von Jáveas Bestem Strand",
        "Erleben Sie Luxus zu unschlagbaren Preisen! Unser atemberaubendes Küsten-Apartment bietet moderne Annehmlichkeiten, atemberaubende Aussichten und Gehweite zu unberührten Stränden.",
        "Perfekt für Paare oder Familien, die einen unvergesslichen Costa Blanca-Urlaub mit Premium-Komfort und außergewöhnlichem Wert suchen.",
        "Wachen Sie mit mediterraner Sonne in diesem voll ausgestatteten Apartment nahe Arenal Strand, Restaurants und lokalen Attraktionen auf.",
        "Entdecken Sie Ihr Stück Paradies mit diesem speziellen Werbetarif für unsere preisgekrönte Ferienvermietung."
      ]
    }
  };
  
  return suggestions[language as keyof typeof suggestions] || suggestions.en;
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [icalUrl, setIcalUrl] = useState("https://www.airbnb.com/calendar/ical/1437724898890828336.ics?s=fa161fdacdd13bf8dd30a6eaf26e3c98");
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");
  const [blockLabel, setBlockLabel] = useState("");
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<PromotionalOffer | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Update selectedLanguage when editing an offer
  useEffect(() => {
    if (editingOffer) {
      setSelectedLanguage(editingOffer.language);
    }
  }, [editingOffer]);

  // Promotional offers form
  const offerForm = useForm<z.infer<typeof promotionalOfferFormSchema>>({
    resolver: zodResolver(promotionalOfferFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      originalPrice: 210,
      discountedPrice: 168,
      discountPercentage: 20,
      validUntil: (() => {
        // Default to creation date + 5 days at midnight CET
        const now = new Date();
        const cetTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Amsterdam" }));
        cetTime.setDate(cetTime.getDate() + 5);
        return cetTime.toISOString().split('T')[0]; // Return YYYY-MM-DD format
      })(),
      language: "en",
      isActive: true,
    },
  });

  // Last-minute offers toggle
  const { data: lastMinuteSettings, refetch: refetchLastMinuteSettings } = useQuery({
    queryKey: ['/api/last-minute-offers/settings'],
    queryFn: async () => {
      const response = await fetch('/api/last-minute-offers/settings');
      if (!response.ok) throw new Error('Failed to fetch last-minute settings');
      return response.json() as Promise<{ enabled: boolean }>;
    },
  });

  const toggleLastMinuteMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      return await apiRequest('/api/last-minute-offers/settings', 'POST', { enabled });
    },
    onSuccess: (_, enabled) => {
      refetchLastMinuteSettings();
      toast({
        title: enabled ? "Last-minute offers enabled" : "Last-minute offers disabled",
        description: enabled
          ? "The site will now advertise 20% off for available dates in the next 7 days."
          : "No discount promotion will be shown on the site.",
      });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update last-minute offers setting.", variant: "destructive" });
    },
  });

  // Query to fetch promotional offers
  const { data: promotionalOffers, isLoading: offersLoading } = useQuery({
    queryKey: ['/api/promotional-offers'],
    queryFn: async () => {
      const response = await fetch('/api/promotional-offers');
      if (!response.ok) throw new Error('Failed to fetch promotional offers');
      return response.json();
    },
  });

  // Manual date blocks query and mutations
  const { data: manualBlocksData, refetch: refetchManualBlocks } = useQuery({
    queryKey: ['/api/calendar/manual-blocks'],
    queryFn: async () => {
      const response = await fetch('/api/calendar/manual-blocks');
      if (!response.ok) throw new Error('Failed to fetch manual blocks');
      return response.json();
    },
  });
  const manualBlocks: { uid: string; summary: string; startDate: string; endDate: string }[] = manualBlocksData?.blocks || [];

  const addBlockMutation = useMutation({
    mutationFn: async ({ startDate, endDate, label }: { startDate: string; endDate: string; label: string }) => {
      const res = await apiRequest('/api/calendar/manual-block', 'POST', { startDate, endDate, label });
      return res.json();
    },
    onSuccess: () => {
      refetchManualBlocks();
      queryClient.invalidateQueries({ queryKey: ['/api/calendar/blocked-dates'] });
      setBlockStart(""); setBlockEnd(""); setBlockLabel("");
      toast({ title: "Dates blocked", description: "The selected dates are now blocked on your calendar." });
    },
    onError: () => toast({ title: "Error", description: "Failed to block dates.", variant: "destructive" }),
  });

  const removeBlockMutation = useMutation({
    mutationFn: async (uid: string) => {
      const res = await apiRequest(`/api/calendar/manual-block/${encodeURIComponent(uid)}`, 'DELETE');
      return res.json();
    },
    onSuccess: () => {
      refetchManualBlocks();
      queryClient.invalidateQueries({ queryKey: ['/api/calendar/blocked-dates'] });
      toast({ title: "Dates unblocked", description: "The blocked dates have been removed." });
    },
    onError: () => toast({ title: "Error", description: "Failed to remove block.", variant: "destructive" }),
  });

  // Create promotional offer mutation
  const createOfferMutation = useMutation({
    mutationFn: async (data: z.infer<typeof promotionalOfferFormSchema>) => {
      if (editingOffer) {
        return await apiRequest(`/api/promotional-offers/${editingOffer.id}`, 'PUT', data);
      } else {
        return await apiRequest('/api/promotional-offers', 'POST', data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: editingOffer ? "Promotional offer updated successfully" : "Promotional offer created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/promotional-offers'] });
      setShowOfferForm(false);
      setEditingOffer(null);
      offerForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingOffer ? 'update' : 'create'} promotional offer`,
        variant: "destructive",
      });
    },
  });

  // Delete promotional offer mutation
  const deleteOfferMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/promotional-offers/${id}`, 'DELETE');
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Promotional offer deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/promotional-offers'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete promotional offer",
        variant: "destructive",
      });
    },
  });

  const handleCreateOffer = (data: z.infer<typeof promotionalOfferFormSchema>) => {
    // Convert date to midnight CET
    const validUntilDate = new Date(data.validUntil + 'T00:00:00');
    
    // Convert to CET timezone and set to end of day (23:59:59)
    const cetDate = new Date(validUntilDate.toLocaleString("en-US", { timeZone: "Europe/Amsterdam" }));
    cetDate.setHours(23, 59, 59, 999);
    
    const offerData = {
      ...data,
      validUntil: cetDate,
    };
    
    createOfferMutation.mutate(offerData);
  };

  const handleEditOffer = (offer: PromotionalOffer) => {
    setEditingOffer(offer);
    offerForm.reset({
      title: offer.title,
      description: offer.description,
      startDate: offer.startDate,
      endDate: offer.endDate,
      originalPrice: offer.originalPrice,
      discountedPrice: offer.discountedPrice,
      discountPercentage: offer.discountPercentage,
      validUntil: new Date(offer.validUntil).toISOString().split('T')[0], // Convert to YYYY-MM-DD format
      language: offer.language || "en", // Default to English if not set
      isActive: offer.isActive,
    });
    setShowOfferForm(true);
  };

  const handleEditOfferSubmit = (data: z.infer<typeof promotionalOfferFormSchema>) => {
    if (!editingOffer) return;
    
    // Convert date to midnight CET
    const validUntilDate = new Date(data.validUntil + 'T00:00:00');
    
    // Convert to CET timezone and set to end of day (23:59:59)
    const cetDate = new Date(validUntilDate.toLocaleString("en-US", { timeZone: "Europe/Amsterdam" }));
    cetDate.setHours(23, 59, 59, 999);
    
    const offerData = {
      ...data,
      validUntil: cetDate,
    };
    
    createOfferMutation.mutate(offerData);
  };

  // Calculate discounted price when percentage changes
  const calculateDiscountedPrice = (originalPrice: number, percentage: number) => {
    if (originalPrice && percentage && percentage > 0 && percentage < 100) {
      return Math.round(originalPrice * (1 - percentage / 100));
    }
    return originalPrice;
  };

  // Calculate percentage when discounted price changes
  const calculatePercentage = (originalPrice: number, discountedPrice: number) => {
    if (originalPrice && discountedPrice && discountedPrice < originalPrice) {
      return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
    }
    return 0;
  };

  const handleDeleteOffer = (id: number) => {
    if (confirm('Are you sure you want to delete this promotional offer?')) {
      deleteOfferMutation.mutate(id);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Promotional offer URL copied to clipboard",
    });
  };

  // Check for saved authentication on page load
  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      const now = new Date().getTime();
      
      // Check if auth is still valid (30 days = 30 * 24 * 60 * 60 * 1000)
      if (authData.expires > now) {
        setIsAuthenticated(true);
      } else {
        // Auth expired, remove it
        localStorage.removeItem('admin_auth');
      }
    }
  }, []);

  // Fetch sync status
  useEffect(() => {
    if (isAuthenticated) {
      fetchSyncStatus();
    }
  }, [isAuthenticated]);

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch('/api/calendar/sync-status');
      if (response.ok) {
        const data = await response.json();
        setSyncStatus(data);
      }
    } catch (error) {
      // Silent fallback on sync status fetch error
    }
  };
  
  // Handle authentication with optional remember me
  const handleLogin = () => {
    if (password === "javeabliss2024") {
      setIsAuthenticated(true);
      
      // If remember me is checked, save authentication for 30 days
      if (rememberMe) {
        const expirationTime = new Date().getTime() + (30 * 24 * 60 * 60 * 1000); // 30 days
        const authData = {
          authenticated: true,
          expires: expirationTime
        };
        localStorage.setItem('admin_auth', JSON.stringify(authData));
        
        toast({
          title: "Login Successful",
          description: "You'll stay logged in for 30 days",
        });
      } else {
        toast({
          title: "Login Successful",
          description: "You're logged in for this session",
        });
      }
      
      setPassword(""); // Clear password field
    } else {
      toast({
        title: "Authentication Failed",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  // Handle calendar sync
  const handleSync = async () => {
    if (!icalUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter your Airbnb iCal URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ icalUrl: icalUrl.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Sync Successful",
          description: `Calendar synced with ${data.eventCount} events. Daily sync enabled at 2:00 AM.`,
        });
        // Refresh sync status
        fetchSyncStatus();
      } else {
        const errorData = await response.json();
        toast({
          title: "Sync Failed",
          description: errorData.message || "Failed to sync calendar",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Sync Error", 
        description: "Network error occurred during sync",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Admin Access
            </CardTitle>
            <CardDescription>
              Enter the admin password to manage Jávea Bliss
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label 
                htmlFor="remember-me" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me for 30 days
              </Label>
            </div>
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Jávea Bliss Admin</h1>
            <p className="text-gray-600">Manage your rental property and bookings</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => window.open('/', '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Website
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Visitor Stats
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Calendar Sync
            </TabsTrigger>
            <TabsTrigger value="cleaning" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Cleaning Schedule
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="promotions" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Promotions
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <VisitorStats />
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Airbnb Calendar Sync
                </CardTitle>
                <CardDescription>
                  Synchronize your Airbnb calendar to automatically block booked dates on your website.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Airbnb iCal URL</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://www.airbnb.com/calendar/ical/..."
                      value={icalUrl}
                      onChange={(e) => setIcalUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSync}
                      disabled={isLoading}
                      className="shrink-0"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        "Sync Calendar"
                      )}
                    </Button>
                  </div>
                </div>

                {/* Sync Status Display */}
                {syncStatus && (
                  <div className={`p-4 rounded-lg ${syncStatus.isActive ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {syncStatus.isActive ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-500" />
                      )}
                      <h4 className="font-medium">
                        {syncStatus.isActive ? 'Daily Sync Active' : 'Daily Sync Inactive'}
                      </h4>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>Last sync: {new Date(syncStatus.lastSync).toLocaleString()}</p>
                      {syncStatus.isActive && syncStatus.nextSync && (
                        <p>Next sync: {new Date(syncStatus.nextSync).toLocaleString()}</p>
                      )}
                      {syncStatus.syncUrl && (
                        <div className="mt-3">
                          <p className="text-gray-600 mb-2">Connected to Airbnb Calendar:</p>
                          <div className="bg-white p-3 rounded border text-xs font-mono break-all select-all">
                            {syncStatus.syncUrl}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            ↑ Click to select and copy this URL for future use
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-1">How to get your Airbnb iCal URL:</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Go to your Airbnb hosting dashboard</li>
                    <li>2. Navigate to Calendar → Availability settings</li>
                    <li>3. Find "Export calendar" section</li>
                    <li>4. Copy the iCal link and paste it above</li>
                  </ol>
                  <a 
                    href="https://www.airbnb.com/hosting/calendar" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
                  >
                    Open Airbnb Calendar →
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Manual Date Blocking */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ban className="w-5 h-5 text-red-500" />
                  Block Dates Manually
                </CardTitle>
                <CardDescription>
                  Block a date range directly on your website calendar — for direct bookings, personal use, or any reason not captured by Airbnb.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Check-in date</label>
                    <Input type="date" value={blockStart} onChange={e => setBlockStart(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Check-out date</label>
                    <Input type="date" value={blockEnd} onChange={e => setBlockEnd(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Label (optional)</label>
                    <Input placeholder="e.g. Direct booking" value={blockLabel} onChange={e => setBlockLabel(e.target.value)} />
                  </div>
                </div>
                <Button
                  onClick={() => {
                    if (!blockStart || !blockEnd) return toast({ title: "Missing dates", description: "Please select both a start and end date.", variant: "destructive" });
                    if (blockEnd <= blockStart) return toast({ title: "Invalid range", description: "Check-out must be after check-in.", variant: "destructive" });
                    addBlockMutation.mutate({ startDate: blockStart, endDate: blockEnd, label: blockLabel || "Owner Block" });
                  }}
                  disabled={addBlockMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {addBlockMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Ban className="w-4 h-4 mr-2" />}
                  Block These Dates
                </Button>

                {manualBlocks.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Currently Blocked Date Ranges</h4>
                    <div className="space-y-2">
                      {manualBlocks.map(block => (
                        <div key={block.uid} className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                          <div>
                            <span className="font-medium text-sm text-red-900">{block.startDate} → {block.endDate}</span>
                            {block.summary && <span className="ml-2 text-xs text-red-700">({block.summary})</span>}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBlockMutation.mutate(block.uid)}
                            disabled={removeBlockMutation.isPending}
                            className="text-red-600 hover:text-red-800 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {manualBlocks.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">No manually blocked date ranges.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cleaning">
            <CleaningSchedule />
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Guest Reviews Management
                </CardTitle>
                <CardDescription>
                  Manage guest reviews and testimonials for your vacation rental website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewsManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="promotions">
            {/* Last-minute offers toggle */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Automatic Last-Minute Offer (20% OFF)
                </CardTitle>
                <CardDescription>
                  When enabled, the site advertises a 20% discount on any available dates in the next 7 days and updates the page title accordingly. Turn this off when you have no promotion running.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 ${lastMinuteSettings?.enabled ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className={`w-3 h-3 rounded-full ${lastMinuteSettings?.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="font-medium">
                      {lastMinuteSettings?.enabled ? 'Currently ON — 20% discount is showing on the site' : 'Currently OFF — no automatic discount shown'}
                    </span>
                  </div>
                  <Button
                    variant={lastMinuteSettings?.enabled ? "destructive" : "default"}
                    onClick={() => toggleLastMinuteMutation.mutate(!lastMinuteSettings?.enabled)}
                    disabled={toggleLastMinuteMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    {lastMinuteSettings?.enabled ? 'Turn Off Discount' : 'Turn On 20% Discount'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Note: This setting resets to OFF when the server restarts. Re-enable it manually if needed.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Promotional Offers
                </CardTitle>
                <CardDescription>
                  Create special promotional offers for your vacation rental website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={() => setShowOfferForm(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Promotion
                  </Button>

                  {/* Promotional offers list */}
                  {offersLoading ? (
                    <div className="text-center py-8">Loading promotional offers...</div>
                  ) : (
                    <div className="space-y-4">
                      {promotionalOffers?.map((offer: PromotionalOffer) => (
                        <div key={offer.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{offer.title}</h3>
                              <p className="text-gray-600 text-sm mb-2">{offer.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{offer.startDate} → {offer.endDate}</span>
                                <span className="text-green-600 font-medium">
                                  €{offer.discountedPrice}/night ({offer.discountPercentage}% off)
                                </span>
                                <span className="text-gray-400 line-through">
                                  €{offer.originalPrice}/night
                                </span>
                                <span className="text-blue-600 font-medium">
                                  {offer.language === 'en' && '🇬🇧 English'}
                                  {offer.language === 'es' && '🇪🇸 Spanish'}
                                  {offer.language === 'fr' && '🇫🇷 French'}
                                  {offer.language === 'nl' && '🇳🇱 Dutch'}
                                  {offer.language === 'de' && '🇩🇪 German'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm mt-1">
                                <span className="text-blue-600 font-medium">
                                  Valid until: {new Date(offer.validUntil) < new Date() ? 
                                    <span className="text-red-600 font-medium">Expired</span> : 
                                    new Date(offer.validUntil).toLocaleDateString('en-GB', { 
                                      day: '2-digit', 
                                      month: '2-digit', 
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    }) + ' CET'
                                  }
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(`${window.location.origin}/promotional-offer/${offer.id}`)}
                                className="flex items-center gap-1"
                              >
                                <Copy className="w-3 h-3" />
                                Copy Link
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/promotional-offer/${offer.id}`, '_blank')}
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Preview
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/social-media/${offer.id}`, '_blank')}
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Social Media
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditOffer(offer)}
                                className="flex items-center gap-1"
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteOffer(offer.id)}
                                className="flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Create/Edit offer form */}
                  {showOfferForm && (
                    <Card>
                      <CardHeader className="relative">
                        <CardTitle>{editingOffer ? 'Edit' : 'Create New'} Promotional Offer</CardTitle>
                        {/* Language selector in upper right corner */}
                        <div className="absolute top-4 right-4">
                          <Select 
                            value={offerForm.watch('language')} 
                            onValueChange={(value) => {
                              offerForm.setValue('language', value);
                              setSelectedLanguage(value);
                            }}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">🇬🇧 English</SelectItem>
                              <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                              <SelectItem value="fr">🇫🇷 French</SelectItem>
                              <SelectItem value="nl">🇳🇱 Dutch</SelectItem>
                              <SelectItem value="de">🇩🇪 German</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Form {...offerForm}>
                          <form onSubmit={offerForm.handleSubmit(editingOffer ? handleEditOfferSubmit : handleCreateOffer)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormItem className="col-span-2">
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input
                                    {...offerForm.register('title')}
                                    placeholder="e.g., Summer Special Week"
                                  />
                                </FormControl>
                                <FormMessage />
                                {/* Title suggestions */}
                                <div className="mt-2">
                                  <p className="text-sm text-gray-600 mb-2">Suggested titles:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {getLanguageSuggestions(selectedLanguage).titles.map((suggestion, index) => (
                                      <Button
                                        key={index}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-auto p-2 text-xs"
                                        onClick={() => offerForm.setValue('title', suggestion)}
                                      >
                                        {suggestion}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </FormItem>
                              
                              <FormItem className="col-span-2">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input
                                    {...offerForm.register('description')}
                                    placeholder="e.g., Limited time offer - 20% off!"
                                  />
                                </FormControl>
                                <FormMessage />
                                {/* Description suggestions */}
                                <div className="mt-2">
                                  <p className="text-sm text-gray-600 mb-2">Suggested descriptions:</p>
                                  <div className="space-y-2">
                                    {getLanguageSuggestions(selectedLanguage).descriptions.map((suggestion, index) => (
                                      <Button
                                        key={index}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-auto p-2 text-xs w-full text-left justify-start"
                                        onClick={() => offerForm.setValue('description', suggestion)}
                                      >
                                        {suggestion}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </FormItem>

                              <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    {...offerForm.register('startDate', {
                                      onChange: (e) => {
                                        const startDate = new Date(e.target.value);
                                        
                                        // Calculate the same week end date (Saturday of the same week)
                                        const dayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
                                        const endOfWeek = new Date(startDate);
                                        endOfWeek.setDate(startDate.getDate() + (6 - dayOfWeek)); // Set to Saturday
                                        
                                        // Set the end date to the end of the same week
                                        const endOfWeekString = endOfWeek.toISOString().split('T')[0];
                                        offerForm.setValue('endDate', endOfWeekString);
                                      }
                                    })}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>

                              <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    {...offerForm.register('endDate')}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>

                              <FormItem>
                                <FormLabel>Original Price (€/night)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...offerForm.register('originalPrice', { 
                                      valueAsNumber: true,
                                      onChange: (e) => {
                                        const originalPrice = parseFloat(e.target.value);
                                        const percentage = offerForm.getValues('discountPercentage');
                                        if (originalPrice && percentage) {
                                          const discountedPrice = calculateDiscountedPrice(originalPrice, percentage);
                                          offerForm.setValue('discountedPrice', discountedPrice);
                                        }
                                      }
                                    })}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>

                              <FormItem>
                                <FormLabel>Discounted Price (€/night)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...offerForm.register('discountedPrice', { 
                                      valueAsNumber: true,
                                      onChange: (e) => {
                                        const discountedPrice = parseFloat(e.target.value);
                                        const originalPrice = offerForm.getValues('originalPrice');
                                        if (discountedPrice && originalPrice) {
                                          const percentage = calculatePercentage(originalPrice, discountedPrice);
                                          offerForm.setValue('discountPercentage', percentage);
                                        }
                                      }
                                    })}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>

                              <FormItem>
                                <FormLabel>Valid Until (Midnight)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    {...offerForm.register('validUntil')}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>

                              <FormItem>
                                <FormLabel>Discount Percentage (%)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...offerForm.register('discountPercentage', { 
                                      valueAsNumber: true,
                                      onChange: (e) => {
                                        const percentage = parseFloat(e.target.value);
                                        const originalPrice = offerForm.getValues('originalPrice');
                                        if (percentage && originalPrice) {
                                          const discountedPrice = calculateDiscountedPrice(originalPrice, percentage);
                                          offerForm.setValue('discountedPrice', discountedPrice);
                                        }
                                      }
                                    })}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setShowOfferForm(false);
                                  setEditingOffer(null);
                                  offerForm.reset();
                                }}
                              >
                                Cancel
                              </Button>
                              <Button 
                                type="submit" 
                                disabled={createOfferMutation.isPending}
                              >
                                {createOfferMutation.isPending ? 
                                  (editingOffer ? 'Updating...' : 'Creating...') : 
                                  (editingOffer ? 'Update Offer' : 'Create Offer')
                                }
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Daily Rates Management
                </CardTitle>
                <CardDescription>
                  Set custom rates for specific date ranges. Rates sync manually to match your Airbnb pricing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Note:</strong> Airbnb doesn't provide pricing via iCal sync. Use this tool to manually set rates to match your Airbnb calendar. Dates without custom rates will use seasonal pricing (€130-€210).
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        data-testid="input-pricing-start-date"
                        id="pricing-start-date"
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        data-testid="input-pricing-end-date"
                        id="pricing-end-date"
                      />
                    </div>
                    <div>
                      <Label>Rate (€/night)</Label>
                      <Input
                        type="number"
                        placeholder="195"
                        data-testid="input-pricing-rate"
                        id="pricing-rate"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      data-testid="button-set-rates"
                      onClick={() => {
                        const startDate = (document.getElementById('pricing-start-date') as HTMLInputElement).value;
                        const endDate = (document.getElementById('pricing-end-date') as HTMLInputElement).value;
                        const rate = (document.getElementById('pricing-rate') as HTMLInputElement).value;

                        if (!startDate || !endDate || !rate) {
                          toast({ title: "Please fill in all fields", variant: "destructive" });
                          return;
                        }

                        const rateNum = parseInt(rate);
                        if (isNaN(rateNum) || rateNum < 1) {
                          toast({ title: "Please enter a valid rate", variant: "destructive" });
                          return;
                        }

                        const start = new Date(startDate);
                        const end = new Date(endDate);
                        const rates = [];
                        
                        const current = new Date(start);
                        while (current <= end) {
                          rates.push({
                            date: current.toISOString().split('T')[0],
                            rate: rateNum
                          });
                          current.setDate(current.getDate() + 1);
                        }

                        apiRequest('/api/daily-rates/bulk', 'POST', { rates })
                          .then(() => {
                            toast({ title: `Set rates for ${rates.length} dates successfully` });
                            queryClient.invalidateQueries({ queryKey: ['pricing'] });
                            (document.getElementById('pricing-start-date') as HTMLInputElement).value = '';
                            (document.getElementById('pricing-end-date') as HTMLInputElement).value = '';
                            (document.getElementById('pricing-rate') as HTMLInputElement).value = '';
                          })
                          .catch(error => {
                            toast({ title: "Failed to set rates", description: error.message, variant: "destructive" });
                          });
                      }}
                    >
                      Set Rates
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Current Seasonal Rates (Fallback)</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• High Season (Jun-Sep): €210/night</p>
                      <p>• Mid Season (Apr, May, Oct): €160/night</p>
                      <p>• Low Season (Nov-Mar): €130/night</p>
                      <p>• Long-term (35+ days): €100/night</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Property Settings</CardTitle>
                <CardDescription>
                  Configure your property details and booking preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Quick Setup Guide</h4>
                    <ol className="text-sm text-blue-800 space-y-1">
                      <li>1. Go to Calendar Sync tab</li>
                      <li>2. Enter your Airbnb iCal URL</li>
                      <li>3. Click "Sync" to import blocked dates</li>
                      <li>4. Your website will automatically show availability</li>
                    </ol>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Email Configuration</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Booking inquiries are automatically sent to: admin@javeabliss.com
                    </p>
                    <p className="text-sm text-gray-500">
                      EmailJS service is configured and working properly.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Website Features</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✅ Multilingual support (English, Dutch, French, Spanish)</li>
                      <li>✅ Real-time availability checking</li>
                      <li>✅ Airbnb calendar synchronization</li>
                      <li>✅ Automated email notifications</li>
                      <li>✅ Mobile-responsive design</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;