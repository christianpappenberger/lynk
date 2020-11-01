import express from "express";
import fs from "fs";
import path from "path";

import axios from "axios";

const PORT = process.env.PORT || 3000;
const app = express();

// Home
app.get("/", (req, res) => {
  
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

// Weiterleitungsseite generieren
app.get("/redirect/:id", async (req, res) => {
  const id = req.params.id;
  const endpoint = "https://jsonbox.io/box_13933b959897187a4c39/";
  var redirect_url = null;
  var image_url = null;

  // Daten abfragen
  try {
    let details = await axios.get(endpoint + id).then((res) => {
      return [res.data.url, res.data.image_url];
    });
    redirect_url = details[0];
    image_url = details[1];
  } catch (error) {}

  fs.readFile(
    path.resolve("./build/index_redirect.html"),
    "utf-8",
    (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Fehler!");
      }

      data = data.replace(
        '<div id="root"></div>',
        '<div id="root"><p>hi</p></div>'
      );

      data = data.replace(/\$OG_TITLE/g, "...");
      data = data.replace(
        /\$META_DESCRIPTION/g,
        "Free tool to easily create appealing links with an Open Graph Image and Title for sharing these on social media."
      );
      data = data.replace(
        /\$META_KEYWORDS/g,
        "link,shortener,preview,image,og,image,title,open,graph"
      );
      data = data.replace(/\$OG_IMAGE/g, image_url);

      data = data.replace(/\$REFRESH_CONTENT/g, `0;url=${redirect_url}`);

      res.send(data);
      res.end();
    }
  );
});

app.use(express.static(path.resolve(__dirname, "../build")));

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
