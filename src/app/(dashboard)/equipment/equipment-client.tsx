"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package, Plus, Search, Edit2, Trash2 } from "lucide-react";
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

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Equipment</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">Manage equipment inventory across the Maldives</p>
        </div>
        <Button onClick={() => { setEditingEquipment(null); setShowForm(true); }} className="mt-4 sm:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6">
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl sm:text-2xl font-bold">{total}</p>
              </div>
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-xl sm:text-2xl font-bold">{available}</p>
              </div>
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Use</p>
                <p className="text-xl sm:text-2xl font-bold">{inUse}</p>
              </div>
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Damaged</p>
                <p className="text-xl sm:text-2xl font-bold">{damaged}</p>
              </div>
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedAtoll} onValueChange={setSelectedAtoll}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Atolls" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Atolls</SelectItem>
            {atolls.map(atoll => (
              <SelectItem key={atoll} value={atoll}>{atoll}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredEquipment.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No equipment found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredEquipment.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.type} - {item.atoll} {item.island ? `- ${item.island}` : ""}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm">Qty: {item.quantity}</span>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          item.status === "available"
                            ? "bg-green-100 text-green-800"
                            : item.status === "in-use"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.status === "damaged"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status}
                      </span>
                      {item.condition && (
                        <span className="text-xs text-muted-foreground">
                          Condition: {item.condition}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setEditingEquipment(item); setShowForm(true); }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
