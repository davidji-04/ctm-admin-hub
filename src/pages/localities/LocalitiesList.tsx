import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LocalitiesList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock routes that need localities (from "Fill Later" workflow)
  const routesNeedingLocalities = [
    {
      id: "route-1736943600000",
      title: "Caminho Francês",
      country: "Portugal",
      status: "draft",
      category: "premium",
      modality: "walking",
      createdDate: "2024-01-15",
    },
    {
      id: "route-1736943700000",
      title: "Via Algarviana",
      country: "Portugal",
      status: "draft",
      category: "free",
      modality: "bike",
      createdDate: "2024-01-14",
    },
  ];

  // Apply search filter
  const filteredRoutes = routesNeedingLocalities.filter((route) => {
    const matchesSearch = route.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "draft":
        return "bg-yellow-500";
      case "inactive":
        return "bg-muted";
      default:
        return "bg-muted";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "premium":
        return "bg-primary/10 text-primary border-primary/20";
      case "free":
        return "bg-accent/10 text-accent-foreground border-accent/20";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Localities Work Queue</h1>
          <p className="text-muted-foreground mt-1">
            Routes waiting for locality definitions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Routes Needing Localities</CardTitle>
          <CardDescription>
            These routes were created but need their localities defined before they can appear in the Routes module
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search routes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              Showing {filteredRoutes.length} route{filteredRoutes.length !== 1 ? 's' : ''}
            </div>

            {/* Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Modality</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoutes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <MapPin className="h-8 w-8" />
                          <p>No routes waiting for localities</p>
                          <p className="text-sm">All routes have localities defined!</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRoutes.map((route) => (
                      <TableRow key={route.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{route.title}</TableCell>
                        <TableCell>{route.country}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(route.status)}`} />
                            <span className="capitalize">{route.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getCategoryColor(route.category)}>
                            {route.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {route.modality}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {route.createdDate}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/routes/${route.id}/localities`)}
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            Add Localities
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalitiesList;
