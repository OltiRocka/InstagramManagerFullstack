import { useState, useCallback } from "react";

type UseHoverReturnType = {
  hovered: boolean;
  eventHandlers: {
    onMouseOver: () => void;
    onMouseOut: () => void;
  };
};

const useHover = (): UseHoverReturnType => {
  const [hovered, setHovered] = useState<boolean>(false);

  const onMouseOver = useCallback(() => setHovered(true), []);
  const onMouseOut = useCallback(() => setHovered(false), []);

  const eventHandlers = { onMouseOver, onMouseOut };

  return { hovered, eventHandlers };
};

export default useHover;
