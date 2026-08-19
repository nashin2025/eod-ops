import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request, { params }: { params: Promise<{ type: string[] }> }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const dataType = resolvedParams.type?.[0] || "events";

    const url = new URL(request.url);
    const format = url.searchParams.get("format") || "json";

    let tableName: string;
    switch (dataType) {
      case "events":
        tableName = "events";
        break;
      case "users":
        tableName = "users";
        break;
      case "islands":
        tableName = "islands";
        break;
      case "equipment":
        tableName = "equipment";
        break;
      default:
        tableName = "events";
    }

    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (format === "csv") {
      const csvContent = convertToCSV(data || []);
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${dataType}_export.csv"`,
        },
      });
    }

    return NextResponse.json({
      exportDate: new Date().toISOString(),
      total: data?.length || 0,
      data,
    });
  } catch (error) {
    console.error("Error exporting data:", error);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}

function convertToCSV(data: Record<string, unknown>[]): string {
  if (!data.length) return "";
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(",")];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value ?? "";
    });
    csvRows.push(values.join(","));
  }
  
  return csvRows.join("\n");
}
