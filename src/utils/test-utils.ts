import { render, RenderOptions, RenderResult } from "@testing-library/react";

import { RenderWrapper } from "@/components/render-wrapper";
import { ReactElement } from "react";

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: RenderWrapper, ...options }) as RenderResult;

// eslint-disable-next-line import/export
export * from "@testing-library/react";
// eslint-disable-next-line import/export
export { customRender as render };