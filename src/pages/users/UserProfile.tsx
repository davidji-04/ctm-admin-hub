import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  ArrowLeft,
  Crown,
  User as UserIcon,
  Mail,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Camera,
  Activity,
} from "lucide-react";
import { getUserById, User } from "@/data/mockUsers";
import { useState } from "react";

interface UserProfile {
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
  activityHistory: Array<{
    id: string;
    type: "route" | "itinerary" | "memory";
    title: string;
    date: string;
  }>;
}
const mockActivityHistory: Record<string, Array<{ id: string; type: "route" | "itinerary" | "memory"; title: string; date: string }>> = {
  "1": [
    { id: "1", type: "route", title: "Rota da Serra da Estrela", date: "2024-11-14" },
    { id: "2", type: "memory", title: "Sunset at Gerês", date: "2024-11-12" },
    { id: "3", type: "itinerary", title: "3-Day Douro Valley Trip", date: "2024-11-10" },
    { id: "4", type: "route", title: "Coastal Path Algarve", date: "2024-11-08" },
    { id: "5", type: "memory", title: "Mountain Peak View", date: "2024-11-05" },
  ],
  "2": [
    { id: "1", type: "route", title: "Sintra Historical Walk", date: "2024-11-13" },
    { id: "2", type: "memory", title: "Palace Garden", date: "2024-11-10" },
    { id: "3", type: "route", title: "Lisbon Riverside", date: "2024-11-05" },
  ],
  "3": [
    { id: "1", type: "route", title: "Caminho Português - Etapa 1", date: "2024-11-15" },
    { id: "2", type: "memory", title: "Chegada a Porto", date: "2024-11-13" },
  ],
  "4": [
    { id: "1", type: "itinerary", title: "Roteiro Algarve Premium", date: "2024-11-16" },
    { id: "2", type: "route", title: "Via Algarviana", date: "2024-11-10" },
  ],
  "5": [],
};

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);


  if (!user) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/users")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">User not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  const activityHistory = mockActivityHistory[user.id] ?? [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "route":
        return <MapPin className="h-4 w-4 text-primary" />;
      case "itinerary":
        return <BookOpen className="h-4 w-4 text-amber-500" />;
      case "memory":
        return <Camera className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate("/users")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Users
      </Button>

      {/* User Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  {user.type === "PREMIUM" && (
                    <Badge variant="default" className="gap-1">
                      <Crown className="h-3 w-3" />
                      Premium
                    </Badge>
                  )}
                  <Badge variant={user.status === "active" ? "default" : "secondary"}>
                    {user.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <Mail className="h-3 w-3" />
                  {user.email}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Sign-up Date
            </CardDescription>
            <CardTitle className="text-xl">
              {new Date(user.signupDate).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Last Access
            </CardDescription>
            <CardTitle className="text-xl">
              {new Date(user.lastAccess).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Routes Accessed
            </CardDescription>
            <CardTitle className="text-3xl">{user.routesAccessed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Camera className="h-4 w-4" />
              Memories
            </CardDescription>
            <CardTitle className="text-3xl">{user.memoriesRegistered}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity History</TabsTrigger>
          <TabsTrigger value="usage">Usage Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Summary</CardTitle>
              <CardDescription>Overview of user engagement and activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Routes Accessed</p>
                  <p className="text-2xl font-bold">{user.routesAccessed}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Itineraries Created</p>
                  <p className="text-2xl font-bold">{user.itinerariesCreated}</p>
                  {user.type === "FREE" && user.itinerariesCreated === 0 && (
                    <p className="text-xs text-muted-foreground">Requires Premium</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Memories Registered</p>
                  <p className="text-2xl font-bold">{user.memoriesRegistered}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Account Information</p>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Type:</span>
                    <span className="font-medium">{user.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium capitalize">{user.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member Since:</span>
                    <span className="font-medium">
                      {new Date(user.signupDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>User's latest interactions and contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityHistory.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActivityIcon(activity.type)}
                          <span className="capitalize text-sm">{activity.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{activity.title}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>Detailed breakdown of user engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Routes Accessed</span>
                    <span className="font-medium">{user.routesAccessed}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min((user.routesAccessed / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Itineraries Created</span>
                    <span className="font-medium">{user.itinerariesCreated}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${Math.min((user.itinerariesCreated / 20) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Memories Registered</span>
                    <span className="font-medium">{user.memoriesRegistered}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${Math.min((user.memoriesRegistered / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <Separator />

                <div className="rounded-lg border p-4 space-y-2">
                  <p className="font-medium">Engagement Level</p>
                  <Badge variant="default" className="text-sm">
                    {user.routesAccessed + user.itinerariesCreated + user.memoriesRegistered > 50
                      ? "High Activity"
                      : user.routesAccessed + user.itinerariesCreated + user.memoriesRegistered > 20
                      ? "Moderate Activity"
                      : "Low Activity"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
