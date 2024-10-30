import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const imageAPIKey = "DbhncB2kueXH2yMClHSgWel8oDdQ5zMgM6JZOKrjr4ciZZJrMveFL2Im";
const config = {
    headers: { Authorization: imageAPIKey },
};

app.get("/", async (req, res) => {
    try {
        const response = await axios.get("http://www.thecocktaildb.com/api/json/v1/1/list.php?c=list");
        console.log(response.data);
        res.render("index.ejs", {categories: response.data});
    } catch (error) {
        console.log("Error: ", error)
    }
});

app.get("/recipe", async (req, res) => {
    try {
        const pressed = req.query["type"];
        
        const response1 = await axios.get("http://www.thecocktaildb.com/api/json/v1/1/filter.php", {
            params: { c: pressed }
        });
        const rand = Math.floor(Math.random() * response1.data.drinks.length);
        const drink = response1.data.drinks[rand];
        const drinkId = drink.idDrink;
        console.log("drink",response1.data.drinks.length, " id ", drinkId);

        const response2 = await axios.get("http://www.thecocktaildb.com/api/json/v1/1/lookup.php?", {
            params: { i: drinkId}
        });
        console.log("details ",response2.data);
        
        res.render("recipe.ejs", {drink: response2.data.drinks[0]});
    } catch (error) {
        console.log("Error: ", error)
    }
});

function getRandom(size) {
    return Math.floor(Math.random() * size);
}

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
