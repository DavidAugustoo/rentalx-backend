import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
});

app.post("/courses", (req, res) => {
    const { name } = req.body;

    return res.json({ name });
});

app.listen(3333, () => console.log("Server is running"));
