// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock HTMLDialogElement methods for jsdom
HTMLDialogElement.prototype.showModal = jest.fn(function () {
  this.setAttribute("open", "");
});
HTMLDialogElement.prototype.close = jest.fn(function () {
  this.removeAttribute("open");
});

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: "/",
      query: {},
      asPath: "/",
    };
  },
  usePathname() {
    return "/";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Suppress console errors in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
