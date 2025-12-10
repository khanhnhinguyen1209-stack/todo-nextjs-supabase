import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    console.log("🔍 Fetching tasks from Supabase...");
    const { data, error } = await supabase
      .from("tasks")
      .select("*");

    if (error) {
      console.error("❌ Supabase Error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ Tasks fetched successfully:", data);
    return Response.json(data);
  } catch (err) {
    console.error("❌ API Error:", err);
    return Response.json({ error: "API failed", details: err.message }, { status: 500 });
  }
}
