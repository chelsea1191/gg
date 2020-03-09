import React, { useState, useEffect } from "react";
import axios from "axios";
import Family from "./Components/Family.js";
import Chicken from "./Components/Chicken.js";
import Beef from "./Components/Beef.js";
import Veggie from "./Components/Veggie.js";
import Home from "./Components/Home.js";
import Search from "./Components/Search.js";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [chicken, setChicken] = useState([]);
  const [beef, setBeef] = useState([]);
  const [veggie, setVeggie] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState([]);

  const APP_ID = "2224879b";
  const APP_KEY = "645ea4ee77c571427c20ed96020a75bf";

  const getChickenRecipes = async () => {
    const response = await fetch(
      `https://api.edamam.com/search?q=chicken&app_id=${APP_ID}&app_key=${APP_KEY}`
    );
    const data = await response.json();
    setChicken(data.hits);
  };
  const getBeefRecipes = async () => {
    const response = await fetch(
      `https://api.edamam.com/search?q=beef&app_id=${APP_ID}&app_key=${APP_KEY}`
    );
    const data = await response.json();
    setBeef(data.hits);
  };
  const getVeggieRecipes = async () => {
    const response = await fetch(
      `https://api.edamam.com/search?q=veggie&app_id=${APP_ID}&app_key=${APP_KEY}`
    );
    const data = await response.json();
    setVeggie(data.hits);
  };
  useEffect(() => {
    getChickenRecipes();
    getBeefRecipes();
    getVeggieRecipes();
  }, []);
  useEffect(() => {
    axios
      .get("/api/recipes")
      .then(response => setRecipes(response.data))
      .catch(ex => console.log(ex.response.data));
  }, []);

  const updateSearch = e => {
    setSearch(e.target.value);
  };

  const getSearch = e => {
    e.preventDefault();
    setQuery(search);
    setSearch("");
  };
  return (
    <div className="App">
      <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light">
            <li className="nav-link active">
              <Link className="link" to="/">
                <img
                  src="/assets/home.png"
                  alt=""
                  width="32"
                  height="32"
                  title="Bootstrap"
                ></img>
              </Link>
            </li>
            <li className="nav-link">
              <Link className="link" to="/family">
                Family
              </Link>
            </li>
            <li className="nav-link">
              <Link className="link" to="/chicken">
                Chicken
              </Link>
            </li>
            <li className="nav-link">
              <Link className="link" to="/beef">
                Beef
              </Link>
            </li>
            <li className="nav-link">
              <Link className="link" to="/veggie">
                Veggie
              </Link>
            </li>
            <li className="nav-link">
              <Link className="link" to="/search">
                <img
                  src="/assets/search.png"
                  alt=""
                  width="32"
                  height="32"
                  title="Bootstrap"
                ></img>
              </Link>
            </li>
          </nav>
          <hr />
          <Switch>
            <Route path="/family">
              <Family recipes={recipes} setRecipes={setRecipes} />
            </Route>
            <Route path="/chicken">
              <Chicken chicken={chicken} />
            </Route>
            <Route path="/beef">
              <Beef beef={beef} />
            </Route>
            <Route path="/veggie">
              <Veggie veggie={veggie} />
            </Route>
            <Route path="/search">
              <Search
                search={search}
                query={query}
                updateSearch={updateSearch}
                getSearch={getSearch}
                searched={searched}
                setSearched={setSearched}
                APP_ID={APP_ID}
                APP_KEY={APP_KEY}
              />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
      <div className="media">
        <img
          className="img-thumbnail align-self-end mr-3"
          src="./assets/me.jpg"
        />
        <p className="mt-0">developed by: chelsea</p>
      </div>
    </div>
  );
};

export default App;
