require('dotenv').config({ path: './config.env' });
const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
    }
});

const skills = {
    STRENGTH: "Strength",
    DEXTERITY: "Dexterity",
    INTELLIGENCE: "Intelligence",
    WILL: "Will",
}

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})

// Species

app.get('/species', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("species").find({}).toArray()
                .then(species => {
                    res.json(species);
                    client.close();
                })
                .catch(error => {
                    res.send(`Error fetching species:' ${error}`);
                    client.close();
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.get('/species/:name', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("species").findOne({ name: req.params.name })
                .then(species => {
                    res.json(species);
                    client.close();
                })
                .catch(error => {
                    res.send(`Error fetching species:' ${error}`);
                    client.close();
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.get('/species/:name/races', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("species").findOne({ name: req.params.name })
                .then(species => {
                    res.json(species.races);
                    client.close();
                })
                .catch(error => {
                    res.send(`Error fetching species:' ${error}`);
                    client.close();
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.post('/species', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("species").insertOne(req.body)
                .then(response => {
                    res.send(response.acknowledged);
                })
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.put('/species/:species/races', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("species").updateOne({ name: req.params.species }, { $push: { races: req.body }})
                .then(response => {
                    res.json(response);
                })
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

// Classes

app.get('/classes', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("classes").find({}).toArray()
                .then(classes => {
                    res.json(classes);
                })
                .catch(error => {
                    res.send(`Error fetching classes:' ${error}`);
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
        })
})

app.get('/classes/:name', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("classes").findOne({ name: `${req.params.name}` })
                .then(classes => {
                    res.json(classes);
                })
                .catch(error => {
                    res.send(`Error fetching class:' ${error}`);
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
        })
})

app.get('/classes/:name/subclasses', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("classes").findOne({ name: `${req.params.name}` })
                .then(classes => {
                    res.json(classes.subclasses);
                })
                .catch(error => {
                    res.send(`Error fetching class:' ${error}`);
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
        })
})

app.get('/classes/spellcaster/:isSpellcaster', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("classes").find({ "spellcasting.spellcaster": (req.params.isSpellcaster === "true") }).toArray()
                .then(classes => {
                    res.json(classes);
                })
                .catch(error => {
                    res.send(`Error fetching classes:' ${error}`);
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
        })
})

// Backgrounds

app.get('/backgrounds', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("backgrounds").find({}).toArray()
                .then(backgrounds => {
                    res.json(backgrounds);
                })
                .catch(error => {
                    res.send(`Error fetching backgrounds:' ${error}`);
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
        })
})

app.get('/backgrounds/:name', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("backgrounds").findOne({ name: req.params.name })
                .then(backgrounds => {
                    res.json(backgrounds);
                })
                .catch(error => {
                    res.send(`Error fetching background:' ${error}`);
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
        })
})


// Spells

app.get('/spells', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("spells").find({}).toArray()
                .then(spells => {
                    res.json(spells);
                })
                .catch(error => {
                    res.send(`Error fetching spells:' ${error}`);
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
        })
})

app.get('/spells/:name', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("spells").findOne({ name: req.params.name })
                .then(spells => {
                    res.json(spells);
                })
                .catch(error => {
                    res.send(`Error fetching spell:' ${error}`);
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
        })
})

// Feats

app.get('/feats', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("feats").find({}).toArray()
                .then(feats => {
                    res.json(feats);
                })
                .catch(error => {
                    res.send(`Error fetching feats:' ${error}`);
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
        })
})

app.get('/feats/:name', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("feats").findOne({ name: req.params.name })
                .then(feats => {
                    res.json(feats);
                })
                .catch(error => {
                    res.send(`Error fetching feat:' ${error}`);
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
        })
})