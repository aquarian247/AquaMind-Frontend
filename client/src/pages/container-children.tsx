import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, Boxes, Eye, Layers, Settings } from "lucide-react";

import { ApiService } from "@/api/generated";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ContainerChildrenPageProps {
  params: { id: string };
}

export default function ContainerChildrenPage({ params }: ContainerChildrenPageProps) {
  const [, setLocation] = useLocation();
  const parentId = Number(params.id);

  const { data: parentContainer, isLoading: parentLoading } = useQuery({
    queryKey: ["container", parentId],
    queryFn: () => ApiService.apiV1InfrastructureContainersRetrieve(parentId),
    enabled: Number.isFinite(parentId),
  });

  const { data: childContainersData, isLoading: childrenLoading } = useQuery({
    queryKey: ["container-children", parentId],
    queryFn: async () => {
      const allChildren: any[] = [];
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage && page <= 20) {
        const response = await ApiService.apiV1InfrastructureContainersList(
          undefined, // active
          undefined, // area
          undefined, // areaIn
          undefined, // carrier
          undefined, // carrierCarrierType
          undefined, // carrierIn
          undefined, // containerType
          undefined, // containerTypeCategory
          undefined, // hall
          undefined, // hallIn
          undefined, // hierarchyRole
          undefined, // name
          undefined, // ordering
          page, // page
          parentId, // parentContainer
          undefined, // parentContainerIn
          undefined, // parentContainerIsnull
          undefined // search
        );

        allChildren.push(...(response.results || []));
        hasNextPage = !!response.next;
        page += 1;
      }

      return allChildren;
    },
    enabled: Number.isFinite(parentId),
  });

  const children = childContainersData || [];

  const backHref = useMemo(() => {
    if (!parentContainer) return "/infrastructure/containers";
    if (parentContainer.hall) return `/infrastructure/halls/${parentContainer.hall}`;
    if (parentContainer.area) return `/infrastructure/areas/${parentContainer.area}`;
    return "/infrastructure/containers";
  }, [parentContainer]);

  if (parentLoading || childrenLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="h-8 w-56 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
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

  if (!parentContainer) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="py-10 text-center">
            Parent container not found.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => setLocation(backHref)} className="flex items-center">
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <Layers className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">{parentContainer.name}</h1>
            <p className="text-muted-foreground">
              Child containers for structural parent container
            </p>
          </div>
        </div>
        <Badge className="bg-blue-100 text-blue-800 w-fit">
          {children.length} child containers
        </Badge>
      </div>

      {children.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Boxes className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">No child containers</h3>
            <p className="text-muted-foreground">
              This parent container currently has no linked child containers.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {children.map((container: any) => (
            <Card key={container.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{container.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {container.container_type_name}
                    </p>
                  </div>
                  <Badge className={container.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}>
                    {container.active ? "active" : "inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Role</span>
                    <div className="font-medium">{container.hierarchy_role || "HOLDING"}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Max Biomass</span>
                    <div className="font-medium">{container.max_biomass_kg} kg</div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setLocation(`/infrastructure/containers/${container.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
