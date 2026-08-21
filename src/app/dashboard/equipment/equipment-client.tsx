"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus, Package, MagnifyingGlass, PencilSimple, Trash, FunnelSimple,
  Cube, ArrowClockwise
} from "@phosphor-icons/react";
import EquipmentForm from "@/components/equipment-form";

interface EquipmentItem {
  id: string;
  name: string;
  type: string;
  quantity: number;
  status: string;
  atoll: string;
  island?: string;
  description?: string;
  condition?: string;
}

interface Island {
  id: string;
  name: string;
  atoll: string;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "available":
      return { label: "Available", variant: "success" as const };
    case "in-use":
      return { label: "In Use", variant: "warning" as const };
    case "damaged":
      return { label: "Damaged", variant: "danger" as const };
    default:
      return { label: status, variant: "default" as const };
  }
};

export default function EquipmentClient({
  user,
  equipment,
  islands,
}: {
  user: { id: string };
  equipment: EquipmentItem[];
  islands: Island[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<EquipmentItem | null>(null);
  const [selectedAtoll, setSelectedAtoll] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredEquipment = equipment.filter((item) => {
    if (selectedAtoll !== "all" && item.atoll !== selectedAtoll) return false;
    if (filterType !== "all" && item.type !== filterType) return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.atoll.toLowerCase().includes(query) ||
        (item.island && item.island.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const atolls = Array.from(new Set(equipment.map(e => e.atoll)));
  const types = Array.from(new Set(equipment.map(e => e.type)));

  const total = equipment.length;
  const available = equipment.filter(e => e.status === "available").length;
  const inUse = equipment.filter(e => e.status === "in-use").length;
  const damaged = equipment.filter(e => e.status === "damaged").length;

  const kpiItems = [
    { label: "Total", value: total, icon: <Package className="h-5 w-5" />, color: "var(--accent)" },
    { label: "Available", value: available, icon: <Package className="h-5 w-5" />, color: "var(--success)" },
    { label: "In Use", value: inUse, icon: <Package className="h-5 w-5" />, color: "var(--warning)" },
    { label: "Damaged", value: damaged, icon: <Package className="h-5 w-5" />, color: "var(--danger)" },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: "var(--layout-page-padding) var(--layout-page-padding) 0" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-[var(--layout-section-gap)]">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Equipment</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Manage equipment inventory across the Maldives</p>
        </div>
        <Button
          onClick={() => { setEditingEquipment(null); setShowForm(true); }}
          size="lg"
          className="w-full sm:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" style={{ transform: "translateY(0.5px)" }} />
          Add Equipment
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--layout-card-gap)] mb-[var(--layout-section-gap)]">
        {kpiItems.map((kpi, index) => (
          <Card key={kpi.label} style={{ padding: "var(--layout-kpi-padding)", animationDelay: `${index * 80}ms` }}>
            <div className="flex items-start justify-between h-full">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 text-sm text-tertiary mb-2" style={{ color: "var(--text-tertiary)" }}>
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `color-mix(in srgb, ${kpi.color} 15%, transparent)`, color: kpi.color }}
                  >
                    {kpi.icon}
                  </span>
                  <span className="font-medium uppercase tracking-wider">{kpi.label}</span>
                </div>
                <p className="text-2xl font-bold tabular" style={{ color: "var(--text-primary)" }}>{kpi.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-[var(--layout-section-gap)]">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2" style={{ width: 18, height: 18, color: "var(--text-tertiary)" }} />
          <Input
            placeholder="Search equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11"
            style={{ height: "var(--layout-control-height)" }}
          />
        </div>
        <div className="relative flex-1 min-w-[180px] max-w-[220px]">
          <select
            value={selectedAtoll}
            onChange={(e) => setSelectedAtoll(e.target.value)}
            className="w-full pr-10"
            style={{ height: "var(--layout-control-height)", appearance: "none" }}
          >
            <option value="all">All Atolls</option>
            {atolls.map(atoll => (
              <option key={atoll} value={atoll}>{atoll}</option>
            ))}
          </select>
        </div>
        <div className="relative flex-1 min-w-[180px] max-w-[220px]">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full pr-10"
            style={{ height: "var(--layout-control-height)", appearance: "none" }}
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="relative flex-1 min-w-[180px] max-w-[220px]">
          <FunnelSimple className="absolute left-4 top-1/2 -translate-y-1/2" style={{ width: 18, height: 18, color: "var(--text-tertiary)" }} />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full pl-11" style={{ height: "var(--layout-control-height)" }}>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="in-use">In Use</SelectItem>
              <SelectItem value="damaged">Damaged</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Equipment List */}
      {filteredEquipment.length === 0 ? (
        <Card className="text-center" style={{ padding: "var(--space-8)" }}>
          <Package className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--text-tertiary)" }} />
          <p className="text-lg mb-4" style={{ color: "var(--text-tertiary)" }}>No equipment found</p>
          <Button size="lg" onClick={() => { setEditingEquipment(null); setShowForm(true); }}>
            <Plus className="h-5 w-5 mr-2" style={{ transform: "translateY(0.5px)" }} />
            Add Equipment
          </Button>
        </Card>
      ) : (
        <div className="space-y-4" style={{ gap: "var(--space-4)" }}>
          {filteredEquipment.map((item) => {
            const statusConfig = getStatusConfig(item.status);
            return (
              <Card key={item.id} style={{ padding: "var(--layout-card-padding)" }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate" style={{ color: "var(--text-primary)" }}>{item.name}</h3>
                    <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
                      {item.type} - {item.atoll} {item.island ? `- ${item.island}` : ""}
                    </p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-sm tabular" style={{ color: "var(--text-primary)" }}>Qty: {item.quantity}</span>
                      <Badge variant={statusConfig.variant} dot>{statusConfig.label}</Badge>
                      {item.condition && (
                        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                          Condition: {item.condition}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setEditingEquipment(item); setShowForm(true); }}
                      className="rounded-xl"
                      aria-label="Edit equipment"
                    >
                      <PencilSimple className="h-5 w-5" style={{ width: 20, height: 20 }} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingEquipment ? "Edit Equipment" : "Add Equipment"}</DialogTitle>
          </DialogHeader>
          <EquipmentForm
            equipment={editingEquipment}
            islands={islands}
            onClose={() => { setShowForm(false); setEditingEquipment(null); router.refresh(); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}