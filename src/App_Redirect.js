import React, { Component } from "react";
import axios from "axios";
import MetaTags from 'react-meta-tags';

const URL_JSONBOX = "https://jsonbox.io/box_13933b959897187a4c39/";

class App_Redirect extends Component {

  state = {
    title: "Test Title",
    redirect_url: null,
    image_url: null
  };

  componentDidMount() {
    // Daten für diese URL abfragen
    axios
      .get(URL_JSONBOX + this.props.match.params.id)
      .then((res) => {
        console.log(res);
        this.setState({ redirect_url: res.data.url, image_url: res.data.image_url});
      })
      .catch((err) => {
        alert("Die Daten konnten nicht abgerufen werden.");
      });
  }

  render() {
    return (
        <MetaTags>
            <title>{this.state.title}</title>
            <meta property="og:title" content={this.state.title} />
            <meta property="og:image" content={this.state.image_url} />
            { this.state.redirect_url !== null && <p></p>
               // <meta http-equiv="refresh" content = {"0;url="+this.state.redirect_url} />
            }
          </MetaTags>
    );
  }
}

export default App_Redirect;
