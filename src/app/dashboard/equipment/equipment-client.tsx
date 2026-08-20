"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package, Plus, Search, Edit2, Trash2, Filter } from "lucide-react";
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

// Layout constants matching the 8-point spacing scale
const LAYOUT = {
  pagePadding: 24,           // --space-6
  cardPadding: 24,           // --space-6
  kpiCardPadding: 20,        // --space-5
  sectionGap: 32,            // --space-7
  cardRowGap: 20,            // --space-5
  controlHeight: 44,         // tap-friendly
  iconSize: 20,              // 20px icons
  iconGap: 8,                // icon-text gap in buttons
  buttonPaddingH: 16,        // 16px horizontal
  buttonPaddingV: 10,        // 10px vertical
} as const;

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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "available":
        return "bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))] dark:bg-[hsl(var(--accent)/0.2)] dark:text-[hsl(var(--accent))]";
      case "in-use":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "damaged":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const kpiItems = [
    { label: "Total", value: total, icon: <Package className="h-5 w-5" />, color: "hsl(var(--accent))" },
    { label: "Available", value: available, icon: <Package className="h-5 w-5" />, color: "#10B981" },
    { label: "In Use", value: inUse, icon: <Package className="h-5 w-5" />, color: "#F59E0B" },
    { label: "Damaged", value: damaged, icon: <Package className="h-5 w-5" />, color: "#EF4444" },
  ];

  return (
    <div className="p-space-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-space-7">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">Equipment</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">Manage equipment inventory across the Maldives</p>
        </div>
        <Button
          onClick={() => { setEditingEquipment(null); setShowForm(true); }}
          className="btn-neo-accent dark:btn-mono-primary w-full sm:w-auto"
          style={{ height: 48, paddingLeft: LAYOUT.buttonPaddingH, paddingRight: LAYOUT.buttonPaddingH }}
        >
          <Plus className="h-4 w-4 mr-2" style={{ transform: "translateY(1px)" }} />
          Add Equipment
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-5 mb-space-7 items-stretch">
        {kpiItems.map((kpi, index) => (
          <Card key={kpi.label} className="card-neo dark:card-mono" style={{ padding: LAYOUT.kpiCardPadding, animationDelay: `${index * 80}ms` }}>
            <div className="flex items-start justify-between h-full">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                  <span 
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${kpi.color}15`, color: kpi.color }}
                  >
                    {kpi.icon}
                  </span>
                  <span className="font-medium uppercase tracking-wider">{kpi.label}</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums leading-tight">{kpi.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-space-7">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full text-sm"
            style={{ height: LAYOUT.controlHeight }}
          />
        </div>
        <div className="relative flex-1 min-w-[180px] max-w-[220px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <select
            value={selectedAtoll}
            onChange={(e) => setSelectedAtoll(e.target.value)}
            className="input-neo dark:input-mono pl-10 w-full text-sm"
            style={{ height: LAYOUT.controlHeight }}
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
            className="input-neo dark:input-mono pl-10 w-full text-sm"
            style={{ height: LAYOUT.controlHeight }}
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="relative flex-1 min-w-[180px] max-w-[220px]">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-neo dark:input-mono pl-10 w-full text-sm"
            style={{ height: LAYOUT.controlHeight }}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="in-use">In Use</option>
            <option value="damaged">Damaged</option>
          </select>
        </div>
      </div>

      {/* Equipment List */}
      {filteredEquipment.length === 0 ? (
        <div className="card-neo dark:card-mono p-space-8 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No equipment found</p>
          <Button
            onClick={() => { setEditingEquipment(null); setShowForm(true); }}
            className="btn-neo-accent dark:btn-mono-primary mt-4"
            style={{ height: 48, paddingLeft: 24, paddingRight: 24 }}
          >
            <Plus className="h-4 w-4 mr-2" style={{ transform: "translateY(1px)" }} />
            Add Equipment
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEquipment.map((item) => (
            <div key={item.id} className="card-neo dark:card-mono" style={{ padding: LAYOUT.cardPadding }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.type} - {item.atoll} {item.island ? `- ${item.island}` : ""}
                  </p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-sm text-foreground tabular-nums">Qty: {item.quantity}</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(item.status)}`}>
                      {item.status}
                    </span>
                    {item.condition && (
                      <span className="text-xs text-muted-foreground">
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
                    className="rounded-xl btn-neo-secondary dark:btn-mono-secondary"
                    aria-label="Edit equipment"
                    style={{ height: 40, width: 40 }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
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