import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotificationProvider } from "./contexts/NotificationContext";
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
import { TrainingManager } from "./pages/training/TrainingManager";
import AdminProfile from "./pages/AdminProfile";
import AnalyticsDashboard from "./pages/reports/AnalyticsDashboard";
import CreateEditArticle from "./components/blog/CreateEditArticle";
import BlogManager from "./components/blog/BlogManager";
import ModularPagesManager from "./pages/modular-pages/ModularPagesManager";
import ModularPageEditor from "./pages/modular-pages/ModularPageEditor";
import ModularPageView from "./pages/ModularPageView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
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
            <Route path="/training" element={<TrainingManager />} />
            <Route path="/weather" element={<WeatherAlerts />} />
            <Route path="/users" element={<UsersManager />} />
            <Route path="/users/:userId" element={<UserProfile />} />
            <Route path="/reviews" element={<Reviews/>} />
            <Route path="/reviews/:reviewId" element={<ReviewDetails />} />
            <Route path="/images" element={<ImageGallery />} />
            <Route path="/profile" element={<AdminProfile />} />
            <Route path="/reports" element={<AnalyticsDashboard />} />
            <Route path="/blog" element={<BlogManager />} />
            <Route path="/blog/admin/criar" element={<CreateEditArticle />} />
            <Route path="/blog/admin/editar/:id" element={<CreateEditArticle />} />
            <Route path="/modular-pages" element={<ModularPagesManager />} />
            <Route path="/modular-pages/new" element={<ModularPageEditor />} />
            <Route path="/modular-pages/:pageId/edit" element={<ModularPageEditor />} />
          </Route>
          <Route path="/pages/:slug" element={<ModularPageView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </NotificationProvider>
  </QueryClientProvider>
);

export default App;
