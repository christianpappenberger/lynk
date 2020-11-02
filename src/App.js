import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import axios from "axios";
import { MetaTags } from "react-meta-tags";

const BASE_URL = "https://lynk-app.herokuapp.com/";
const UPLOAD_URL_CLOUDINARY =
  "https://api.cloudinary.com/v1_1/dewipehxt/upload";
const UPLOAD_URL_JSONBOX = "https://jsonbox.io/box_cab91e956884ac790a1e";

class App extends Component {

  constructor(props) {
    // Required step: always call the parent class' constructor
    super(props);

    this.state = {
      url: null,
      image: null,
      redirect_title: null,
      uploaded_image_url: null,
      new_entry_status: null,
      new_entry_redirect_url: null,
      copied_success: null
    };
  }

  handleTitleInput = (title) => {
    this.setState({redirect_title: title});
  };

  handleURLInput = (string) => {
    this.setState({ url: string });
  };

  handleImageUpload = (file) => {
    this.setState({ image: file });
  };

  handleSubmit = (form) => {
    form.preventDefault();

    // Beide Fehler sind erforderlich
    // kein Check erforderlich, ob beide Felder ausgefüllt sind
    const formData = new FormData();
    formData.append("file", this.state.image);
    formData.append("upload_preset", "cc7ldihr");

    axios
      .post(UPLOAD_URL_CLOUDINARY, formData)
      .then((res) => {
        this.setState({ uploaded_image_url: res.data.url });

        // Der finale Request folgt jetzt
        this.sendNewEntry();
      })
      .catch((err) => {
        alert("Das Bild konnte nicht hochgeladen werden.");
      });
  };

  sendNewEntry() {
    const jsonString = {
      url: this.state.url,
      image_url: this.state.uploaded_image_url,
      title: this.state.redirect_title,
      redirect_count: 0
    };

    axios
      .post(UPLOAD_URL_JSONBOX, jsonString)
      .then((res) => {
        console.log("Eintrag erfolgreich angelegt.");
        this.setState({ new_entry_status: "success" });
        const redirect_link = BASE_URL + "redirect/" + res.data._id;
        this.setState({ new_entry_redirect_url: redirect_link });
      })
      .catch((err) => {
        alert("Fehler beim Absenden!");
      });
  }

  copyClipboard = link => {
    navigator.clipboard.writeText(link)
    this.setState({copied_success: true});
  }

  render() {
    let buttonClasses = "btn center btn-";
    if (this.state.new_entry_status == null) {
      buttonClasses += "light";
    } else if (this.state.new_entry_status == "success") {
      buttonClasses += "success";
    }

    return (
      <React.Fragment>
        <MetaTags>
        <title>Lynk - Add Preview Images to Links</title>
        <meta name="description" content="Free tool to easily create appealing links with an Open Graph Image and Title for sharing these on social media." />
        <meta name="keywords" content="link,shortener,preview,image,og,image,title,open,graph" />
        <meta name="robots" content="noindex,nofollow" />
        </MetaTags>
        <div className="container">
          <header>
            <p className="title">Lynk</p>
          </header>
          <p>
            Just enter your lynk with a title and we'll generate a new one which will have
            the image you provided as a preview.
          </p>
          <form
            className="col-md-6 mx-auto"
            onSubmit={(e) => this.handleSubmit(e)}
            action="POST"
          >
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="inputTitle"
                name="inputTitle"
                aria-describedby="title"
                placeholder="Preview title"
                required
                onChange={(e) => this.handleTitleInput(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="url"
                className="form-control"
                id="inputURL"
                name="inputURL"
                aria-describedby="emailHelp"
                placeholder="https://..."
                required
                onChange={(e) => this.handleURLInput(e.target.value)}
              />
            </div>
            <div className="input-group mb-3">
              <div className="custom-file">
                <input
                  type="file"
                  className="custom-file-input"
                  id="inputGroupFile02"
                  accept="image/*"
                  name="image"
                  required
                  onChange={(e) => this.handleImageUpload(e.target.files[0])}
                />
                <label
                  className="custom-file-label"
                  htmlFor="inputGroupFile02"
                  aria-describedby="inputGroupFileAddon02"
                >
                  {this.state.image === null
                    ? "Choose preview image"
                    : this.state.image.name}
                </label>
              </div>
            </div>

            <small id="emailHelp" className="form-text text-muted my-3">
              We'll never share your data with anyone else.
            </small>
            <button
              type="submit"
              className={buttonClasses}
              disabled={this.state.new_entry_status == "success" ? true : false}
            >
              {this.state.new_entry_status == "success" ? "Done!" : "Generate"}
            </button>
          </form>

          <div className="card col-md-6 mx-auto m-4" hidden={(this.state.new_entry_redirect_url == null) ? true : false}>
            <div className="card-body">
              This is your new lynk: 
              <span>{this.state.new_entry_redirect_url}</span>
              <br /><br />
              <button type="button" onClick={() => this.copyClipboard(this.state.new_entry_redirect_url)} className="btn btn-secondary btn-sm">
                {(this.state.copied_success == null) ? "Copy":"Copied"}
                </button>
              </div>
          </div>
        </div>

        <footer className="footer">
          <img src="https://www.adweko.com/site/assets/files/1/adweko_logo_produkts.svg" style={{ width: 100 }} alt="Logo" />
          <div className="container">ADWEKO 2020 - Maximilian Hauck / Christian Pappenberger</div>
        </footer>
      </React.Fragment>
    );
  }
}

export default App;
