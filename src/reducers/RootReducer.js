import { combineReducers } from "redux";
import resultItemReducer from "./ResultItemReducer.js";
import pageNumberReducer from "./pageNumberReducer.js";
import searchParametersReducer from "./SearchParametersReducer";
import searchDataReducer from "./SearchDataReducer";
import parametersChangedReducer from "./ParametersChangedReducer";
import SearchDataParametersReducer from "./SearchDataParametersReducer";
import favoriteMoviesReducer from "./FavoriteMoviesReducer";

// Combines all reducers and export them
export default combineReducers({
  resultItems: resultItemReducer,
  currentPage: pageNumberReducer,
  searchParameters: searchParametersReducer,
  searchData: searchDataReducer,
  searchDataParameter: SearchDataParametersReducer,
  parametersChanged: parametersChangedReducer,
  favoriteMovies: favoriteMoviesReducer,
});
