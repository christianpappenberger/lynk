import React, { Component } from "react";
import axios from "axios";
import MetaTags from "react-meta-tags";

const URL_JSONBOX = "https://jsonbox.io/box_13933b959897187a4c39/";

class App_Redirect extends Component {
  state = {
    title: "Test Title",
    redirect_url: null,
    image_url: null,
  };

  componentDidMount() {
    // Daten für diese URL abfragen
    axios
      .get(URL_JSONBOX + this.props.match.params.id)
      .then((res) => {
        console.log(res);
        this.setState({
          redirect_url: res.data.url,
          image_url: res.data.image_url,
        });
      })
      .catch((err) => {
        alert("Die Daten konnten nicht abgerufen werden.");
      });
  }

  render() {
    return (
        <React.Fragment>
      <MetaTags>
        {/* <title>{this.state.title}</title>
            <meta property="og:title" content={this.state.title} />
            <meta property="og:image" content={this.state.image_url} />
            <meta property="og:description" content="Beschreibung Test Tes t123" />
            <meta property="og:url" content={this.state.redirect_url} />
            <meta property="og:type" content="article" />
        
            { this.state.redirect_url !== null && <h1>Test</h1>
               //<meta http-equiv="refresh" content = {"0;url="+this.state.redirect_url} />
            } */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Süddeutsche.de" />
        <meta property="og:locale" content="de_DE" />
        <meta
          property="og:title"
          content="Corona-Regeln - Es drohen viele Klagen"
        />
        <meta
          property="og:description"
          content="Die neuen Beschlüsse zur Pandemie-Eindämmung könnten eine Welle von Klagen auslösen. Die Erfolgschancen sind kaum zu prognostizieren."
        />
        <meta
          property="og:image"
          content="https://www.sueddeutsche.de/image/sz.1.5098888/1200x675?v=1604067234"
        />
        <meta property="og:image:height" content="675" />
        <meta property="og:image:width" content="1200" />
        <meta
          property="og:url"
          content="https://www.sueddeutsche.de/politik/corona-regeln-klagen-1.5098887"
        />
      </MetaTags>
        <p>Sie werden weitergeleitet zu. Bitte haben Sie Geduld.</p>
      </React.Fragment>

    );
  }
}

export default App_Redirect;
