import { useState, useCallback } from "react";

type CopyResult = {
    success: boolean;
    error?: Error | null;
};

export default function useCopyTrackingNumber() {
    const [error, setError] = useState<Error | null>(null);

    const copy = useCallback(async (text: string): Promise<CopyResult> => {
        setError(null);
        if (!text) {
            const err = new Error("No text provided to copy");
            setError(err);
            return { success: false, error: err };
        }

        try {
            if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return { success: true };
            }
        } catch (e) {
            // swallow and try fallback
            const err = e instanceof Error ? e : new Error(String(e));
            console.warn("navigator.clipboard failed, falling back to execCommand.", err);
        }

        // Fallback approach for older browsers
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            // Move off-screen to avoid scrolling
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.select();

            const successful = document.execCommand("copy");
            document.body.removeChild(textArea);

            if (!successful) {
                const err = new Error("Fallback copy command unsuccessful");
                setError(err);
                return { success: false, error: err };
            }

            return { success: true };
        } catch (e) {
            const err = e instanceof Error ? e : new Error(String(e));
            setError(err);
            console.error("Fallback copy failed:", err);
            return { success: false, error: err };
        }
    }, []);

    return { copy, error } as const;
}
