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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreVertical, Edit, Copy, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Routes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

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
    },
  ];

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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Routes</CardTitle>
              <CardDescription>Manage your complete route database</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search routes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
              {mockRoutes.map((route) => (
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
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Route
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Routes;
