import {
  columnSizingFeature,
  constructTable,
  tableFeatures
} from "@tanstack/react-table";
import {storeReactivityBindings} from "@tanstack/table-core/store-reactivity-bindings";
import {describe, expect, it} from "vitest";

import * as withHeader from "@/tanstack-table/header";

// constructTable is TanStack's framework-free table, which needs its
// reactivity bindings registered as a feature
const options = {
  columns: [{accessorKey: "email", header: "Email"}],
  data: [{email: "user@example.com"}]
};

describe("hasColumnSizing", () => {
  it("is true for a header of a table with column sizing", () => {
    const table = constructTable({
      ...options,
      features: tableFeatures({
        columnSizingFeature,
        coreReactivityFeature: storeReactivityBindings()
      })
    });

    const [header] = table.getFlatHeaders();

    expect(header && withHeader.hasColumnSizing(header)).toBe(true);
  });

  it("is false for a header of a table without column sizing", () => {
    const table = constructTable({
      ...options,
      features: tableFeatures({
        coreReactivityFeature: storeReactivityBindings()
      })
    });

    const [header] = table.getFlatHeaders();

    expect(header && withHeader.hasColumnSizing(header)).toBe(false);
  });
});
