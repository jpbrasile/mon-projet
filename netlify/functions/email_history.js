import { supabase } from "./supabaseClient.js";

export async function handler(event, context) {
  try {
    const segments = event.path.split("/").filter(Boolean);
    const id = segments[2] ? parseInt(segments[2], 10) : null;

    if (event.httpMethod === "GET") {
      if (id) {
        const { data, error } = await supabase
          .from("email_history")
          .select("*")
          .eq("email_id", id);
        if (error) throw error;
        return { statusCode: 200, body: JSON.stringify(data[0]) };
      } else {
        const { data, error } = await supabase
          .from("email_history")
          .select("*");
        if (error) throw error;
        return { statusCode: 200, body: JSON.stringify(data) };
      }
    } else if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body);
      const { data, error } = await supabase
        .from("email_history")
        .insert([body]);
      if (error) throw error;
      return { statusCode: 200, body: JSON.stringify(data) };
    } else if (event.httpMethod === "PUT") {
      if (!id) return { statusCode: 400, body: "Missing ID" };
      const body = JSON.parse(event.body);
      const { data, error } = await supabase
        .from("email_history")
        .update(body)
        .eq("email_id", id);
      if (error) throw error;
      return { statusCode: 200, body: JSON.stringify(data) };
    } else if (event.httpMethod === "DELETE") {
      if (!id) return { statusCode: 400, body: "Missing ID" };
      const { data, error } = await supabase
        .from("email_history")
        .delete()
        .eq("email_id", id);
      if (error) throw error;
      return { statusCode: 200, body: JSON.stringify(data) };
    }
    return { statusCode: 405, body: "Method not allowed" };
  } catch (error) {
    console.error("Erreur dans email_history.js :", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}