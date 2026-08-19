import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = `${user.id}/${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from("profiles")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage
      .from("profiles")
      .getPublicUrl(filePath);

    return new Response(JSON.stringify({ path: publicUrl }), { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: "Failed to upload file" }), { status: 500 });
  }
}
