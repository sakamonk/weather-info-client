import { render, screen } from "@testing-library/react";
import { AppContextProvider } from "../../../src/components/AppContextProps";
import Page1 from "../../../src/pages/Page1";

test("renders Page 1", () => {
  render(
    <AppContextProvider>
      <Page1 />
    </AppContextProvider>,
  );

  const textElement = screen.getByText(/This is Page 1/i);
  expect(textElement).toBeInTheDocument();
});
