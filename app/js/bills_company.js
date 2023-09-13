import { app, database } from './config.js'
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  setDoc,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js'

const auth = localStorage.getItem('authSucces')
console.log(auth)
if (auth === 'false' || auth === null) {
  window.location.replace('http://localhost:3000/')
}

const querySnapshot = await getDocs(collection(database, 'Companies'))
const docArray = []

//get elements from page
const listHolder = document.querySelector('.list-header-2.container.text-center')
const addAccountModal = document.querySelector('#addAccountModal')
const addAccountForm = document.querySelector('#addAccountForm')
const modifyAccountModal = document.querySelector('#modifyAccountModal')
const modifyAccountForm = document.querySelector('#modifyAccountForm')
const closeBtn = document.querySelector('#addAccountModal .close-btn')
const closeModifyModal = document.querySelector('#modifyAccountModal .close-btn')
const showPrices = document.querySelector('#showInvoices .list-header-2')
const closePrices = document.querySelector('#showInvoice .close-btn')

closeBtn.addEventListener('click', e=>{
  e.preventDefault()
  addAccountModal.style.display = 'none'
})

closeModifyModal.addEventListener('click', e=>{
  e.preventDefault()
  modifyAccountModal.style.display = 'none'
})

//get accounts
querySnapshot.forEach(doc => {
    // doc.data() is never undefined for query doc snapshots
    const account = {
      docID: doc.id,
      IBAN: doc.data().IBAN
    }
  
    console.log("adadadasdad",account)
    docArray.push(account)
  })
  console.log(docArray)
  
  docArray.forEach(element => addToPage(element))
  
  //add account documents to page
  async function addToPage (element) {
    
    const querySnapshot1 = await getDocs(collection(database, 'Companies',element.docID,'Facturi'))
    
    

    const sortedElement = {
      ID: element.docID,
      IBAN: element.IBAN
    }

  console.log('docx', element)

  const newListItem = document.createElement('div')
  newListItem.classList.add('row')
  listHolder.appendChild(newListItem)
  //get the value of the each object key
  Object.values(sortedElement).forEach((value, index) => {
    const newValue = document.createElement('div')
    newValue.classList.add('col-2')
    newListItem.appendChild(newValue)
    const text = document.createElement('p')
    text.classList.add('list-value-text')
    newValue.appendChild(text)
    text.textContent = value
  })

  addbill(element.docID,querySnapshot1)
  

//   //add modify button
//   const modifyAccount = document.createElement('div')
//   modifyAccount.classList.add('col-3')
//   newListItem.appendChild(modifyAccount)
//   const modifyButton = document.createElement('button')
//   modifyButton.classList.add('btn','btn-warning')
//   modifyAccount.appendChild(modifyButton)
//   modifyButton.textContent = 'Add invoice'
//   modifyButton.value = element.docID
//   modifyButton.addEventListener('click', e => {
//     modifyAccountModal.style.display = 'block'
//     localStorage.setItem('acc', JSON.stringify(element))
//     console.log("acc", element)
//   })

  
//   
}

async function addbill (company,bill){
    bill.forEach(doc1=>{
        const ubill={
            ID: doc1.id,
            IBAN: doc1.data().IBAN,
            COD: doc1.data().Client_cod,
            NUMBER: doc1.data().Number,
            PAID: doc1.data().Paid,
            SERIES: doc1.data().Series,
            VALUE: doc1.data().Value
        }
        console.log('docxF', ubill)

        const newListItem = document.createElement('div')
        newListItem.classList.add('row')
        listHolder.appendChild(newListItem)
        //get the value of the each object key
        Object.values(ubill).forEach((value, index) => {
            if(index == 0 || index == 1){
          const newValue = document.createElement('div')
          newValue.classList.add('col-2')
          newListItem.appendChild(newValue)
          const text = document.createElement('p')
          text.classList.add('list-value-text')
          newValue.appendChild(text)
          text.textContent = value}
          else{
            const newValue = document.createElement('div')
          newValue.classList.add('col-1')
          newListItem.appendChild(newValue)
          const text = document.createElement('p')
          text.classList.add('list-value-text')
          newValue.appendChild(text)
          text.textContent = value
        }
          
        })
    })

}
//modify account
modifyAccountForm.addEventListener('submit', async e => {
  e.preventDefault()
  const element = JSON.parse(localStorage.getItem('acc'))
  const colRef = collection(database, 'Companies', element.docID, 'Facturi')

  const docRef = await setDoc(doc(colRef),{
    IBAN: element.IBAN,
    Client_cod: document.querySelector('#modifyAccountForm .client-cod').value,
    Number: document.querySelector('#modifyAccountForm .number').value,
    Series: document.querySelector('#modifyAccountForm .series').value,
    Value: document.querySelector('#modifyAccountForm .value').value,
    Paid: false
  })
  location.reload();
})

//delete account
async function deleteAcc (company ,id) {
  await deleteDoc(doc(database, 'Companies', company,'Facturi',id))
  location.reload()
}

//submit account
addAccountForm.addEventListener('submit', async e => {
  e.preventDefault()

  const Name = document.querySelector('#addAccountForm .name').value;
  //const IBAN = document.querySelector('#addAccountForm .iban').value;

  const colRef = collection(database, 'Companies')

  //add account to "Accounts" collection
  try{
    const docRef = await setDoc(doc(colRef, Name), {
      Name: Name,
      IBAN: createIBAN()
    })
  }catch{
    const docRef = {
        Name: Name,
        IBAN: createIBAN()
    }
    console.log("docRef", docRef)
  }

  await setDoc(doc(database, 'Companies', Name, 'Facturi', randString(28)),{})

  location.reload()
})

console.log(randString(28))

function createIBAN () {
  const firstDigits = randNumber(10, 99)
  const ibanString = 'MBRO'
  const finalDigits = randNumber(100000, 999999)
  return firstDigits + ibanString + finalDigits
}

function randNumber (min, max) {
  return (Math.floor(Math.random() * (max - min)) + min).toString()
}

function randString (length) {
  return [...Array(length + 10)]
    .map(value => (Math.random() * 1000000).toString(36).replace('.', ''))
    .join('')
    .substring(0, length)
}

function expirationDate () {
  const date = new Date()
  const year = ((date.getFullYear() % 100) + 4).toString()
  let month = ''
  if (date.getMonth() < 10) {
    month = `0${date.getMonth().toString()}`
  } else {
    month = date.getMonth()
  }
  return `${month}/${year}`
}
