import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(
    <Provider store={store}>
      <App        
       onNextPage={() => store.dispatch({type: 'NEXT_PAGE'})}
       onPrevPage={() => store.dispatch({type: 'PREVIOUS_PAGE'})}
      />
    </Provider>
  );  

  expect(getByText(/learn/i)).toBeInTheDocument();
});
