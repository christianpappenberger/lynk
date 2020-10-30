import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import App_Front from "./App_Front";
import App_Redirect from "./App_Redirect";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { MetaTags } from "react-meta-tags";

class App extends Component {

  render() { 
    return (  
      <Router>
        <MetaTags>
        <meta name="description" content="Free tool to easily create appealing links with an Open Graph Image and Title for sharing these on social media." />
        <meta name="keywords" content="link,shortener,preview,image,og,image,title,open,graph" />
        </MetaTags>
      <Switch>
        <Route path="/redirect/:id" component={App_Redirect}/>
        <Route path="/" component={App_Front} />
      </Switch>
    </Router>
    );
  }
}
 
export default App;
