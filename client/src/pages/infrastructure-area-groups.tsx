import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, Layers, MapPin, Search, Waves } from "lucide-react";

import { ApiService } from "@/api/generated";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function toSlug(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "-");
}

function parseGeographyQuery(search: string): string {
  const params = new URLSearchParams(search);
  return params.get("geography") || "all";
}

export default function InfrastructureAreaGroups() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const selectedGeographySlug = useMemo(
    () => parseGeographyQuery(window.location.search),
    [location]
  );

  const { data: geographiesData } = useQuery({
    queryKey: ["geographies"],
    queryFn: () => ApiService.apiV1InfrastructureGeographiesList(),
  });

  const selectedGeographyId = useMemo(() => {
    if (selectedGeographySlug === "all" || !geographiesData?.results) {
      return undefined;
    }
    const normalized = selectedGeographySlug.toLowerCase().replace(/-/g, " ");
    return geographiesData.results.find((g: any) =>
      g.name.toLowerCase().replace(/-/g, " ") === normalized
    )?.id;
  }, [selectedGeographySlug, geographiesData]);

  const { data: areaGroupsData, isLoading: groupsLoading } = useQuery({
    queryKey: ["infrastructure", "area-groups", selectedGeographyId],
    queryFn: async () => {
      const allGroups: any[] = [];
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage && page <= 20) {
        const response = await ApiService.apiV1InfrastructureAreaGroupsList(
          true, // active
          undefined, // code
          undefined, // codeIcontains
          selectedGeographyId, // geography
          undefined, // geographyIn
          undefined, // name
          undefined, // nameIcontains
          undefined, // ordering
          page, // page
          undefined, // parent
          undefined, // parentIn
          undefined, // parentIsnull
          undefined // search
        );

        allGroups.push(...(response.results || []));
        hasNextPage = !!response.next;
        page += 1;
      }

      return allGroups;
    },
  });

  const { data: areasData } = useQuery({
    queryKey: ["infrastructure", "areas-for-groups", selectedGeographyId],
    queryFn: async () => {
      const allAreas: any[] = [];
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage && page <= 20) {
        const response = await ApiService.apiV1InfrastructureAreasList(
          true, // active
          undefined, // areaGroup
          undefined, // areaGroupIn
          selectedGeographyId, // geography
          undefined, // geographyIn
          undefined, // name
          undefined, // nameIcontains
          undefined, // ordering
          page, // page
          undefined // search
        );

        allAreas.push(...(response.results || []));
        hasNextPage = !!response.next;
        page += 1;
      }

      return allAreas;
    },
  });

  const groups = areaGroupsData || [];
  const geographies = geographiesData?.results || [];

  const areaCountByGroup = useMemo(() => {
    const counts = new Map<number, number>();
    (areasData || []).forEach((area: any) => {
      const groupId = area.area_group;
      if (!groupId) return;
      counts.set(groupId, (counts.get(groupId) || 0) + 1);
    });
    return counts;
  }, [areasData]);

  const childCountByGroup = useMemo(() => {
    const counts = new Map<number, number>();
    groups.forEach((group: any) => {
      if (!group.parent) return;
      counts.set(group.parent, (counts.get(group.parent) || 0) + 1);
    });
    return counts;
  }, [groups]);

  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return groups;
    return groups.filter((group: any) => {
      const haystack = `${group.name} ${group.code || ""} ${group.parent_name || ""}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [groups, searchQuery]);

  const rootGroupsCount = groups.filter((g: any) => !g.parent).length;
  const groupsWithAreasCount = groups.filter((g: any) => (areaCountByGroup.get(g.id) || 0) > 0).length;

  if (groupsLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center space-x-2">
          <Layers className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold">Sea Area Groups</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => setLocation("/infrastructure")} className="flex items-center">
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Back to Infrastructure</span>
          </Button>
          <Layers className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Sea Area Groups</h1>
            <p className="text-muted-foreground">
              Geography → Area Groups → Areas → Containers
            </p>
          </div>
        </div>

        <Select
          value={selectedGeographySlug}
          onValueChange={(value) => {
            const params = new URLSearchParams();
            if (value !== "all") {
              params.set("geography", value);
            }
            const url = params.toString()
              ? `/infrastructure/area-groups?${params.toString()}`
              : "/infrastructure/area-groups";
            setLocation(url);
          }}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select Geography" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Geographies</SelectItem>
            {geographies.map((geo: any) => (
              <SelectItem key={geo.id} value={toSlug(geo.name)}>
                {geo.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Area Groups</CardTitle>
            <Layers className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{filteredGroups.length}</div>
            <p className="text-xs text-muted-foreground">Visible groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Root Groups</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{rootGroupsCount}</div>
            <p className="text-xs text-muted-foreground">Top-level nodes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Groups With Areas</CardTitle>
            <Waves className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{groupsWithAreasCount}</div>
            <p className="text-xs text-muted-foreground">Ready for drill-down</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Areas</CardTitle>
            <MapPin className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{(areasData || []).length}</div>
            <p className="text-xs text-muted-foreground">Within selected geography</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search area groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredGroups.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Layers className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">No area groups found</h3>
            <p className="text-muted-foreground">
              Try changing geography or search terms.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group: any) => {
            const areaCount = areaCountByGroup.get(group.id) || 0;
            const childCount = childCountByGroup.get(group.id) || 0;
            const params = new URLSearchParams();
            if (selectedGeographySlug !== "all") {
              params.set("geography", selectedGeographySlug);
            }
            params.set("areaGroup", String(group.id));
            params.set("areaGroupName", group.name);

            return (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {group.code ? `Code: ${group.code}` : "No code"}
                      </p>
                    </div>
                    <Badge className={group.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}>
                      {group.active ? "active" : "inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Areas</span>
                      <div className="font-semibold text-lg">{areaCount}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Child Groups</span>
                      <div className="font-semibold text-lg">{childCount}</div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Parent: {group.parent_name || "None"}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setLocation(`/infrastructure/areas?${params.toString()}`)}
                  >
                    <Waves className="h-4 w-4 mr-2" />
                    View Areas
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
