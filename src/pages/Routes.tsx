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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, MoreVertical, Edit, Copy, Trash2, Eye, MapPin, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DuplicateRouteModal } from "@/components/routes/DuplicateRouteModal";
import { DeleteRouteModal } from "@/components/routes/DeleteRouteModal";
import RoutesMap from "@/components/routes/RoutesMap";

// Mock user role
const getUserRole = (): "admin" | "editor" => "admin";

const Routes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [modalityFilter, setModalityFilter] = useState<string>("all");
  const userRole = getUserRole();
  const [duplicateTarget, setDuplicateTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string; itineraries: number } | null>(null);

  const mockRoutes = [
    {
      id: 1,
      title: "Caminho Português",
      country: "Portugal",
      status: "active",
      category: "premium",
      distance: "245 km",
      localities: 12,
      modality: "walking",
      lastUpdated: "2024-01-15",
      startCoordinates: [41.1579, -8.6291] as [number, number],
    },
    {
      id: 2,
      title: "Via Algarviana",
      country: "Portugal",
      status: "draft",
      category: "free",
      distance: "187 km",
      localities: 8,
      modality: "bike",
      lastUpdated: "2024-01-14",
      startCoordinates: [37.2985, -7.9304] as [number, number],
    },
    {
      id: 3,
      title: "Rota Vicentina",
      country: "Portugal",
      status: "active",
      category: "premium",
      distance: "320 km",
      localities: 15,
      modality: "walking",
      lastUpdated: "2024-01-12",
      startCoordinates: [37.9577, -8.7853] as [number, number],
    },
    {
      id: 4,
      title: "Caminho de Santiago - Costa",
      country: "Portugal",
      status: "active",
      category: "free",
      distance: "280 km",
      localities: 18,
      modality: "walking",
      lastUpdated: "2024-01-10",
      startCoordinates: [41.6901, -8.8344] as [number, number],
    },
    {
      id: 5,
      title: "Grande Rota do Guadiana",
      country: "Portugal",
      status: "inactive",
      category: "free",
      distance: "65 km",
      localities: 6,
      modality: "bike",
      lastUpdated: "2023-12-20",
      startCoordinates: [37.1893, -7.4428] as [number, number],
    },
  ];

  // Apply filters
  const filteredRoutes = mockRoutes.filter((route) => {
    const matchesSearch = route.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || route.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || route.category === categoryFilter;
    const matchesModality = modalityFilter === "all" || route.modality === modalityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesModality;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "draft":
        return "secondary";
      case "inactive":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getCategoryColor = (category: string) => {
    return category === "premium" ? "default" : "secondary";
  };

  const handleRefresh = () => {
    // Reload routes list
    console.log('Refreshing routes list...');
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setModalityFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Routes Management</h1>
          <p className="text-muted-foreground">Create and manage hiking routes</p>
        </div>
        <Button onClick={() => navigate("/routes/create")} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Route
        </Button>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>Refine your route search</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search routes..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>

            {/* Modality Filter */}
            <Select value={modalityFilter} onValueChange={setModalityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Modality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modalities</SelectItem>
                <SelectItem value="walking">Walking</SelectItem>
                <SelectItem value="bike">Bike</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {(statusFilter !== "all" || categoryFilter !== "all" || modalityFilter !== "all" || searchQuery) && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary">Search: {searchQuery}</Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary">Status: {statusFilter}</Badge>
              )}
              {categoryFilter !== "all" && (
                <Badge variant="secondary">Category: {categoryFilter}</Badge>
              )}
              {modalityFilter !== "all" && (
                <Badge variant="secondary">Modality: {modalityFilter}</Badge>
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
              <CardTitle>Routes Overview</CardTitle>
              <CardDescription>
                {filteredRoutes.length} route{filteredRoutes.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="map">
                <Map className="w-4 h-4 mr-2" />
                Map View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route Name</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Localities</TableHead>
                    <TableHead>Modality</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoutes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No routes found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRoutes.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell className="font-medium">{route.title}</TableCell>
                        <TableCell>{route.country}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(route.status)}>{route.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getCategoryColor(route.category)}>{route.category}</Badge>
                        </TableCell>
                        <TableCell>{route.distance}</TableCell>
                        <TableCell>{route.localities}</TableCell>
                        <TableCell className="capitalize">{route.modality}</TableCell>
                        <TableCell>{route.lastUpdated}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/routes/${route.id}`)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/routes/${route.id}/edit`)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Route
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/routes/${route.id}/localities`)}>
                                <MapPin className="w-4 h-4 mr-2" />
                                Manage Localities
                              </DropdownMenuItem>
                              {userRole === 'admin' && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => setDuplicateTarget({ id: route.id.toString(), title: route.title })}
                                  >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() =>
                                      setDeleteTarget({
                                        id: route.id.toString(),
                                        title: route.title,
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
            </TabsContent>

            <TabsContent value="map">
              <RoutesMap
                routes={filteredRoutes}
                onRouteClick={(routeId) => navigate(`/routes/${routeId}`)}
                height="600px"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Duplicate Modal */}
      {duplicateTarget && (
        <DuplicateRouteModal
          open={!!duplicateTarget}
          onOpenChange={(open) => !open && setDuplicateTarget(null)}
          routeId={duplicateTarget.id}
          routeTitle={duplicateTarget.title}
          onSuccess={handleRefresh}
        />
      )}

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

export default Routes;
