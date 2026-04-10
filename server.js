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

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})



// ------------------------------------------------------------ SPECIES ------------------------------------------------------------



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
                    client.close();
                })
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.post('/species/:species/races', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("species").updateOne({ name: req.params.species }, { $push: { races: req.body }})
                .then(response => {
                    res.json(response);
                    client.close();
                })
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.delete('/species/:species', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("species").deleteOne({name: req.params.species })
                .then(response => {
                    res.send(response.acknowledged);
                    client.close();
                })
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.delete('/species/:species/race/:race', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("species").updateOne(
                { name: req.params.species },
                { $pull: { races : {  name: req.params.race  }}}
            )
            .then(response => {
                res.send(response.modifiedCount);
                client.close();
            })
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})



// ------------------------------------------------------------ CLASSES ------------------------------------------------------------



app.get('/classes', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("classes").find({}).toArray()
                .then(classes => {
                    res.json(classes);
                    client.close();
                })
                .catch(error => {
                    res.send(`Error fetching classes:' ${error}`);
                    client.close();
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.get('/classes/:name', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("classes").findOne({ name: `${req.params.name}` })
                .then(classes => {
                    res.json(classes);
                    client.close();
                })
                .catch(error => {
                    res.send(`Error fetching class:' ${error}`);
                    client.close();
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.get('/classes/:name/subclasses', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("classes").findOne({ name: `${req.params.name}` })
                .then(classes => {
                    res.json(classes.subclasses);
                    client.close();
                })
                .catch(error => {
                    res.send(`Error fetching class:' ${error}`);
                    client.close();
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.post('/classes', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("classes").insertOne(req.body)
                .then(response => {
                    res.send(response.acknowledged);
                    client.close();
                })
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.post('/classes/:class/subclasses', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("classes").updateOne({ name: req.params.class }, { $push: { "subclasses.selectable": req.body }})
                .then(response => {
                    res.json(response);
                    client.close();
                })
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.delete('/classes/:class', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("classes").deleteOne({name: req.params.class })
                .then(response => {
                    res.send(response.modifiedCount);
                    client.close();
                })
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.delete('/classes/:class/subclass/:subclass', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("classes").updateOne(
                { name: req.params.class },
                { $pull: { "subclasses.selectable": {  name: req.params.subclass  }}}
            )
            .then(response => {
                res.send(response.modifiedCount);
                client.close();
            })
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})



// ------------------------------------------------------------ BACKGROUNDS ------------------------------------------------------------



app.get('/backgrounds', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("backgrounds").find({}).toArray()
                .then(backgrounds => {
                    res.json(backgrounds);
                    client.close();
                })
                .catch(error => {
                    res.send(`Error fetching backgrounds:' ${error}`);
                    client.close();
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.get('/backgrounds/:name', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("backgrounds").findOne({ name: req.params.name })
                .then(backgrounds => {
                    res.json(backgrounds);
                    client.close();
                })
                .catch(error => {
                    res.send(`Error fetching background:' ${error}`);
                    client.close();
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.post('/backgrounds', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("backgrounds").insertOne(req.body)
                .then(response => {
                    res.send(response.acknowledged);
                    client.close();
                })
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.delete('/background/:background', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("backgrounds").deleteOne({name: req.params.background })
                .then(response => {
                    res.send(response.acknowledged);
                    client.close();
                })
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})



// ------------------------------------------------------------ SPELLS ------------------------------------------------------------



app.get('/spells', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("spells").find({}).toArray()
                .then(spells => {
                    res.json(spells);
                    client.close();
                })
                .catch(error => {
                    res.send(`Error fetching spells:' ${error}`);
                    client.close();
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.get('/spells/:name', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("spells").findOne({ name: req.params.name })
                .then(spells => {
                    res.json(spells);
                    client.close();
                })
                .catch(error => {
                    res.send(`Error fetching spell:' ${error}`);
                    client.close();
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.get('/spells/:element', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("spells").findOne({ type: req.params.element })
                .then(spells => {
                    res.json(spells);
                    client.close();
                })
                .catch(error => {
                    res.send(`Error fetching spell:' ${error}`);
                    client.close();
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.post('/spells', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("spells").insertOne(req.body)
                .then(response => {
                    res.send(response.acknowledged);
                    client.close();
                })
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.delete('/spells/:spell', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("spells").deleteOne({name: req.params.spell })
                .then(response => {
                    res.send(response.acknowledged);
                    client.close();
                })
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})



// ------------------------------------------------------------ FEATS ------------------------------------------------------------



app.get('/feats', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("feats").find({}).toArray()
                .then(feats => {
                    res.json(feats);
                    client.close();
                })
                .catch(error => {
                    res.send(`Error fetching feats:' ${error}`);
                    client.close();
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.get('/feats/:name', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("feats").findOne({ name: req.params.name })
                .then(feats => {
                    res.json(feats);
                    client.close();
                })
                .catch(error => {
                    res.send(`Error fetching feat:' ${error}`);
                    client.close();
                });
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.post('/feats', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("feats").insertOne(req.body)
                .then(response => {
                    res.send(response.acknowledged);
                    client.close();
                })
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})

app.delete('/feats/:feat', (req, res) => {
    client.connect()
        .then(connection => {
            connection.db("mechanics").collection("feats").deleteOne({name: req.params.feat })
                .then(response => {
                    res.send(response.acknowledged);
                    client.close();
                })
        })
        .catch(error => {
            res.send(`Error connecting to MongoDB:' ${error}`);
            client.close();
        })
})