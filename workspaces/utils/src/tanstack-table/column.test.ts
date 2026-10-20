import {
  columnPinningFeature,
  columnSizingFeature,
  constructTable,
  tableFeatures
} from "@tanstack/react-table";
import {storeReactivityBindings} from "@tanstack/table-core/store-reactivity-bindings";
import {describe, expect, it} from "vitest";

import * as withColumn from "@/tanstack-table/column";

// constructTable is TanStack's framework-free table, which needs its
// reactivity bindings registered as a feature
const options = {
  columns: [{accessorKey: "email", header: "Email"}],
  data: [{email: "user@example.com"}]
};

const getFirstColumn = () => {
  const tableWithFeatures = constructTable({
    ...options,
    features: tableFeatures({
      columnPinningFeature,
      columnSizingFeature,
      coreReactivityFeature: storeReactivityBindings()
    })
  });

  const tableWithoutFeatures = constructTable({
    ...options,
    features: tableFeatures({
      coreReactivityFeature: storeReactivityBindings()
    })
  });

  return {
    withFeatures: tableWithFeatures.getAllLeafColumns()[0],
    withoutFeatures: tableWithoutFeatures.getAllLeafColumns()[0]
  };
};

describe("hasColumnPinning", () => {
  it("is true only for a column of a table with column pinning", () => {
    const {withFeatures, withoutFeatures} = getFirstColumn();

    expect(withFeatures && withColumn.hasColumnPinning(withFeatures)).toBe(
      true
    );
    expect(
      withoutFeatures && withColumn.hasColumnPinning(withoutFeatures)
    ).toBe(false);
  });
});

describe("hasColumnSizing", () => {
  it("is true only for a column of a table with column sizing", () => {
    const {withFeatures, withoutFeatures} = getFirstColumn();

    expect(withFeatures && withColumn.hasColumnSizing(withFeatures)).toBe(true);
    expect(withoutFeatures && withColumn.hasColumnSizing(withoutFeatures)).toBe(
      false
    );
  });
});
