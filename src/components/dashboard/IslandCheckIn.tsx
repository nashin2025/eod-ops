"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, CheckCircle, CaretDown, CaretUp, Users, Package, Wrench, MagnifyingGlass, Clock, Calendar, MapPin as MapPinIcon, Clock as ClockIcon } from "@phosphor-icons/react";
import { format } from "date-fns";

interface Island {
  id: string;
  name: string;
  atoll: string;
  hasVisited: boolean;
  lastVisited?: string;
  participantCount?: number;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  condition: string;
  quantity: number;
  description?: string;
  atoll: string;
  island?: string;
  status?: string;
}

interface IslandVisit {
  id: string;
  visitedAt?: string;
  equipmentUsed?: string[];
  islandId?: string;
  userId?: string;
  visitType?: string;
  island_visit_equipment?: Array<{
    equipment_id: string;
    equipment?: { name: string };
  }>;
}

interface IslandCheckInProps {
  className?: string;
}

export function IslandCheckIn({ className }: IslandCheckInProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEquipmentDialog, setShowEquipmentDialog] = useState(false);
  const [selectedIslandForCheckIn, setSelectedIslandForCheckIn] = useState<Island | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Set<string>>(new Set());
  const [selectedAtoll, setSelectedAtoll] = useState<string>("");
  const [selectedIslandId, setSelectedIslandId] = useState<string>("");
  const [showVisitHistory, setShowVisitHistory] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch islands data
  const { data: islands = [], isLoading: isLoadingIslands } = useQuery<Island[]>({
    queryKey: ["/api/islands"],
  });

  // Fetch equipment data - only available equipment with quantity > 0
  const { data: equipment = [], isLoading: isLoadingEquipment } = useQuery<Equipment[]>({
    queryKey: ["/api/equipment"],
    select: (data) => data.filter((eq: any) => eq.status === "available" && eq.quantity > 0),
  });

  // Fetch visit history for selected island
  const { data: visitHistory = [], isLoading: isLoadingHistory } = useQuery<Array<IslandVisit & { equipmentUsed: string[] }>>({
    queryKey: ["/api/island-visits", selectedIslandId],
    queryFn: async () => {
      if (!selectedIslandId) return [];
      const response = await fetch(`/api/island-visits?islandId=${selectedIslandId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch visit history');
      }
      return response.json();
    },
    enabled: !!selectedIslandId,
  });

  // Check-in mutation
  const checkInMutation = useMutation({
    mutationFn: async ({ islandId, equipmentIds }: { islandId: string; equipmentIds: string[] }) => {
      const response = await apiRequest('POST', `/api/islands/${islandId}/check-in`, { equipmentIds });
      return response.json();
    },
    onSuccess: (result: any) => {
      // Invalidate islands cache
      queryClient.invalidateQueries({ queryKey: ['/api/islands'] });
      
      // Invalidate ALL equipment queries (including those with query params)
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && queryKey[0] === '/api/equipment';
        }
      });
      
      // Invalidate milestone caches so badges update immediately
      queryClient.invalidateQueries({ queryKey: ['/api/milestones'] });
      queryClient.invalidateQueries({ queryKey: ['/api/milestones/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/milestones/history'] });
      
      // Invalidate visit history for this island
      queryClient.invalidateQueries({ queryKey: ['/api/island-visits', selectedIslandForCheckIn?.id] });
      
      toast({
        title: "Check-in Successful! 🏝️",
        description: result.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Check-in Failed",
        description: error?.message || "Failed to check in to island",
        variant: "destructive",
      });
    },
  });

  const handleCheckIn = (island: Island) => {
    setSelectedIslandForCheckIn(island);
    setSelectedEquipment(new Set());
    
    // If user can't check in with equipment (attachment role), proceed directly without equipment selection
    // In our case, we'll show the dialog for all users
    setShowEquipmentDialog(true);
  };

  const handleConfirmCheckIn = () => {
    if (!selectedIslandForCheckIn) return;

    const equipmentIds = Array.from(selectedEquipment);
    checkInMutation.mutate(
      { 
        islandId: selectedIslandForCheckIn.id, 
        equipmentIds 
      }
    );

    setShowEquipmentDialog(false);
    setSelectedIslandForCheckIn(null);
    setSelectedEquipment(new Set());
  };

  const handleCancelCheckIn = () => {
    setShowEquipmentDialog(false);
    setSelectedIslandForCheckIn(null);
    setSelectedEquipment(new Set());
  };

  const toggleEquipmentSelection = (equipmentId: string) => {
    const newSelection = new Set(selectedEquipment);
    if (newSelection.has(equipmentId)) {
      newSelection.delete(equipmentId);
    } else {
      newSelection.add(equipmentId);
    }
    setSelectedEquipment(newSelection);
  };

  // Get unique atolls for dropdown
  const uniqueAtolls = Array.from(new Set(islands.map(island => island.atoll))).sort();
  
  // Get islands for selected atoll
  const islandsInSelectedAtoll = selectedAtoll
    ? islands.filter(island => island.atoll === selectedAtoll).sort((a, b) => a.name.localeCompare(b.name))
    : [];

  // Get selected island object
  const selectedIsland = selectedIslandId
    ? islands.find(island => island.id === selectedIslandId)
    : null;

  // Handle atoll selection
  const handleAtollChange = (atoll: string) => {
    setSelectedAtoll(atoll);
    setSelectedIslandId(""); // Clear island selection when atoll changes
  };

  // Handle island selection and trigger check-in
  const handleIslandSelect = (islandId: string) => {
    setSelectedIslandId(islandId);
    const island = islands.find(i => i.id === islandId);
    if (island) {
      handleCheckIn(island);
    }
  };

  // Group equipment by atoll and island for better organization
  const groupEquipmentByLocation = (equipmentList: Equipment[]) => {
    const grouped = equipmentList.reduce((acc, eq) => {
      const key = eq.island ? `${eq.atoll} - ${eq.island}` : eq.atoll;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(eq);
      return acc;
    }, {} as Record<string, Equipment[]>);
    
    // Sort locations alphabetically
    return Object.keys(grouped)
      .sort()
      .map(location => ({
        location,
        equipment: grouped[location]
      }));
  };

  const equipmentByLocation = groupEquipmentByLocation(equipment);

  if (isLoadingIslands) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" style={{ color: "var(--accent)" }} />
            Island Check-in
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1"
          >
            {isExpanded ? <CaretUp className="h-4 w-4" /> : <CaretDown className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex items-center gap-4 text-sm" style={{ color: "var(--text-tertiary)" }}>
          <div className="flex items-center gap-1">
            <MapPinIcon className="h-4 w-4" style={{ color: "var(--accent)" }} />
            <span>{uniqueAtolls.length} atolls</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" style={{ color: "var(--success)" }} />
            <span>{islands.length} islands</span>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          {/* Dropdown Selection Interface */}
          <div className="space-y-4">
            {/* Atoll Selection */}
            <div className="space-y-2">
              <label htmlFor="atoll-select" className="label">
                Select Atoll
              </label>
              <Select value={selectedAtoll} onValueChange={handleAtollChange}>
                <SelectTrigger id="atoll-select">
                  <SelectValue placeholder="Choose an atoll..." />
                </SelectTrigger>
                <SelectContent>
                  {uniqueAtolls.map((atoll) => (
                    <SelectItem key={atoll} value={atoll}>
                      {atoll.replace(/ atoll$/i, '')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Island Selection */}
            <div className="space-y-2">
              <label htmlFor="island-select" className="label">
                Select Island
              </label>
              <Select
                value={selectedIslandId}
                onValueChange={handleIslandSelect}
                disabled={!selectedAtoll}
              >
                <SelectTrigger id="island-select">
                  <SelectValue placeholder={selectedAtoll ? "Choose an island..." : "Select an atoll first"} />
                </SelectTrigger>
                <SelectContent>
                  {islandsInSelectedAtoll.map((island) => (
                    <SelectItem key={island.id} value={island.id}>
                      {island.name}
                      {island.hasVisited && (
                        <span className="ml-2 text-xs" style={{ color: "var(--success)" }}>
                          ✓ Visited
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Instructions */}
            <div className="p-3 rounded-lg" style={{ background: "var(--hover-bg)" }}>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                <strong>Instructions:</strong> Select an atoll first, then choose an island to check in.
                Islands can be checked into multiple times for repeat visits.
              </p>
            </div>

            {/* Selected Island Info */}
            {selectedIsland && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg border" style={{ background: "var(--card-bg)", borderColor: "var(--border-subtle)" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{selectedIsland.name}</div>
                      <div className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                        {selectedIsland.atoll}
                        {selectedIsland.lastVisited && (
                          <span className="ml-2">
                            • Last visited: {new Date(selectedIsland.lastVisited).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedIsland.hasVisited && (
                      <Badge variant="success" className="gap-1" style={{ background: "var(--success-soft)", color: "var(--success)" }}>
                        <CheckCircle className="h-3 w-3" />
                        Visited Before
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Visit History Section */}
                {selectedIsland.hasVisited && visitHistory.length > 0 && (
                  <div className="rounded-lg border" style={{ background: "var(--card-bg)", borderColor: "var(--border-subtle)" }}>
                    <Collapsible open={showVisitHistory} onOpenChange={setShowVisitHistory}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full p-3 h-auto justify-between text-left hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" style={{ color: "var(--accent)" }} />
                            <span className="font-medium">Visit History</span>
                            <Badge variant="default" className="ml-1">
                              {visitHistory.length} {visitHistory.length === 1 ? 'visit' : 'visits'}
                            </Badge>
                          </div>
                          {showVisitHistory ? <CaretUp className="h-4 w-4" /> : <CaretDown className="h-4 w-4" />}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-3 pb-3">
                        <Separator className="mb-3" />
                        {isLoadingHistory ? (
                          <div className="text-center py-4">
                            <div className="animate-pulse">
                              <div className="h-4 bg-muted rounded mb-2"></div>
                              <div className="h-4 bg-muted rounded mb-2"></div>
                            </div>
                          </div>
                        ) : (
                          <ScrollArea className="max-h-48">
                            <div className="space-y-3">
                              {visitHistory.map((visit) => (
                                <div key={visit.id} className="p-3 rounded-lg" style={{ background: "var(--hover-bg)" }}>
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Calendar className="h-3 w-3" style={{ color: "var(--text-tertiary)" }} />
                                        <span className="text-sm font-medium">
                                          {visit.visitedAt ? format(new Date(visit.visitedAt), 'MMM dd, yyyy') : 'Unknown date'}
                                        </span>
                                        <Clock className="h-3 w-3 ml-2" style={{ color: "var(--text-tertiary)" }} />
                                        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                                          {visit.visitedAt ? format(new Date(visit.visitedAt), 'h:mm a') : 'Unknown time'}
                                        </span>
                                      </div>
                                      {visit.equipmentUsed && visit.equipmentUsed.length > 0 && (
                                        <div className="mt-2">
                                          <div className="text-xs mb-1" style={{ color: "var(--text-tertiary)" }}>Equipment brought:</div>
                                          <div className="flex flex-wrap gap-1">
                                            {visit.equipmentUsed.map((eq, index) => (
                                              <Badge key={index} variant="default" className="text-xs gap-1">
                                                <Package className="h-2 w-2" />
                                                {eq}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )}
              </div>
            )}

            {islands.length === 0 && (
              <div className="text-center py-8" style={{ color: "var(--text-tertiary)" }}>
                <MapPinIcon className="h-8 w-8 mx-auto mb-2" style={{ opacity: 0.5 }} />
                <p className="text-sm">No islands available</p>
              </div>
            )}
          </div>
        </CardContent>
      )}

      {/* Equipment Selection Dialog */}
      <Dialog open={showEquipmentDialog} onOpenChange={setShowEquipmentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Select Equipment for Check-in
            </DialogTitle>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Choose which equipment you're bringing to {selectedIslandForCheckIn?.name}.
              You can select multiple items or proceed without equipment.
            </p>
          </DialogHeader>

          <div className="py-4">
            <ScrollArea className="h-72">
              <div className="space-y-3">
                {equipment.length === 0 || isLoadingEquipment ? (
                  <div className="text-center py-8" style={{ color: "var(--text-tertiary)" }}>
                    <Wrench className="h-8 w-8 mx-auto mb-2" style={{ opacity: 0.5 }} />
                    <p className="text-sm">{isLoadingEquipment ? "Loading equipment..." : "No equipment available"}</p>
                  </div>
                ) : (
                  equipmentByLocation.map((locationGroup) => (
                    <div key={locationGroup.location} className="space-y-2">
                      <div className="text-xs font-medium uppercase tracking-wide px-2" style={{ color: "var(--text-tertiary)" }}>
                        {locationGroup.location}
                      </div>
                      <div className="space-y-2 pl-2">
                        {locationGroup.equipment.map((eq: Equipment) => (
                          <div key={eq.id} className="flex items-center space-x-3 p-2 rounded-lg border hover:bg-muted/50" style={{ borderColor: "var(--border-subtle)" }}>
                            <Checkbox
                              id={eq.id}
                              checked={selectedEquipment.has(eq.id)}
                              onCheckedChange={() => toggleEquipmentSelection(eq.id)}
                            />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{eq.name}</div>
                              <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                                {eq.type} • {eq.condition} • Qty: {eq.quantity}
                              </div>
                              {eq.description && (
                                <div className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                                  {eq.description}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={handleCancelCheckIn} disabled={checkInMutation.isPending}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedEquipment(new Set());
                  handleConfirmCheckIn();
                }}
                disabled={checkInMutation.isPending}
              >
                Check In Without Equipment
              </Button>
              <Button onClick={handleConfirmCheckIn} disabled={checkInMutation.isPending}>
                {checkInMutation.isPending ? "Checking In..." : `${selectedEquipment.size > 0 ? `Check In (${selectedEquipment.size} items)` : "Check In"}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}