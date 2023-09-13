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
const user = localStorage.getItem('User')
console.log(auth)
if (auth === 'false' || auth === null) {
  window.location.replace('http://localhost:3000/')
}

const querySnapshot = await getDocs(collection(database, 'Companies'))
const docArray = []

//get elements from page
const listHolder = document.querySelector('.list-header-2.container.text-center')
const showAddModal = document.querySelector('#show-account-modal')
const addAccountModal = document.querySelector('#addAccountModal')
const addAccountForm = document.querySelector('#addAccountForm')
const modifyAccountModal = document.querySelector('#modifyAccountModal')
const modifyAccountForm = document.querySelector('#modifyAccountForm')
const closeBtn = document.querySelector('#addAccountModal .close-btn')
const closeModifyModal = document.querySelector('#modifyAccountModal .close-btn')
const showPrices = document.querySelector('#showInvoices .list-header-2')
const closePrices = document.querySelector('#showInvoice .close-btn')

//show add account modal
showAddModal.addEventListener('click', e => {
  addAccountModal.style.display = 'block'
})

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
    newValue.classList.add('col-3')
    newListItem.appendChild(newValue)
    const text = document.createElement('p')
    text.classList.add('list-value-text')
    newValue.appendChild(text)
    text.textContent = value
  })

  //add modify button
  const modifyAccount = document.createElement('div')
  modifyAccount.classList.add('col-3')
  newListItem.appendChild(modifyAccount)
  const modifyButton = document.createElement('button')
  modifyButton.classList.add('btn','btn-warning')
  modifyAccount.appendChild(modifyButton)
  modifyButton.textContent = 'Add invoice'
  modifyButton.value = element.docID
  modifyButton.addEventListener('click', e => {
    modifyAccountModal.style.display = 'block'
    localStorage.setItem('acc', JSON.stringify(element))
    console.log("acc", element)
  })

  
  //add delete button
  const newValue = document.createElement('div')
  newValue.classList.add('col-3')
  newListItem.appendChild(newValue)
  const deleteAccount = document.createElement('button')
  deleteAccount.classList.add('btn', 'btn-danger')
  newValue.appendChild(deleteAccount)
  deleteAccount.textContent = 'Delete company'
  deleteAccount.addEventListener('click', async e => {
    deleteAcc(element.docID)
    var date = new Date(); 
    var actiontime = date.getFullYear() + "/" 
      + (date.getMonth()+1) + "/"
      + date.getDate() + " @ "  
      + date.getHours() + ":"  
      + date.getMinutes() + ":" 
      + date.getSeconds();
    const docref1 = await setDoc(doc(database,'Bank-activities',user,'Actions', randString(28)),{
      Detalii: "Acest utilizator a sters o companie cu datele urmatoare:",
      IBAN_Company: element.IBAN,
      Name_Company: element.docID,
      Date: actiontime
    })
  })
}
//modify account
modifyAccountForm.addEventListener('submit', async e => {
  e.preventDefault()
  const element = JSON.parse(localStorage.getItem('acc'))
  const colRef = collection(database, 'Companies', element.docID, 'Facturi')

  var date = new Date(); 
    var actiontime = date.getDate() + "/"
                + (date.getMonth()+1)  + "/" 
                + date.getFullYear() + " @ "  
                + date.getHours() + ":"  
                + date.getMinutes() + ":" 
                + date.getSeconds();

    const docref1 = await setDoc(doc(database,'Bank-activities',user,'Actions', randString(28)),{
      Detalii: "Acest utilizator a creat o factura pentru urmatoarea companie:",
      IBAN_Company: element.IBAN,
      Name_Company: element.docID,
      Client_cod_bill: document.querySelector('#modifyAccountForm .client-cod').value,
      Number_bill: document.querySelector('#modifyAccountForm .number').value,
      Series_bill: document.querySelector('#modifyAccountForm .series').value,
      Value: document.querySelector('#modifyAccountForm .value').value,
      Paid: false,
      Date: actiontime
    })

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
async function deleteAcc ( id) {
  await deleteDoc(doc(database, 'Companies', id))
  await deleteDoc(doc(database, 'Card-Transfer', id))
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