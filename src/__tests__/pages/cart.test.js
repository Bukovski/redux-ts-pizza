import { screen } from "@testing-library/react";
import { renderWithRouterRedux } from "../../test-utils";
import { mockCart } from "../../__mocks__/db.mock";
import Cart from "../../pages/cart.page";
import userEvent from "@testing-library/user-event";


describe("Cart Page", () => {
	it("should render with default props", () => {
		renderWithRouterRedux(<Cart />);
		
		expect(screen.getByText("Корзина пуста")).toBeInTheDocument();
		expect(screen.getByText('Вернуться назад').closest('a')).toHaveAttribute('href', '/')
	});
	
	describe("render with redux initialState", () => {
		beforeEach(() => {
			renderWithRouterRedux(
				<Cart />
				,{
					initialState: {
						cart: {
							...mockCart
						}
					}
				}
			);
		})
		
		it("should render with cart state", () => {
			expect(screen.getByText('10 шт.').closest('span')).toHaveTextContent("Всего пицц: 10 шт.")
			expect(screen.getByText('5800 ₽').closest('span')).toHaveTextContent("Сумма заказа: 5800 ₽")
			
			expect(screen.getAllByRole("img", { name: "Pizza" }).length).toBe(6);
			
			expect(screen.getByText("Цыпленок барбекю")).toBeInTheDocument();
			expect(screen.getByText("295 ₽")).toBeInTheDocument();
		});
		
		it("change the number of pizzas, plus one", () => {
			expect(screen.getByText('10 шт.').closest('span')).toHaveTextContent("Всего пицц: 10 шт.");
			expect(screen.getByText('5800 ₽').closest('span')).toHaveTextContent("Сумма заказа: 5800 ₽");
			
			const cartItemId = screen.getByTestId("cart-item-2");
			
			userEvent.click(cartItemId.querySelector(".cart__item-count-plus"));
			expect(screen.getByText('11 шт.').closest('span')).toHaveTextContent("Всего пицц: 11 шт.");
			expect(screen.getByText('6380 ₽').closest('span')).toHaveTextContent("Сумма заказа: 6380 ₽");
		});
		
		it("change the number of pizzas, minus one", () => {
			expect(screen.getByText('10 шт.').closest('span')).toHaveTextContent("Всего пицц: 10 шт.");
			expect(screen.getByText('5800 ₽').closest('span')).toHaveTextContent("Сумма заказа: 5800 ₽");
			
			const cartItemId = screen.getByTestId("cart-item-2");
			
			userEvent.click(cartItemId.querySelector(".cart__item-count-minus"))
			expect(screen.getByText('9 шт.').closest('span')).toHaveTextContent("Всего пицц: 9 шт.");
			expect(screen.getByText('5220 ₽').closest('span')).toHaveTextContent("Сумма заказа: 5220 ₽");
		});
		
		it("if cart item have only 1 pizza, it cannot be taken away", () => {
			expect(screen.getAllByRole("img", { name: "Pizza" }).length).toBe(6);
			expect(screen.getByText('10 шт.').closest('span')).toHaveTextContent("Всего пицц: 10 шт.");
			expect(screen.getByText('5800 ₽').closest('span')).toHaveTextContent("Сумма заказа: 5800 ₽");
			
			const cartItemId = screen.getByTestId("cart-item-0");
			userEvent.click(cartItemId.querySelector(".cart__item-count-minus"))
			
			expect(screen.getAllByRole("img", { name: "Pizza" }).length).toBe(6);
			expect(screen.getByText('10 шт.').closest('span')).toHaveTextContent("Всего пицц: 10 шт.");
			expect(screen.getByText('5800 ₽').closest('span')).toHaveTextContent("Сумма заказа: 5800 ₽");
		});
		
		it("remove pizza item if click delete button, window.confirm is true", () => {
			window.confirm = jest.fn().mockImplementation(() => true)
			
			expect(screen.getByText('10 шт.').closest('span')).toHaveTextContent("Всего пицц: 10 шт.");
			expect(screen.getByText('5800 ₽').closest('span')).toHaveTextContent("Сумма заказа: 5800 ₽");
			expect(window.confirm).not.toHaveBeenCalled();
			
			const cartItemId = screen.getByTestId("cart-item-2");
			
			userEvent.click(cartItemId.querySelector(".cart__item-remove > button"))
			expect(window.confirm).toHaveBeenCalled();
			
			expect(screen.getByText('8 шт.').closest('span')).toHaveTextContent("Всего пицц: 8 шт.");
			expect(screen.getByText('4640 ₽').closest('span')).toHaveTextContent("Сумма заказа: 4640 ₽");
		});
		
		it("remove pizza item if click delete button, window.confirm is false", () => {
			window.confirm = jest.fn().mockImplementation(() => false)
			
			expect(screen.getByText('10 шт.').closest('span')).toHaveTextContent("Всего пицц: 10 шт.");
			expect(window.confirm).not.toHaveBeenCalled();
			
			const cartItemId = screen.getByTestId("cart-item-2");
			
			userEvent.click(cartItemId.querySelector(".cart__item-remove > button"))
			expect(window.confirm).toHaveBeenCalled();
			
			expect(screen.getByText('10 шт.').closest('span')).toHaveTextContent("Всего пицц: 10 шт.");
		});
		
		it("clear cart button, window.confirm is true", () => {
			window.confirm = jest.fn().mockImplementation(() => true)
			
			expect(screen.getByText('10 шт.').closest('span')).toHaveTextContent("Всего пицц: 10 шт.");
			
			expect(window.confirm).not.toHaveBeenCalled();
			
			userEvent.click(screen.getByText("Очистить корзину"));
			expect(window.confirm).toHaveBeenCalled();
			
			expect(screen.getByText('Корзина пуста'));
		});
		
		it("clear cart button, window.confirm is false", () => {
			window.confirm = jest.fn().mockImplementation(() => false)
			
			expect(screen.getByText('10 шт.').closest('span')).toHaveTextContent("Всего пицц: 10 шт.");
			expect(window.confirm).not.toHaveBeenCalled();
			
			
			userEvent.click(screen.getByText("Очистить корзину"));
			expect(window.confirm).toHaveBeenCalled();
			
			expect(screen.getByText('10 шт.').closest('span')).toHaveTextContent("Всего пицц: 10 шт.");
		});
		
		it("show popup form", () => {
			const closeWindowId = screen.getByTestId('close-window-button');
			const formOrder = closeWindowId.closest("div")
			const textbox = screen.getByRole("textbox");
			
			expect(formOrder).toHaveClass("form-order__hide");
			
			userEvent.click(closeWindowId);
			expect(formOrder).not.toHaveClass("form-order__hide");
			
			userEvent.type(textbox, "5556667777");
			expect(textbox).toHaveValue("(555) 666-7777");
			
			userEvent.click(screen.getByText('Отправить'));
			expect(screen.getByText("Корзина пуста")).toBeInTheDocument();
		});
	});
});
