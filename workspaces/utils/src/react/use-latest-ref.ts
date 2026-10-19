import {useLayoutEffect, useRef} from "react";
import type {RefObject} from "react";

// Updated on commit, never during render, so an abandoned render can't leak
// its value
const useLatestRef = <TValue>(value: TValue): RefObject<TValue> => {
  const ref = useRef(value);

  useLayoutEffect(() => {
    ref.current = value;
  });

  return ref;
};

export {useLatestRef};
