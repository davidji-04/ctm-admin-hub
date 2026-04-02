import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Crown, User, Calendar } from "lucide-react";
import { getUsers, User as UserType } from "@/data/mockUsers";

interface User {
  id: string;
  name: string;
  email: string;
  type: "FREE" | "PREMIUM";
  status: "active" | "inactive";
  signupDate: string;
  lastAccess: string;
  routesAccessed: number;
  itinerariesCreated: number;
  memoriesRegistered: number;
}
export default function UsersManager() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || user.type === typeFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;

    // Tab-based filtering
    if (activeTab === "active-free") return matchesSearch && user.type === "FREE" && user.status === "active";
    if (activeTab === "active-premium") return matchesSearch && user.type === "PREMIUM" && user.status === "active";
    if (activeTab === "inactive") return matchesSearch && user.status === "inactive";
    if (activeTab === "new") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return matchesSearch && new Date(user.signupDate) > thirtyDaysAgo;
    }

    return matchesSearch && matchesType && matchesStatus;
  });

    const stats = {
    total: users.length,
    premium: users.filter((u) => u.type === "PREMIUM").length,
    free: users.filter((u) => u.type === "FREE").length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage free and premium users, view activity, and monitor engagement
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Crown className="h-4 w-4 text-amber-500" />
              Premium
            </CardDescription>
            <CardTitle className="text-3xl">{stats.premium}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Free Users</CardDescription>
            <CardTitle className="text-3xl">{stats.free}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl">{stats.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Inactive (&gt;90d)</CardDescription>
            <CardTitle className="text-3xl">{stats.inactive}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>User Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="FREE">Free Users</SelectItem>
                <SelectItem value="PREMIUM">Premium Users</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Segmented Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="active-free">Active FREE</TabsTrigger>
          <TabsTrigger value="active-premium">Active PREMIUM</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="new">New Sign-ups</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "all" && "All Users"}
                {activeTab === "active-free" && "Active FREE Users"}
                {activeTab === "active-premium" && "Active PREMIUM Users"}
                {activeTab === "inactive" && "Inactive Users (&gt;90 days)"}
                {activeTab === "new" && "New Sign-ups (Last 30 days)"}
              </CardTitle>
              <CardDescription>
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sign-up Date</TableHead>
                    <TableHead>Last Access</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No users found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.type === "PREMIUM" ? (
                            <Badge variant="default" className="gap-1">
                              <Crown className="h-3 w-3" />
                              Premium
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Free</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {new Date(user.signupDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(user.lastAccess).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {user.routesAccessed} routes • {user.itinerariesCreated} itineraries
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewProfile(user.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
