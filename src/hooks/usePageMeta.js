import { useEffect } from "react";

export function usePageMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute("content") : "";
    if (metaDesc && description) metaDesc.setAttribute("content", description);

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc) metaDesc.setAttribute("content", prevDesc);
    };
  }, [title, description]);
}
