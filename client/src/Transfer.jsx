import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance, privateKey, setPrivateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signature, setSignature] = useState("");
  const [ msgHash, setmsgHash] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);
  async function HashAndSign(){
    try {
      const {
        data : { signature, msgHash }
      } = await server.post(`sign`,{
        sender : address,
        amount : parseInt(sendAmount),
        recipient,
        privateKey
      })
      setSignature(signature)
      setmsgHash(msgHash)
      console.log("Success!")
    } catch (error) {
      alert(error.response.data.message);
    }

  }



  
  async function transfer(evt) {
    evt.preventDefault();
    await HashAndSign();
    
    try {
     const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
        msgHash
      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex)
      alert(ex.response.data.message);

    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Private Key
        <input
          placeholder="Enter The Private Key"
          value={privateKey}
          onChange={setValue(setPrivateKey)}
        ></input>
      </label>
      <div className="balance">Signature : {signature} </div>
      <div className="balance">Message Hash : {msgHash} </div>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
