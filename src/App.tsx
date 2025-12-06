import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RoutesPage from "./pages/Routes";
import Reviews from "./pages/Reviews";
import { ReviewDetails }from "./pages/reviews/ReviewDetails";
import ComingSoon from "./pages/ComingSoon";
import { CreateRoute } from "./pages/routes/CreateRoute";
import { RouteDetails } from "./pages/routes/RouteDetails";
import { LocalitiesManager } from "./pages/localities/LocalitiesManager";
import LocalitiesList from "./pages/localities/LocalitiesList";
import ServicesList from "./pages/services/ServicesList";
import EquipmentList from "./pages/equipment/EquipmentList";
import ImageGallery from "./pages/images/ImageGallery";
import UsersManager from "./pages/users/UsersManager";
import UserProfile from "./pages/users/UserProfile";
import PremiumItinerariesList from "./pages/itineraries/PremiumItinerariesList";
import CreateItinerary from "./pages/itineraries/CreateItinerary";
import ManageItinerary from "./pages/itineraries/ManageItinerary";
import WeatherAlerts from "./pages/weather/WeatherAlerts";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/routes/create" element={<CreateRoute />} />
            <Route path="/routes/:routeId" element={<RouteDetails />} />
            <Route path="/routes/:routeId/edit" element={<CreateRoute />} />
            <Route path="/routes/:routeId/localities" element={<LocalitiesManager />} />
            <Route path="/localities" element={<LocalitiesList />} />
            <Route path="/services" element={<ServicesList />} />
            <Route path="/itineraries" element={<PremiumItinerariesList />} />
            <Route path="/itineraries/create" element={<CreateItinerary />} />
            <Route path="/itineraries/:id" element={<ManageItinerary />} />
            <Route path="/equipment" element={<EquipmentList />} />
            <Route path="/training" element={<ComingSoon title="Training Programs" description="Create training plans and exercise sessions" />} />
            <Route path="/weather" element={<WeatherAlerts />} />
            <Route path="/users" element={<UsersManager />} />
            <Route path="/users/:userId" element={<UserProfile />} />
            <Route path="/reviews" element={<Reviews/>} />
            <Route path="/reviews/:reviewId" element={<ReviewDetails />} />
            <Route path="/images" element={<ImageGallery />} />
            <Route path="/reports" element={<ComingSoon title="Reports & Analytics" description="Generate reports and view analytics" />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
