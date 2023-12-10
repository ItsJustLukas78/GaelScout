import {useEffect, useState} from "react";

export const IsPWA = () => {

  const [isPwa, setIsPwa] = useState(false);

  useEffect(() => {
    setIsPwa(["fullscreen", "standalone", "minimal-ui"].some(
        (displayMode) => window.matchMedia('(display-mode: ' + displayMode + ')').matches
    ));
  }, []);

  return isPwa;
};