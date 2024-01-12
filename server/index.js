const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const EthCrypto = require('eth-crypto')

app.use(cors());
app.use(express.json());

const balances = {
  "0xbe610753d8C09e23E3DC0585181063C25F18658c": 100,
  "0x443218fc65a1440Ba6A4d0c222BA477bA6416E88": 50,
  "0xB2C72B1d15D53bd294E61B01B2BcF67BDC39EA33": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/sign",(req,res) => {
  const { sender, recipient, privateKey, amount } = req.body;
  try{
  const message = {
    toAddress : recipient,
    fromAddress : sender,
    sendAmount : amount,
    timeStamp : new Date()
  }
  const msgHash = EthCrypto.hash.keccak256(JSON.stringify(message));
  const signature = EthCrypto.sign(privateKey,msgHash);
  res.send({signature,msgHash})
} catch (err){
  res.status(400).send({message : "Enter The Private Key"})
}


})

app.post("/send", (req, res) => {
  const { sender, amount, recipient,signature,msgHash} = req.body;

  try {
    const publicKey = EthCrypto.recoverPublicKey(signature,msgHash);
    const senderAddress = EthCrypto.publicKey.toAddress(publicKey)
    if(senderAddress != sender ){
      res.status(401).send({message : "Private Key Unauthorized!"})
    }else{
      setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
    }

  } catch (error) {
  }
  
}
);

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
