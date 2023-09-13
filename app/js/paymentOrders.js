import { app, database } from './config.js'
import {collection,doc,getDocs,addDoc,deleteDoc,setDoc,updateDoc} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js'

const auth = localStorage.getItem('authSucces')
const user = localStorage.getItem('User')
console.log(auth)
if (auth === 'false' || auth === null) {
  window.location.replace('http://localhost:3000/')
}

const querySnapshot = await getDocs(collection(database, 'Accounts'))
const allPaymentOrders = await getDocs(collection(database, 'Ordine-de-plata'))

const listHolder = document.querySelector('.list-holder')
const showModal = document.querySelector('#show-modal')
const addPaymentModal = document.querySelector('#addPaymentModal')
const addPaymentForm = document.querySelector("#addPaymentForm")
const closeBtn = document.querySelector('.close-btn')

//show add account modal
showModal.addEventListener('click', e => {
  addPaymentModal.style.display = 'block'
})

closeBtn.addEventListener('click', e=>{
  addPaymentModal.style.display = 'none'
})

addPaymentForm.addEventListener("submit", e=>{
  e.preventDefault()
  createPaymentOrder()
})

const docArray = []
const payArray = []

//get accounts
querySnapshot.forEach(doc => {
  // doc.data() is never undefined for query doc snapshots
  const account = {
    docID: doc.id,
    ID: doc.data().ID,
    IBAN: doc.data().IBAN,
    CardNumber: doc.data().CardNumber,
    Name: doc.data().Name,
    Balance: doc.data().Balance,
    CW: doc.data().CW,
    ExpirationDate: doc.data().ExpirationDate,
    PhoneNumber: doc.data().PhoneNumber
  }

  console.log(account)
  docArray.push(account)
})

//get paymentOrders
allPaymentOrders.forEach(doc => {
  // doc.data() is never undefined for query doc snapshots
  const paymentOrder = {
    docID: doc.id,
    CodFiscal: doc.data().CodFiscal,
    Details: doc.data().Details,
    MoneyTransfered: doc.data().MoneyTransfered,
    ReceiverName: doc.data().ReceiverName,
    ReceiverIBAN: doc.data().ReceiverIBAN,
    SenderName: doc.data().SenderName,
    SenderIBAN: doc.data().SenderIBAN
  }
  payArray.push(paymentOrder)
})

payArray.forEach(element => addToPage(element))

async function createPaymentOrder(){
  const senderName = document.querySelector("#addPaymentForm .name").value
  const senderIban = document.querySelector("#addPaymentForm .sender").value
  const receiverIban = document.querySelector("#addPaymentForm .receiver").value
  const moneySent = document.querySelector("#addPaymentForm .balance").value
  const details = document.querySelector("#addPaymentForm .details").value
  const nameReceiver = document.querySelector("#addPaymentForm .name-receiver").value

  const colRef = collection(database, 'Ordine-de-plata')
  var fiscal=createFeeID()
  var date = new Date();
  var actiontime = date.getFullYear() + "/" 
    + (date.getMonth()+1) + "/"
    + date.getDate() + " @ "  
    + date.getHours() + ":"  
    + date.getMinutes() + ":" 
    + date.getSeconds();
  const docref1 = await setDoc(doc(database,'Bank-activities',user,'Actions', randString(28)),{
    Detalii: "Acest utilizator a creat un ordin de plata:",
    Fiscal_cod: fiscal,
    Name_Sender: senderName,
    IBAN_Sender: senderIban,
    Amount: moneySent,
    Name_Receiver: nameReceiver,
    IBAN_Receiver: receiverIban,
    Details: details,
    Date: actiontime
    })

  await setDoc(doc(colRef),{
      CodFiscal: fiscal,
      SenderName: senderName,
      SenderIBAN: senderIban,
      MoneyTransfered: moneySent,
      ReceiverName: nameReceiver,
      ReceiverIBAN: receiverIban,
      Details: details
  })

  let senderAccount = {};
  let receiverAccount = {};

  docArray.forEach(element=>{
    console.log(element)
    if(element.IBAN == senderIban){
      senderAccount = element
    };
    if(element.IBAN == receiverIban){
      receiverAccount = element
    }
  })
  console.log('sender', senderAccount)
  console.log('receiver', receiverAccount)

  //add card-payment for sender account
  try{
    const docRef = collection(database, 'Card-Transfer', senderAccount.docID, 'Sent');

    await setDoc(doc(docRef), { 
      Amount: parseFloat(moneySent),
      Details: details,
      IBAN: receiverIban,
      IBANSender: senderIban,
      Recipient: nameReceiver 
    })
  }catch{
    console.log('Transfer for sender failed')
  }

  //add card-payment for receiver account
  try{
    const docRef = collection(database, 'Card-Transfer', receiverAccount.docID, 'Received');

    await setDoc(doc(docRef), { 
      Amount: parseFloat(moneySent),
      Details: details,
      IBAN: senderIban,
      IBANReceiver: receiverIban,
      Sender: senderName
    })
  }catch{
    console.log('Transfer for receiver failed')
  }

  //update account balance for sender
  let newBalance = senderAccount.Balance - parseFloat(moneySent)
  
  await setDoc(doc(database, 'Accounts', senderAccount.docID), {
    ID: senderAccount.ID,
    Name: senderAccount.Name,
    IBAN: senderAccount.IBAN,
    CardNumber: senderAccount.CardNumber,
    CW: senderAccount.CW,
    ExpirationDate: senderAccount.ExpirationDate,
    Balance: newBalance,
    PhoneNumber: senderAccount.PhoneNumber
  });

  newBalance = receiverAccount.Balance + parseFloat(moneySent)

  await setDoc(doc(database, 'Accounts', receiverAccount.docID), {
    ID: receiverAccount.ID,
    Name: receiverAccount.Name,
    IBAN: receiverAccount.IBAN,
    CardNumber: receiverAccount.CardNumber,
    CW: receiverAccount.CW,
    ExpirationDate: receiverAccount.ExpirationDate,
    Balance: newBalance,
    PhoneNumber: receiverAccount.PhoneNumber
  });

  location.reload()
}



//add account documents to page
async function addToPage (element) {
  const sortedElement = {
    CodFiscal: element.CodFiscal,
    Details: element.Details,
    MoneyTransfered: element.MoneyTransfered,
    ReceiverName: element.ReceiverName,
    ReceiverIBAN: element.ReceiverIBAN,
    SenderName: element.SenderName,
    SenderIBAN: element.SenderIBAN
  }

  console.log('doc', element)

  const newListItem = document.createElement('div')
  newListItem.classList.add('row')
  listHolder.appendChild(newListItem)
  //get the value of the each object key
  Object.values(sortedElement).forEach((value, index) => {
    const newValue = document.createElement('div')
    if(index == 2 || index == 0){
      newValue.classList.add('col-1')
    }else{
      newValue.classList.add('col-2')
    }
    newListItem.appendChild(newValue)
    const text = document.createElement('p')
    text.classList.add('list-value-text')
    newValue.appendChild(text)
    text.textContent = value
  })
}

function randNumber (min, max) {
  return (Math.floor(Math.random() * (max - min)) + min).toString()
}

function createFeeID () {
  const firstDigits = randNumber(100, 990)
  const ibanString = 'FFID'
  const finalDigits = randNumber(1000000, 9999999)
  return firstDigits + ibanString + finalDigits
}

