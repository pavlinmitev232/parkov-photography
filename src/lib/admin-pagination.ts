type DateCursor = {
  date: Date;
  id: string;
};

export function getSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function encodeDateCursor(date: Date, id: string) {
  return Buffer.from(
    JSON.stringify({ date: date.toISOString(), id }),
  ).toString("base64url");
}

export function decodeDateCursor(value: string | undefined): DateCursor | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as { date?: unknown; id?: unknown };
    const date = new Date(typeof parsed.date === "string" ? parsed.date : "");

    if (
      !Number.isFinite(date.getTime()) ||
      typeof parsed.id !== "string" ||
      parsed.id.length === 0 ||
      parsed.id.length > 200
    ) {
      return null;
    }

    return { date, id: parsed.id };
  } catch {
    return null;
  }
}
