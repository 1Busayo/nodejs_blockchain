const Block = require("./block");
const Blockchain = require("./blockchain");
const Transaction = require("./transaction");
const BlockchainNode = require("./BlockchainNode");
const fetch = require("node-fetch")

const express = require("express");
//const bodyParser = require("body-parser");

let port = 3000;

//access the arguments
process.argv.forEach(function(val, index, array) {
  port = array[2];
});

if (port === undefined) {
  port = 3000;
}

const app = express();

let transactions = [];
let nodes = [];

let genesisBlock = new Block();
let blockchain = new Blockchain(genesisBlock);

const middlewares = [
  //layout(),
  //  express.static(path.join(__dirname, 'public')),
  express.urlencoded(),
  express.json()
];
app.use(middlewares);


app.get("/resolve", function(req, res) {
  
nodes.forEach(function(node){
fetch('http://localhost:3000/blockchain')
.then(function(response){

  return response.json()
})
  .then(function(blockchain){
    console.log(blockchain)
  }).catch(err => {
    console.log('Error' + err);
  });

   
})
});



app.post("/nodes/register", function(req, res) {
  let nodesLists = req.body.urls;
  nodesLists.forEach(function(nodeDictionary) {
    let node = new BlockchainNode(nodeDictionary["url"]);
    nodes.push(node);
  });
  res.json(nodes);
});

app.get("/nodes", function(req, res) {
  res.json(nodes);
});

app.get("/", function(req, res) {
  res.send("Hello blockchain server");
});

app.get("/mine", function(req, res) {
  let block = blockchain.getNextBlock(transactions);
  blockchain.addBlock(block);
  transactions = []
  res.json(block);
});

app.post("/transactions", function(req, res) {
  let to = req.body.to;
  let from = req.body.from;
  let amount = req.body.amount;

  let transaction = new Transaction(from, to, amount);

  transactions.push(transaction);

  res.json(transactions);
});

app.get("/blockchain", function(req, res) {
  res.json(blockchain);
  //     const transaction = new Transaction('Mary','Jerry',100)
  //     const genesisBlock = new Block();
  //     const blockchain = new Blockchain(genesisBlock)
  //     let block = blockchain.getNextBlock([transaction])
  //     blockchain.addBlock(block)
  //     let anotherTransaction = new Transaction("Azam","jerry",10)
  //     let block1 = blockchain.getNextBlock([anotherTransaction,transaction])
  //     blockchain.addBlock(block1)
  //    res.json(blockchain)
});

app.listen(port, function() {
  console.log("Server has started on port :" + port);
});
