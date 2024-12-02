import { useEffect } from "react";

// Use effect which also attached a key down event listener. useEffect hook is like an escape hatch to using vanilla javascript codes and event listner
export function useKey(key, callback) {
  useEffect(
    function () {
      const keyPress = function (e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          callback();
        }
      };
      document.addEventListener("keydown", keyPress);

      // Cleanup function to clean the attached event lisner on document when the view is unmounted
      return function () {
        document.removeEventListener("keydown", keyPress);
      };
    },
    [callback, key]
  );
}
