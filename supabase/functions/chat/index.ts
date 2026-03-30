import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Handle thumbnail image generation
    if (type === "thumbnail") {
      const userPrompt = messages?.[0]?.content || "YouTube thumbnail";
      const imagePrompt = `Create a professional, eye-catching YouTube video thumbnail for: "${userPrompt}". Make it vibrant, bold, high-contrast, with dramatic lighting. Use cinematic composition. Include bold large text overlay that says the key topic. Make it look like a top YouTuber's thumbnail with professional graphic design. 16:9 aspect ratio.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [{ role: "user", content: imagePrompt }],
          modalities: ["image", "text"],
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Image generation error:", response.status, text);
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw new Error(`Image generation error: ${response.status}`);
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!imageUrl) {
        throw new Error("No image was generated. Try a different description.");
      }

      return new Response(JSON.stringify({ imageUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle text-based requests
    const systemPrompts: Record<string, string> = {
      chat: "You are an expert YouTube content strategist powered by advanced AI. Give SHORT, PRECISE, and ACCURATE answers. Be direct — no fluff or filler. Use bullet points and bold text for key info. Include specific numbers, tools, and actionable steps. Use emojis sparingly. Keep responses under 200 words unless the user asks for detail.",
      script: "You are a professional YouTube scriptwriter. When given a topic, generate a complete, engaging YouTube video script with sections: HOOK (first 15 seconds), INTRO, MAIN CONTENT (3+ key points), CALL TO ACTION, and OUTRO. Use markdown formatting, be specific and entertaining.",
      titles: "You are a YouTube title optimization expert. Given a topic, generate exactly 5 catchy, click-worthy YouTube video titles. Each title should use different psychological triggers (curiosity, numbers, urgency, controversy, personal story). Return ONLY the 5 titles, one per line, numbered 1-5.",
      trending: "You are a YouTube trend analyst. Generate 6 trending video ideas that would perform well right now. Each idea should be a short, catchy title with an emoji prefix. Return ONLY the 6 ideas, one per line.",
    };

    const systemPrompt = systemPrompts[type || "chat"] || systemPrompts.chat;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Workspace > Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Function error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
