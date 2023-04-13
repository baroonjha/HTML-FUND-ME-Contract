

// in frontend javascript you can't use require
// use import
// import { ethers } from "./ethers-5.1.esm.min"
// import { ethers } from "./ethers-5.1.esm.min"
// import { ethers } from "https://cdn.ethers.io/lib/ethers-5.1.esm.min.js"
import { ethers } from "/ethers-5.1.esm.min.js";
import {abi} from "./constants.js"
import {contractAddress} from "./constants.js"



const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")


connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
// console.log(ethers)



async function connect(){

    if(typeof window.ethereum !== "undefined")
    {
        // console.log("Metamask Here")
      await   window.ethereum.request({method:"eth_requestAccounts"})
        // console.log("Connected !")
        connectButton.innerHTML = "Connected !"
    }else
    {
        // console.log("Not metamask")
        fundButton.innerHTML = "Please download metamask wallet"
    }
}

async function fund(){
        const ethamount = document.getElementById("ethamount").value
    console.log(`Funding with ${ethamount}....`)
    if(typeof window.ethereum !=="undefined"){
        //provider / connection to the blockchain
        //signer / wallet 
        //contract that we are interacting with
        //ABI and address
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        // console.log(signer)
        const contract =new ethers.Contract(contractAddress,abi,signer)
        try{
        const transactionResponse = await contract.fund({
            value:ethers.utils.parseEther(ethamount),
        }) 
         await listenForTransactionMine(transactionResponse,provider)
         console.log("Done")   
        }catch(error){
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse,provider){
       console.log(`mining ${transactionResponse.hash}.....`)
       return new Promise((resolve,reject)=>{

           provider.once(transactionResponse.hash, (transactionReceipt) =>{
            console.log(`Completed with ${transactionReceipt.confirmation} confirmation`
            )
            resolve()
           })
       })
}

async function getBalance(){
    if(typeof window.ethereum !=="undefined")
    {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))

    }

}

async function withdraw(){
    if(typeof window.ethereum !=="undefined")
    {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract =new ethers.Contract(contractAddress,abi,signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse,provider)
        } catch (error) {
            console.log(error)
        }
       

    }
}