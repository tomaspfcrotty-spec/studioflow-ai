const TAB_URLS = {
  Classes: "Classes",
  Memberships: "Memberships",
  Coaches: "Coaches",
  FAQs: "FAQs",
  Announcements: "Announcements",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return json(
        {
          ok: true,
          service: "studioflow-ai-worker",
          status: "healthy",
        },
        corsHeaders
      );
    }

    if (request.method === "GET") {
      return json(
        {
          ok: true,
          service: "studioflow-ai-worker",
          sheetId: env.GOOGLE_SHEET_ID,
        },
        corsHeaders
      );
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, corsHeaders, 405);
    }

    try {
      const body = await request.json();
      const userMessage = String(body.message || "").trim();

      if (!userMessage) {
        return json({ error: "Message is required" }, corsHeaders, 400);
      }

      const intent = detectIntent(userMessage);
      const context = await buildContext(intent, userMessage, env);
      const reply = await askOpenAI(userMessage, context, env);

      return json(
        {
          reply,
          intent,
          warnings: context.warnings,
          sourceTabs: context.sourceTabs,
        },
        corsHeaders
      );
    } catch (error) {
      return json(
        { error: error.message || "Unexpected worker error" },
        corsHeaders,
        500
      );
    }
  },
};

function json(data, headers, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

function detectIntent(message) {
  const text = message.toLowerCase();

  if (
    text.includes("how much") ||
    text.includes("price") ||
    text.includes("cost") ||
    text.includes("membership") ||
    text.includes("intro") ||
    text.includes("monthly") ||
    text.includes("student") ||
    text.includes("pack") ||
    text.includes("founder") ||
    text.includes("membership") ||
    text.includes("euro") ||
    text.includes("intro 2 weeks") ||
    text.includes("unlimited monthly") ||
    text.includes("reformer pack") ||
    text.includes("student wellness") ||
    text.includes("founder circle")
  ) {
    return "memberships";
  }

  if (
    text.includes("coach") ||
    text.includes("teacher") ||
    text.includes("beginner") ||
    text.includes("teaches")
  ) {
    return "coaches";
  }

  if (
    text.includes("faq") ||
    text.includes("bring") ||
    text.includes("cancel") ||
    text.includes("parking") ||
    text.includes("shower")
  ) {
    return "faqs";
  }

  if (text.includes("announcement") || text.includes("update")) {
    return "announcements";
  }

  return "classes";
}

function tabsForIntent(intent) {
  switch (intent) {
    case "memberships":
      return ["Memberships", "Announcements"];
    case "coaches":
      return ["Coaches", "Classes", "Announcements"];
    case "faqs":
      return ["FAQs", "Announcements"];
    case "announcements":
      return ["Announcements"];
    default:
      return ["Classes", "Coaches", "Announcements"];
  }
}

async function buildContext(intent, userMessage, env) {
  const sourceTabs = tabsForIntent(intent);
  const data = {};

  for (const tab of sourceTabs) {
    data[tab] = await fetchSheetCsv(env.GOOGLE_SHEET_ID, tab);
  }

  normalizeData(data);

  const filtered = filterContextForQuery(intent, userMessage, data);

  return {
    sourceTabs,
    warnings: detectWarnings(filtered),
    data: filtered,
  };
}

async function fetchSheetCsv(sheetId, tabName) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    TAB_URLS[tabName] || tabName
  )}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch live data for ${tabName}`);
  }

  const csvText = await response.text();
  return parseCsv(csvText);
}

function parseCsv(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  if (!lines.length) {
    return [];
  }

  const headers = splitCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });
}

function splitCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result;
}

function normalizeData(data) {
  if (data.Classes) {
    data.Classes = data.Classes.map((row) => ({
      ...row,
      start_time: normalizeTime(row.start_time),
      slots_left: toNumber(row.slots_left),
      duration_minutes: toNumber(row.duration_minutes),
      waitlist_open: String(row.waitlist_open || "").toLowerCase() === "yes",
    }));
  }

  if (data.Memberships) {
    data.Memberships = data.Memberships.map((row) => ({
      ...row,
      price_eur: toNumber(row.price_eur),
    }));
  }

  if (data.Coaches) {
    data.Coaches = data.Coaches.map((row) => ({
      ...row,
      signature_classes: row.signature_classes
        ? row.signature_classes.split("|").map((item) => item.trim())
        : [],
    }));
  }

  if (data.Announcements) {
    data.Announcements = data.Announcements.filter(
      (row) => String(row.status || "").toLowerCase() === "active"
    );
  }
}

function detectWarnings(data) {
  const warnings = [];

  for (const row of data.Classes || []) {
    if (normalizeTime(row.start_time) && normalizeTime(row.start_time) < "06:00") {
      warnings.push(
        `Class '${row.class_name}' has an unusual listed time of ${row.start_time}.`
      );
    }
  }

  for (const row of data.Memberships || []) {
    if (typeof row.price_eur === "number" && row.price_eur > 500) {
      warnings.push(
        `Membership '${row.membership_name}' has an unusually high listed price of ${row.price_eur} euro.`
      );
    }
  }

  return warnings;
}

function filterContextForQuery(intent, userMessage, data) {
  const text = userMessage.toLowerCase();
  const result = { ...data };

  if (result.Classes) {
    const requestedDay = extractDay(text);
    const requestedTime = extractTime(text);
    const matchingClassName = findClassNameMention(text, result.Classes);

    let classes = result.Classes;

    if (requestedDay) {
      classes = classes.filter((row) => String(row.day || "").toLowerCase() === requestedDay);
    }

    if (requestedTime) {
      classes = classes.filter((row) => normalizeTime(row.start_time) === requestedTime);
    }

    if (matchingClassName) {
      classes = classes.filter((row) => String(row.class_name || "") === matchingClassName);
    }

    if (!requestedDay && !requestedTime && !matchingClassName) {
      classes = classes.slice(0, 8);
    }

    result.Classes = classes;
  }

  if (result.Coaches) {
    const matchingCoachName = findCoachNameMention(text, result.Coaches);
    const matchingClassName = findClassNameMention(text, data.Classes || []);
    const requestedCategory = extractCategory(text);

    let coaches = result.Coaches;

    if (matchingCoachName) {
      coaches = coaches.filter((row) => String(row.coach_name || "") === matchingCoachName);
    } else if (matchingClassName) {
      const coachIds = new Set(
        (data.Classes || [])
          .filter((row) => String(row.class_name || "") === matchingClassName)
          .map((row) => row.coach_id)
      );
      coaches = coaches.filter((row) => coachIds.has(row.coach_id));
    } else if (requestedCategory) {
      coaches = coaches.filter((row) => {
        const specialty = String(row.specialty || "").toLowerCase();
        const signatureClasses = Array.isArray(row.signature_classes)
          ? row.signature_classes.join(" ").toLowerCase()
          : "";
        return specialty.includes(requestedCategory) || signatureClasses.includes(requestedCategory);
      });
    }

    result.Coaches = coaches.slice(0, 5);
  }

  if (result.Memberships) {
    const matchingMembership = findMembershipMention(text, result.Memberships);
    result.Memberships = matchingMembership
      ? result.Memberships.filter((row) => String(row.membership_name || "") === matchingMembership)
      : result.Memberships.slice(0, 6);
  }

  if (result.FAQs) {
    const faqMatches = result.FAQs.filter((row) => {
      const question = String(row.question || "").toLowerCase();
      const answer = String(row.answer || "").toLowerCase();
      return text.split(/\s+/).some((token) => token.length > 3 && (question.includes(token) || answer.includes(token)));
    });
    result.FAQs = faqMatches.length ? faqMatches.slice(0, 5) : result.FAQs.slice(0, 5);
  }

  if (result.Announcements) {
    const relevantAnnouncements = result.Announcements.filter((row) => {
      const message = String(row.message || "").toLowerCase();
      return text.split(/\s+/).some((token) => token.length > 3 && message.includes(token));
    });
    result.Announcements = relevantAnnouncements.length
      ? relevantAnnouncements.slice(0, 4)
      : result.Announcements.slice(0, 4);
  }

  return result;
}

function extractDay(text) {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  return days.find((day) => text.includes(day));
}

function extractTime(text) {
  const match = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/);
  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minutes = match[2] || "00";
  const suffix = match[3];

  if (suffix === "pm" && hour < 12) {
    hour += 12;
  }

  if (suffix === "am" && hour === 12) {
    hour = 0;
  }

  return `${String(hour).padStart(2, "0")}:${minutes}`;
}

function normalizeTime(value) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    return String(value || "");
  }
  return `${String(Number(match[1])).padStart(2, "0")}:${match[2]}`;
}

function extractCategory(text) {
  const categories = ["yoga", "pilates", "strength", "mobility", "hiit", "cardio"];
  return categories.find((item) => text.includes(item)) || null;
}

function findClassNameMention(text, classes) {
  const match = classes.find((row) => text.includes(String(row.class_name || "").toLowerCase()));
  return match ? String(match.class_name) : null;
}

function findCoachNameMention(text, coaches) {
  const match = coaches.find((row) => text.includes(String(row.coach_name || "").toLowerCase()));
  return match ? String(match.coach_name) : null;
}

function findMembershipMention(text, memberships) {
  const match = memberships.find((row) => text.includes(String(row.membership_name || "").toLowerCase()));
  return match ? String(match.membership_name) : null;
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : parsed;
}

async function askOpenAI(userMessage, context, env) {
  const systemPrompt = [
    "You are StudioFlow AI, a cautious customer service assistant for a boutique fitness studio.",
    "Answer only from the provided live data context.",
    "If a value appears suspicious or unusual, say so clearly and advise confirming it with the studio.",
    "Do not invent booking, payment, or capabilities that are not present.",
    "Prefer a direct answer first, then key details, then any caution if needed.",
    "If there are no matching records, say that clearly rather than improvising.",
    "Keep the answer concise, helpful, and customer-friendly.",
  ].join(" ");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: JSON.stringify({
            question: userMessage,
            sourceTabs: context.sourceTabs,
            warnings: context.warnings,
            data: context.data,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${errorText}`);
  }

  const payload = await response.json();
  return payload.choices?.[0]?.message?.content || "I could not generate a response.";
}
