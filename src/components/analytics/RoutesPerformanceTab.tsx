import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Download, Filter, Star } from "lucide-react";
import { toast } from "sonner";
import {
  routesPerformanceData,
  difficultyOptions,
  regionOptions,
  RoutePerformance,
} from "@/data/analyticsMockData";

export const RoutesPerformanceTab = () => {
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");

  const filteredRoutes = useMemo(() => {
    return routesPerformanceData.filter((route) => {
      const matchesDifficulty =
        difficultyFilter === "all" || route.difficulty === difficultyFilter;
      const matchesRegion =
        regionFilter === "all" || route.region === regionFilter;
      return matchesDifficulty && matchesRegion;
    });
  }, [difficultyFilter, regionFilter]);

  const handleExport = () => {
    toast.success("Relatório de Percursos CSV descarregado com sucesso!");
    console.log("Relatório de Percursos CSV descarregado");
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
      medium: "bg-amber-500/10 text-amber-600 border-amber-200",
      hard: "bg-destructive/10 text-destructive border-destructive/20",
    };
    const labels: Record<string, string> = {
      easy: "Fácil",
      medium: "Média",
      hard: "Difícil",
    };
    return (
      <Badge variant="outline" className={colors[difficulty]}>
        {labels[difficulty]}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    if (category === "premium") {
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
          Premium
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        Free
      </Badge>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
        <span className="font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return "text-emerald-600";
    if (rate >= 60) return "text-amber-600";
    return "text-destructive";
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Dificuldade
              </label>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar dificuldade" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Região / País
              </label>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar região" />
                </SelectTrigger>
                <SelectContent>
                  {regionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleExport} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Métricas de Percursos
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredRoutes.length} resultados)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Percurso</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Dificuldade</TableHead>
                  <TableHead className="text-right">Total Acessos</TableHead>
                  <TableHead className="text-right">Roteiros Criados</TableHead>
                  <TableHead className="text-right">Taxa Conclusão</TableHead>
                  <TableHead className="text-right">Avaliação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoutes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum percurso encontrado com os filtros selecionados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoutes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell className="font-medium">{route.name}</TableCell>
                      <TableCell>{getCategoryBadge(route.category)}</TableCell>
                      <TableCell>{getDifficultyBadge(route.difficulty)}</TableCell>
                      <TableCell className="text-right">
                        {route.totalAccesses.toLocaleString("pt-PT")}
                      </TableCell>
                      <TableCell className="text-right">
                        {route.itinerariesCreated.toLocaleString("pt-PT")}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${getCompletionColor(route.completionRate)}`}>
                        {route.completionRate}%
                      </TableCell>
                      <TableCell className="text-right">
                        {renderStars(route.rating)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
