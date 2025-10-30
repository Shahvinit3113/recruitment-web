/**
 * Format a date string or Date object into a readable short format.
 * Example output: "Oct 30, 2025"
 */
export const formatDate = (date?: string | Date | null): string => {
    if (!date) return "—";

    try {
        const parsedDate = typeof date === "string" ? new Date(date) : date;

        if (isNaN(parsedDate.getTime())) return "Invalid date";

        return parsedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return "—";
    }
};
