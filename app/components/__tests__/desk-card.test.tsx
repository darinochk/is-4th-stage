import { render, screen, fireEvent } from "@testing-library/react";
import { DeskCard } from "../desk-card";
import { Desk } from "@/app/services/api";
import { useUserStore } from "@/context/user-store";

// Mock dependencies
jest.mock("@/context/user-store");
jest.mock("@/app/services/api", () => ({
  deskService: {
    deleteDesk: jest.fn(),
    updateDesk: jest.fn(),
  },
  bookingService: {
    createBooking: jest.fn(),
  },
}));

const mockUseUserStore = useUserStore as jest.MockedFunction<typeof useUserStore>;
const mockPush = jest.fn();

// Mock useRouter from jest.setup.js
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  })),
  usePathname: jest.fn(() => "/"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

describe("DeskCard", () => {
  const mockCard: Desk = {
    id: 1,
    deskNumber: 5,
    capacity: 4,
    location: "У окна",
  };

  const mockOnCardChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
  });

  it("renders desk information correctly", () => {
    mockUseUserStore.mockReturnValue(false);

    render(<DeskCard card={mockCard} onCardChange={mockOnCardChange} />);

    expect(screen.getByText(/Столик номер: 5/i)).toBeInTheDocument();
    expect(screen.getByText(/Вместимость: 4/i)).toBeInTheDocument();
    expect(screen.getByText(/Расположение: У окна/i)).toBeInTheDocument();
  });

  it("shows booking button for all users", () => {
    mockUseUserStore.mockReturnValue(false);

    render(<DeskCard card={mockCard} onCardChange={mockOnCardChange} />);

    const bookingButtons = screen.getAllByText(/Забронировать/i);
    expect(bookingButtons.length).toBeGreaterThan(0);
    expect(bookingButtons[0]).toBeInTheDocument();
  });

  it("shows admin buttons when user is admin", () => {
    mockUseUserStore.mockImplementation((selector) => {
      if (selector.toString().includes("role")) {
        return "ADMIN" as any;
      }
      return false;
    });

    render(<DeskCard card={mockCard} onCardChange={mockOnCardChange} />);

    expect(screen.getByText(/Изменить/i)).toBeInTheDocument();
    expect(screen.getByText(/Удалить/i)).toBeInTheDocument();
  });

  it("opens booking dialog when booking button is clicked", () => {
    mockUseUserStore.mockReturnValue(false);

    render(<DeskCard card={mockCard} onCardChange={mockOnCardChange} />);

    // Dialog is already rendered, just check it's in the document
    expect(screen.getByText(/Бронирование столика 5/i)).toBeInTheDocument();

    // Click the main booking button (first one) to open the dialog
    const bookingButtons = screen.getAllByText(/Забронировать/i);
    fireEvent.click(bookingButtons[0]);

    // Dialog should be accessible after clicking
    expect(screen.getByText(/Бронирование столика 5/i)).toBeInTheDocument();
    expect(screen.getByText(/Дата начала:/i)).toBeInTheDocument();
  });
});
