import axios from "axios";
import { Dispatch } from "react";

import { failLoaded, setPizzas } from "../actions/pizzas.action";

import { IFiltersSortByState } from "../../types/filters.type";
import { PizzaAction } from "../../types/pizzas.type";


export const fetchPizzas = (sortBy: IFiltersSortByState, category: null | number) =>
  (dispatch: Dispatch<PizzaAction>) => {
    axios.get(
        `/db/pizzas?${
          (category !== null)
            ? `category=${ category }`
            : ''
        }&_sort=${ sortBy.type }&_order=${ sortBy.order }`,
      )
      .then(({ data }) => dispatch(setPizzas(data)) )
      .catch(err => dispatch(failLoaded("Не получилось загрузить данные. Попробуйте позже")))
  }