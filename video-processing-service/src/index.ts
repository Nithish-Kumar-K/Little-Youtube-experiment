import express from "express";
import ffmpeg from "fluent-ffmpeg";
import path from "path";

const app = express();
app.use(express.json());

app.post("/process-video", (req, res) => {
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  if (!inputFilePath || !outputFilePath) {
    return res.status(400).send("Bad request. Missing file path!");
  }


  ffmpeg(inputFilePath)
    .outputOptions('-vf', 'scale=trunc(iw*360/ih/2)*2:360') // ✅ fixed scaling expression
    .outputOptions('-y') // optional: overwrite existing output
    .on('end', function() {
      console.log('Processing finished successfully');
      res.status(200).send('Processing finished successfully');
    })
    .on('error', function(err: any) {
      console.log('An error occurred: ' + err.message);
      res.status(500).send('An error occurred: ' + err.message);
    })
    .save(outputFilePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Little youtube listening  at http://localhost:${port}`);
});
