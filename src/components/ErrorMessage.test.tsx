import {
  describe,
  it,
  expect,
  vi,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import ErrorMessage from "./ErrorMessage";

import userEvent from "@testing-library/user-event";

describe("ErrorMessage", () => {
  it("should display default error", () => {
    render(<ErrorMessage />)

    expect(
      screen.getByText(
        "Something went wrong."
      )
    ).toBeInTheDocument()
  })

  it("should display custom error", () => {
    render(
      <ErrorMessage
        message="Failed to load movies."
      />
    )

    expect(
      screen.getByText(
        "Failed to load movies."
      )
    ).toBeInTheDocument()
  })

  it("should not show a retry button without onRetry", () => {
    render(<ErrorMessage />)

    expect(
      screen.queryByRole("button", {
        name: "Try Again",
      })
    ).not.toBeInTheDocument()
  })

  it("should call onRetry when the retry button is clicked", async () => {
    const user = userEvent.setup()

    const onRetry = vi.fn()

    render(
      <ErrorMessage
        message="Failed to load movies."
        onRetry={onRetry}
      />
    )

    await user.click(
      screen.getByRole("button", {
        name: "Try Again",
      })
    )

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})