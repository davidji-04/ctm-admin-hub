import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Route,
  User,
  Crown,
  BookOpen,
  FileText,
} from "lucide-react";
import { z } from "zod";

// Search result types
interface SearchResult {
  id: string;
  type: "route" | "locality" | "user" | "premium-user" | "itinerary";
  title: string;
  subtitle?: string;
  route: string;
  badge?: string;
}

// Validation schema for search query
const searchQuerySchema = z.string().trim().max(100, { 
  message: "Search query must be less than 100 characters" 
});

// Mock data for all searchable entities
const mockSearchData: SearchResult[] = [
  // Routes
  { id: "r1", type: "route", title: "Caminho Português", subtitle: "Portugal · 245 km", route: "/routes/1", badge: "Active" },
  { id: "r2", type: "route", title: "Via Algarviana", subtitle: "Algarve · 187 km", route: "/routes/2", badge: "Draft" },
  { id: "r3", type: "route", title: "Rota Vicentina", subtitle: "Alentejo · 320 km", route: "/routes/3", badge: "Active" },
  { id: "r4", type: "route", title: "Serra da Estrela Trail", subtitle: "Centro · 156 km", route: "/routes/4", badge: "Active" },
  { id: "r5", type: "route", title: "Gerês Mountain Path", subtitle: "Norte · 98 km", route: "/routes/5", badge: "Active" },
  
  // Localities
  { id: "l1", type: "locality", title: "Porto", subtitle: "Caminho Português", route: "/routes/1/localities" },
  { id: "l2", type: "locality", title: "Ponte de Lima", subtitle: "Caminho Português", route: "/routes/1/localities" },
  { id: "l3", type: "locality", title: "Viana do Castelo", subtitle: "Coastal Route", route: "/routes/3/localities" },
  { id: "l4", type: "locality", title: "Tavira", subtitle: "Via Algarviana", route: "/routes/2/localities" },
  { id: "l5", type: "locality", title: "Odeceixe", subtitle: "Rota Vicentina", route: "/routes/3/localities" },
  { id: "l6", type: "locality", title: "Manteigas", subtitle: "Serra da Estrela Trail", route: "/routes/4/localities" },
  
  // Free Users
  { id: "u1", type: "user", title: "maria.santos@example.com", subtitle: "Free User · Active", route: "/users/2" },
  { id: "u2", type: "user", title: "ana.ferreira@example.com", subtitle: "Free User · Inactive", route: "/users/4" },
  { id: "u3", type: "user", title: "carlos.oliveira@example.com", subtitle: "Free User · Active", route: "/users/5" },
  
  // Premium Users
  { id: "pu1", type: "premium-user", title: "João Silva", subtitle: "joao.silva@example.com · Premium", route: "/users/1", badge: "Premium" },
  { id: "pu2", type: "premium-user", title: "Pedro Costa", subtitle: "pedro.costa@example.com · Premium", route: "/users/3", badge: "Premium" },
  
  // Itineraries
  { id: "i1", type: "itinerary", title: "IT-2024-001", subtitle: "3-Day Douro Valley Trip · João Silva", route: "/itineraries/1" },
  { id: "i2", type: "itinerary", title: "IT-2024-002", subtitle: "Complete Azores Tour · Pedro Costa", route: "/itineraries/2" },
  { id: "i3", type: "itinerary", title: "IT-2024-003", subtitle: "Porto Wine Route · João Silva", route: "/itineraries/3" },
];

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);

  // Filter results based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredResults([]);
      return;
    }

    // Validate search query
    try {
      searchQuerySchema.parse(searchQuery);
    } catch (error) {
      console.error("Invalid search query");
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const results = mockSearchData.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const subtitleMatch = item.subtitle?.toLowerCase().includes(query);
      return titleMatch || subtitleMatch;
    });

    // Limit results to 20 for performance
    setFilteredResults(results.slice(0, 20));
  }, [searchQuery]);

  const handleSelect = (route: string) => {
    onOpenChange(false);
    setSearchQuery("");
    navigate(route);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "route":
        return <Route className="h-4 w-4 text-primary" />;
      case "locality":
        return <MapPin className="h-4 w-4 text-chart-3" />;
      case "user":
        return <User className="h-4 w-4 text-muted-foreground" />;
      case "premium-user":
        return <Crown className="h-4 w-4 text-warning" />;
      case "itinerary":
        return <BookOpen className="h-4 w-4 text-chart-2" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case "route":
        return "Routes";
      case "locality":
        return "Localities";
      case "user":
        return "Free Users";
      case "premium-user":
        return "Premium Users";
      case "itinerary":
        return "Itineraries";
      default:
        return "Other";
    }
  };

  // Group results by type
  const groupedResults = filteredResults.reduce((acc, result) => {
    const category = result.type;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search routes, localities, users, itineraries..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>
          {searchQuery.trim() ? "No results found." : "Start typing to search..."}
        </CommandEmpty>

        {Object.entries(groupedResults).map(([type, results], index) => (
          <div key={type}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={getCategoryLabel(type)}>
              {results.map((result) => (
                <CommandItem
                  key={result.id}
                  value={`${result.title} ${result.subtitle || ""}`}
                  onSelect={() => handleSelect(result.route)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  {getIcon(result.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{result.title}</span>
                      {result.badge && (
                        <Badge 
                          variant={result.badge === "Premium" ? "default" : "secondary"} 
                          className="text-xs"
                        >
                          {result.badge}
                        </Badge>
                      )}
                    </div>
                    {result.subtitle && (
                      <p className="text-xs text-muted-foreground truncate">
                        {result.subtitle}
                      </p>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
