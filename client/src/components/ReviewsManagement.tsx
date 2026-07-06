import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Simple Badge component
const Badge = ({ children, variant = "default", className = "" }: { 
  children: React.ReactNode; 
  variant?: "default" | "secondary" | "outline" | "destructive"; 
  className?: string;
}) => {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  const variants = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 text-gray-600",
    destructive: "bg-red-100 text-red-800"
  };
  
  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Star, Edit, Trash2, Plus, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertGuestReviewSchema } from "@shared/schema";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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

const reviewFormSchema = insertGuestReviewSchema.extend({
  rating: z.number().min(1).max(5),
  reviewText: z.string().min(10, "Review must be at least 10 characters"),
});

const ReviewsManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<GuestReview | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all reviews
  const { data: reviews, isLoading } = useQuery<GuestReview[]>({
    queryKey: ["/api/reviews"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Form setup
  const form = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      guestName: "",
      country: "",
      stayDate: "",
      rating: 5,
      reviewText: "",
      language: "en",
      isVisible: true,
      isVerified: false,
    },
  });

  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: async (data: z.infer<typeof reviewFormSchema>) => {
      const response = await apiRequest("/api/reviews", "POST", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: "Success",
        description: "Review created successfully",
      });
      setShowForm(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create review",
        variant: "destructive",
      });
    },
  });

  // Update review mutation
  const updateReviewMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<z.infer<typeof reviewFormSchema>> }) => {
      const response = await apiRequest(`/api/reviews/${id}`, "PUT", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: "Success",
        description: "Review updated successfully",
      });
      setEditingReview(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update review",
        variant: "destructive",
      });
    },
  });

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/reviews/${id}`, "DELETE");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete review",
        variant: "destructive",
      });
    },
  });

  // Toggle visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, isVisible }: { id: number; isVisible: boolean }) => {
      const response = await apiRequest(`/api/reviews/${id}`, "PUT", { isVisible });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: "Success",
        description: "Review visibility updated",
      });
    },
  });

  // Toggle verified mutation
  const toggleVerifiedMutation = useMutation({
    mutationFn: async ({ id, isVerified }: { id: number; isVerified: boolean }) => {
      const response = await apiRequest(`/api/reviews/${id}`, "PUT", { isVerified });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: "Success",
        description: "Review verification updated",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof reviewFormSchema>) => {
    if (editingReview) {
      updateReviewMutation.mutate({ id: editingReview.id, data });
    } else {
      createReviewMutation.mutate(data);
    }
  };

  const handleEdit = (review: GuestReview) => {
    setEditingReview(review);
    form.reset({
      guestName: review.guestName,
      country: review.country || "",
      stayDate: review.stayDate || "",
      rating: review.rating,
      reviewText: review.reviewText,
      language: review.language,
      isVisible: review.isVisible,
      isVerified: review.isVerified,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingReview(null);
    form.reset();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const getLanguageFlag = (language: string) => {
    const flags = {
      en: "🇬🇧",
      es: "🇪🇸", 
      fr: "🇫🇷",
      nl: "🇳🇱",
      de: "🇩🇪"
    };
    return flags[language as keyof typeof flags] || "🌐";
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Guest Reviews ({reviews?.length || 0})</h3>
          <p className="text-sm text-gray-600">
            Manage guest testimonials and reviews for your website
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Review
        </Button>
      </div>

      {/* Review form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingReview ? "Edit Review" : "Add New Review"}
            </CardTitle>
            <CardDescription>
              {editingReview ? "Update the existing review" : "Add a new guest review or testimonial"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormItem>
                    <FormLabel>Guest Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...form.register("guestName")}
                        placeholder="Enter guest name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input
                        {...form.register("country")}
                        placeholder="e.g., United Kingdom, Spain"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel>Stay Date</FormLabel>
                    <FormControl>
                      <Input
                        {...form.register("stayDate")}
                        placeholder="e.g., August 2025, Summer 2025"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel>Rating *</FormLabel>
                    <FormControl>
                      <Select
                        value={form.watch("rating")?.toString()}
                        onValueChange={(value) => form.setValue("rating", parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">⭐⭐⭐⭐⭐ (5 stars)</SelectItem>
                          <SelectItem value="4">⭐⭐⭐⭐ (4 stars)</SelectItem>
                          <SelectItem value="3">⭐⭐⭐ (3 stars)</SelectItem>
                          <SelectItem value="2">⭐⭐ (2 stars)</SelectItem>
                          <SelectItem value="1">⭐ (1 star)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Select
                        value={form.watch("language")}
                        onValueChange={(value) => form.setValue("language", value)}
                      >
                        <SelectTrigger>
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <div className="flex items-center space-x-4">
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={form.watch("isVisible")}
                          onCheckedChange={(checked) => form.setValue("isVisible", checked === true)}
                        />
                      </FormControl>
                      <FormLabel>Visible on website</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={form.watch("isVerified")}
                          onCheckedChange={(checked) => form.setValue("isVerified", checked === true)}
                        />
                      </FormControl>
                      <FormLabel>Verified guest</FormLabel>
                    </FormItem>
                  </div>
                </div>

                <FormItem>
                  <FormLabel>Review Text *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...form.register("reviewText")}
                      placeholder="Enter the guest review or testimonial..."
                      rows={4}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={createReviewMutation.isPending || updateReviewMutation.isPending}
                  >
                    {editingReview ? "Update Review" : "Create Review"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Reviews list */}
      <div className="space-y-4">
        {!reviews || reviews.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-600">No reviews yet. Add your first guest review!</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className={!review.isVisible ? "opacity-60" : ""}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">{review.guestName}</h4>
                      {review.country && (
                        <Badge variant="secondary" className="text-xs">
                          {review.country}
                        </Badge>
                      )}
                      {review.stayDate && (
                        <Badge variant="outline" className="text-xs">
                          {review.stayDate}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {getLanguageFlag(review.language)} {review.language.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-600">({review.rating}/5)</span>
                      {review.isVerified && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-3">{review.reviewText}</p>
                    
                    <div className="text-xs text-gray-500">
                      Created: {new Date(review.createdAt).toLocaleDateString()} • 
                      Updated: {new Date(review.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVisibilityMutation.mutate({
                        id: review.id,
                        isVisible: !review.isVisible
                      })}
                      className="flex items-center gap-1"
                    >
                      {review.isVisible ? (
                        <>
                          <Eye className="w-4 h-4" />
                          Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Hidden
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVerifiedMutation.mutate({
                        id: review.id,
                        isVerified: !review.isVerified
                      })}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {review.isVerified ? "Verified" : "Verify"}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(review)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this review?")) {
                          deleteReviewMutation.mutate(review.id);
                        }
                      }}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsManagement;