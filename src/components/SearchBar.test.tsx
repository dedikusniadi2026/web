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

import userEvent from "@testing-library/user-event";
import SearchBar from "./SearchBar";

describe("SearchBar", () => {
  it("renders the search input", () => {
    render(
      <SearchBar
        value=""
        onChange={vi.fn()}
      />
    )

    expect(
      screen.getByRole("textbox", {
        name: "Search movies",
      })
    ).toBeInTheDocument()
  })

  it("should call onChange when user types", async () => {
    const user = userEvent.setup()

    const onChange = vi.fn()

    render(
      <SearchBar
        value=""
        onChange={onChange}
      />
    )

    const input = screen.getByPlaceholderText(
      "Search movies..."
    )

    await user.type(input, "Batman")

    expect(onChange).toHaveBeenCalled()
  });

  it("should display current value", () => {
  render(
    <SearchBar
      value="Batman"
      onChange={vi.fn()}
    />
  )

  expect(
    screen.getByRole("textbox", {
      name: "Search movies",
    })
  ).toHaveValue("Batman")
})

  it("should show a clear button when there is a value", async () => {
    const user = userEvent.setup()

    const onChange = vi.fn()

    render(
      <SearchBar
        value="Batman"
        onChange={onChange}
      />
    )

    await user.click(
      screen.getByRole("button", {
        name: "Clear search",
      })
    )

    expect(onChange).toHaveBeenCalledWith("")
  })

  it("should hide the clear button when the value is empty", () => {
    render(
      <SearchBar
        value=""
        onChange={vi.fn()}
      />
    )

    expect(
      screen.queryByRole("button", {
        name: "Clear search",
      })    ).not.toBeInTheDocument()
  })
})
