import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: body.title,
          done: false,
          created_at: new Date(),
        },
      ])
      .select();

    if (error) {
      console.error("❌ Supabase Error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, id: data[0].id });
  } catch (error) {
    console.error("❌ API Error:", error);
    return Response.json({ error: "Insert error" }, { status: 500 });
  }
}
