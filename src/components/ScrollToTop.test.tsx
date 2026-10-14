import {
  describe,
  it,
  expect,
  vi,
} from "vitest";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route, Link } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

describe("ScrollToTop", () => {
  it("scrolls to top on mount and on route change", async () => {
    const user = userEvent.setup()

    const scrollTo = vi
      .spyOn(window, "scrollTo")
      .mockImplementation(() => {})

    render(
      <MemoryRouter initialEntries={["/first"]}>
        <ScrollToTop />

        <Routes>
          <Route
            path="/first"
            element={
              <Link to="/second">
                Go to second
              </Link>
            }
          />

          <Route
            path="/second"
            element={<p>Second page</p>}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(scrollTo).toHaveBeenCalledWith(0, 0)

    await user.click(
      screen.getByRole("link", {
        name: "Go to second",
      })
    )

    expect(
      screen.getByText("Second page")
    ).toBeInTheDocument()

    expect(scrollTo).toHaveBeenCalledTimes(2)
    expect(scrollTo).toHaveBeenLastCalledWith(
      0,
      0
    )

    scrollTo.mockRestore()
  })
})
