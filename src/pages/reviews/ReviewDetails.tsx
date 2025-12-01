import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Star, User, MapPin, Calendar, MessageSquare, Check, X, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface ReviewDetails {
  id: string;
  rating: number;
  routeName: string;
  routeId: string;
  userName: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  submissionDate: string;
  reviewText: string;
  adminResponse: string;
  moderatedBy?: string;
  moderatedAt?: string;
}

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < fullStars
              ? "fill-yellow-400 text-yellow-400"
              : i === fullStars && hasHalfStar
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-lg font-semibold ml-2">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export const ReviewDetails = () => {
  const { reviewId } = useParams<{ reviewId: string }>();
  const navigate = useNavigate();
  const [review, setReview] = useState<ReviewDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [adminResponse, setAdminResponse] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadReview();
  }, [reviewId]);

  const loadReview = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock data - adjust based on reviewId
      const mockReviews: ReviewDetails[] = [
      {
        id: '1',
        rating: 4.5,
        routeName: 'Caminho Português',
        routeId: 'route-123',
        userName: 'João Silva',
        userEmail: 'joao.silva@example.com',
        status: 'pending',
        submissionDate: '2024-01-15',
        reviewText: 'Excelente percurso! ...',
        adminResponse: '',
        moderatedBy: undefined,
        moderatedAt: undefined,
      },
      {
        id: '2',
        rating: 3.5,
        routeName: 'Porto',
        routeId: 'route-456',
        userName: 'Tomás Silva',
        userEmail: 'tomas.silva@example.com',
        status: 'approved',
        submissionDate: '2024-01-15',
        reviewText: 'Excelente percurso...',
        adminResponse: 'Obrigado pelo seu feedback!',
        moderatedBy: 'Admin User',
        moderatedAt: '2024-01-20',
      },
    ];
    const found = mockReviews.find(r => r.id === reviewId);
    setReview(found || null);
    setStatus(found ? found.status : 'pending');
    } catch (error) {
      console.error('Failed to load review:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveResponse = async () => {
    setIsSaving(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update local state
      if (review) {
        setReview({
          ...review,
          adminResponse: adminResponse,
        });
      }
    } catch (error) {
      console.error('Failed to save response:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this review?')) return;
    
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Approving review:', reviewId);
      
      if (review) {
        setReview({
          ...review,
          status: 'approved',
          moderatedBy: 'Admin User',
          moderatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  };

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this review?')) return;
    
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Rejecting review:', reviewId);
      
      if (review) {
        setReview({
          ...review,
          status: 'rejected',
          moderatedBy: 'Admin User',
          moderatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Failed to reject review:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading review details...</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Review not found</p>
        <Button variant="outline" onClick={() => navigate('/reviews')} className="mt-4">
          Back to Reviews
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/reviews')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Review Details</h1>
            <p className="text-muted-foreground">Review #{review.id}</p>
          </div>
        </div>
        <Badge variant={getStatusColor(review.status)} className="text-lg px-4 py-2">
          {review.status.toUpperCase()}
        </Badge>
      </div>

      {/* Pending Alert */}
      {review.status === 'pending' && (
        <Alert>
          <AlertDescription className="flex items-center justify-between">
            <span>This review is pending moderation. Please review and take action.</span>
            <div className="flex gap-2">
              <Button size="sm" variant="default" onClick={handleApprove}>
                <Check className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button size="sm" variant="destructive" onClick={handleReject}>
                <X className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - Review Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Review Content */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle>Review Content</CardTitle>
                  <StarRating rating={review.rating} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Review Text</Label>
                <p className="mt-2 text-base leading-relaxed">{review.reviewText}</p>
              </div>
            </CardContent>
          </Card>

          {/* Admin Response */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Official Admin Response
              </CardTitle>
              <CardDescription>
                This response will be publicly visible if the review is approved
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="adminResponse">Response</Label>
                <Textarea
                  id="adminResponse"
                  placeholder="Write your official response to this review..."
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  rows={6}
                  className="mt-2"
                />
              </div>
              <Button onClick={handleSaveResponse} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Response'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Metadata */}
        <div className="space-y-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium">{review.userName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="text-sm">{review.userEmail}</p>
              </div>
            </CardContent>
          </Card>

          {/* Route Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Route Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-muted-foreground">Route Name</Label>
                <p className="font-medium">{review.routeName}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate(`/routes/${review.routeId}`)}
              >
                View Route Details
              </Button>
            </CardContent>
          </Card>

          {/* Review Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Review Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-muted-foreground">Submission Date</Label>
                <p>{new Date(review.submissionDate).toLocaleDateString('pt-PT', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
              {review.moderatedBy && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground">Moderated By</Label>
                    <p>{review.moderatedBy}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Moderated At</Label>
                    <p>{review.moderatedAt ? new Date(review.moderatedAt).toLocaleDateString('pt-PT', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : '-'}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};