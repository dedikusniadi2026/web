import {
  describe,
  it,
  expect,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import Loading from "./Loading";

describe("Loading", () => {
  it("should display loading indicator", () => {
    render(<Loading />)

    expect(
      screen.getByRole("status")
    ).toBeInTheDocument()
  })
})