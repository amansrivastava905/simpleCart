import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import AddProductPage from './Pages/AddProductPage'
import AllProductsPage from './Pages/AllProductsPage'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/addProduct" exact>
          <AddProductPage />
        </Route>
        <Route path="/" exact>
          <AllProductsPage />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
