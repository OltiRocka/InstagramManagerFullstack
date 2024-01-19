import { useState, useMemo } from "react";

type UseHoverReturnType = {
  hovered: boolean;
  eventHandlers: {
    onMouseOver: () => void;
    onMouseOut: () => void;
  };
};

const useHover = (): UseHoverReturnType => {
  const [hovered, setHovered] = useState(false);

  const eventHandlers = useMemo(
    () => ({
      onMouseOver() {
        setHovered(true);
      },
      onMouseOut() {
        setHovered(false);
      },
    }),
    []
  );

  return { hovered, eventHandlers };
};
export default useHover;
