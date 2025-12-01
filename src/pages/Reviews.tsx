import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs } from "@/components/ui/tabs";
import { Search, MoreVertical, Trash2, Eye, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DeleteRouteModal } from "@/components/routes/DeleteRouteModal";

// Mock user role
const getUserRole = (): "admin" | "editor" => "admin";

const Reviews = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const userRole = getUserRole();
  const [duplicateTarget, setDuplicateTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string; itineraries: number } | null>(null);
  const handleApprove = (reviewId: number) => {
    console.log('Approving review:', reviewId);
    handleRefresh();
  };

  const handleReject = (reviewId: number) => {
    console.log('Rejecting review:', reviewId);
    handleRefresh();
  };

  // Mock routes - only routes that have localities defined
  // Routes without localities are in the Localities module work queue
  const mockReviews = [
    {
      id: 1,
      rating: 4.5, 
      routeName: "Caminho Português", 
      userName: "João Silva", 
      status: "pending", 
      submissionDate: "2024-01-15",
      reviewText: "Excelente percurso...", 
    },
    {
      id: 2,
      rating: 3.5, 
      routeName: "Porto", 
      userName: "Tomás Silva", 
      status: "approved", 
      submissionDate: "2024-01-15",
      reviewText: "Excelente percurso...", 
    },
  ];

  // Apply filters
  const filteredReviews = mockReviews.filter((review) => {
    const matchesSearch = review.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    const matchesRating = ratingFilter === "all" || (ratingFilter === "low" && review.rating < 3) || (ratingFilter === "high" && review.rating >= 3);
    return matchesSearch && matchesStatus && matchesRating ;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "outline";
      default:
        return "secondary";
    }
  };

  const handleRefresh = () => {
    // Reload reviews list
    console.log('Refreshing reviews list...');
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setRatingFilter("all");
    setSearchQuery("");
  };
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < fullStars
              ? "fill-yellow-400 text-yellow-400"
              : i === fullStars && hasHalfStar
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-sm text-muted-foreground ml-1">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reviews Management</h1>
          <p className="text-muted-foreground">Manage hiking reviews</p>
        </div>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>Refine your review search</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Rating Filter */}
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-red-400 text-red-400" />
                    Low (&lt; 3 stars)
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    High (≥ 3 stars)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {(statusFilter !== "all" || ratingFilter !== "all" || searchQuery) && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary">Search: {searchQuery}</Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary">Status: {statusFilter}</Badge>
              )}
              {ratingFilter !== "all" && (
                <Badge variant="secondary">Rating: {ratingFilter}</Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content with Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reviews Overview</CardTitle>
              <CardDescription>
                {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rating</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Review Text</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No reviews found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">
                        <StarRating rating={review.rating} />
                        </TableCell>  
                        <TableCell>{review.routeName}</TableCell>
                        <TableCell>{review.userName}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(review.status)}>{review.status}</Badge>
                        </TableCell>
                        <TableCell>{review.submissionDate}</TableCell>
                        <TableCell>{review.reviewText}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/reviews/${review.id}`)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {userRole === 'admin' && (
                                <>
                                  
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() =>
                                      setDeleteTarget({
                                        id: review.id.toString(),
                                        title: review.routeName,
                                        itineraries: 0,
                                      })
                                    }
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
          </Tabs>
        </CardContent>
      </Card>


      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteRouteModal
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          routeId={deleteTarget.id}
          routeTitle={deleteTarget.title}
          activeItineraries={deleteTarget.itineraries}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
};

export default Reviews;
