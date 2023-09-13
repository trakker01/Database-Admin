import { app, database } from './config.js'
import {collection,doc,getDocs,addDoc,deleteDoc,setDoc,updateDoc} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js'

const auth = localStorage.getItem('authSucces')
console.log(auth)
if (auth === 'false' || auth === null) {
  window.location.replace('http://localhost:3000/')
}

const querySnapshot = await getDocs(collection(database, 'Accounts'))
const allPaymentOrders = await getDocs(collection(database, 'Card-Payments'))

const listHolder = document.querySelector('.list-holder')


const docArray = []
const doc1Array = []

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
  docArray.push(account)
})

docArray.forEach(element => getid(element))

async function getid(element){
  doc1Array.push(element.docID)
  const querySnapshot1 = await getDocs(collection(database,'Card-Payments', element.docID, 'Payments'))
  querySnapshot1.forEach(doc =>{
    const account ={
      docTID: doc.id,
      company_name: doc.data().Company_name,
      date: doc.data().Date,
      iban: doc.data().IBAN,
      value: doc.data().Value,
      sender: element.Name
    }
   if( account.iban != 'undefined')
   {
      console.log("element before", account)
      addToPage(account)
    }
    
  })
}

//add account documents to page
async function addToPage (element) {
  console.log('Elementul din baza',element)
  const sortedElement = {
    amount: element.company_name,
    date: element.date,
    iban: element.iban,
    company_name: element.value,
    sender: element.sender
  }

  //console.log('doc', element)

  const newListItem = document.createElement('div')
  newListItem.classList.add('row')
  listHolder.appendChild(newListItem)
  //get the value of the each object key
  Object.values(sortedElement).forEach((value, index) => {
    const newValue = document.createElement('div')
    if(index == 1){
      newValue.classList.add('col-3')
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

