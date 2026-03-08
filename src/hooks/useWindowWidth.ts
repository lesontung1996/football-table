import { useState, useEffect } from "react";
import { debounce } from "@/utils/helperFunctions";

export default function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = debounce(() => setWidth(window.innerWidth), 200);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}
