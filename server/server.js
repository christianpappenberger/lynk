import express from "express";
import fs from "fs";
import path from "path";

import axios from "axios";

const PORT = process.env.PORT || 3000;
const app = express();
const endpoint = "https://jsonbox.io/box_cab91e956884ac790a1e/";

// Weiterleitungsseite generieren
app.get("/redirect/:id", async (req, res) => {
  const id = req.params.id;
  var redirect_url = null;
  var image_url = null;
  var title = null;
  var redirect_count = null;

  // Daten abfragen
  try {
    let details = await axios.get(endpoint + id).then((res) => {
      return [res.data.url, res.data.image_url, res.data.title, res.data.redirect_count];
    });
    redirect_url = details[0];
    image_url = details[1];
    title = details[2];
    redirect_count = details[3];
  } catch (error) {}

  if (redirect_url == null) {
    return res.status(404).send('URL not found.');
  }

  // Count erhöhen
  const jsonString = {
    url: redirect_url,
    image_url: image_url,
    title: title,
    redirect_count: redirect_count + 1
  };

  axios
    .put(endpoint + id, jsonString)
    .then((res) => {
      console.log("Count + 1 erfolgreich angelegt.");
    })
    .catch((err) => {
      console.log("Fehler beim Erhöhen des Counts!");
    });

  fs.readFile(
    path.resolve("./build/index_redirect.html"),
    "utf-8",
    (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Fehler!");
      }

      data = data.replace(/\$OG_TITLE/g, title);
      data = data.replace(
        /\$META_DESCRIPTION/g,
        "Free tool to easily create appealing links with an Open Graph Image and Title for sharing these on social media."
      );
      data = data.replace(
        /\$META_KEYWORDS/g,
        "link,shortener,preview,image,og,image,title,open,graph"
      );
      data = data.replace(/\$OG_IMAGE/g, image_url);
      data = data.replace(/\$OG_URL/g, redirect_url);
      data = data.replace(/\$REFRESH_CONTENT/g, `0;url=${redirect_url}`);

      res.status(200).send(data);
      res.end();
    }
  );
});

// Count für Link zurückgeben
app.get("/redirect/:id/counter", (req, res) => {
  const id = req.params.id;
  
  axios.get(endpoint + id).then((response) => {
    res.send(`This link was used ${response.data.redirect_count} times.`);
    
  }).catch((err) => {
    console.log(err);
  });

});

// Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.use(express.static(path.resolve(__dirname, "../build")));

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
