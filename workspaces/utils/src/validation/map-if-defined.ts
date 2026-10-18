import {isDefined} from "./is-defined";

type ExtractNullish<TValue> = Extract<TValue, null | undefined>;

const mapIfDefined = <TMaybeValue, TResult>(
  maybeValue: TMaybeValue,
  map: (value: NonNullable<TMaybeValue>) => TResult
) =>
  isDefined(maybeValue)
    ? map(maybeValue)
    : (maybeValue as ExtractNullish<TMaybeValue>);

export {mapIfDefined};
