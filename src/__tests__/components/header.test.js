import { cleanup, screen } from "@testing-library/react";
import { renderWithRouterRedux } from "../../test-utils";
import Header from "../../components/header.component";


describe("Header Component", () => {
	afterEach(cleanup);
	
	it("should render with Redux cart state", () => {
		const { container } =
			renderWithRouterRedux(
					<Header/>
					,{
						initialState: {
							cart: {
								totalPrice: 1375,
								totalCount: 5
							}
						}
					}
			)
		
		expect(screen.getByText("React Pizza")).toBeInTheDocument();
		expect(screen.getByText('1375 ₽').closest('span')).toBeInTheDocument()
		expect(screen.getByText('5').closest('span')).toBeInTheDocument()

		expect(container.firstChild).toMatchSnapshot()
	})
});
