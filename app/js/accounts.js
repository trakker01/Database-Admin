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
if (auth === 'false' || auth === null) {
  window.location.replace('http://localhost:3000/')
}

const querySnapshot = await getDocs(collection(database, 'Accounts'))
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
console.log(docArray)

docArray.forEach(element => addToPage(element))

//add account documents to page
async function addToPage (element) {
  const sortedElement = {
    id: element.ID,
    iban: element.IBAN,
    cardNumber: element.CardNumber,
    name: element.Name,
    balance: element.Balance,
    cw: element.CW,
    expirationDate: element.ExpirationDate,
    phoneNumber: element.PhoneNumber
  }

  console.log('doc', element)

  const newListItem = document.createElement('div')
  newListItem.classList.add('row')
  listHolder.appendChild(newListItem)
  //get the value of the each object key
  Object.values(sortedElement).forEach((value, index) => {
    const newValue = document.createElement('div')
    if(index == 0 || index == 2){
      newValue.classList.add('col-2')
    }else{
      newValue.classList.add('col-1')
    }
    newListItem.appendChild(newValue)
    const text = document.createElement('p')
    text.classList.add('list-value-text')
    newValue.appendChild(text)
    text.textContent = value
  })
  //add modify button
  const modifyAccount = document.createElement('div')
  modifyAccount.classList.add('col-1')
  newListItem.appendChild(modifyAccount)
  const modifyButton = document.createElement('button')
  modifyButton.classList.add('btn','btn-warning')
  modifyAccount.appendChild(modifyButton)
  modifyButton.textContent = 'Modify'
  modifyButton.value = element.docID
  modifyButton.addEventListener('click', e => {
    modifyAccountModal.style.display = 'block'
    localStorage.setItem('acc', JSON.stringify(element))
    console.log("acc", element)
  })

  //add delete button
  const newValue = document.createElement('div')
  newValue.classList.add('col-1')
  newListItem.appendChild(newValue)
  const deleteAccount = document.createElement('button')
  deleteAccount.classList.add('btn', 'btn-danger')
  newValue.appendChild(deleteAccount)
  deleteAccount.textContent = 'Delete'
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
      Detalii: "Acest utilizator a sters un cont care avea id-ul contului urmator:",
      ID_Cont: element.ID,
      Balance_Cont: element.Balance,
      IBAN_Cont: element.IBAN,
      CardNumber_Cont: element.CardNumber,
      Name_Cont: element.Name,
      CW_Cont: element.CW,
      ExpirationDate_Cont: element.ExpirationDate,
      PhoneNumber_Cont: element.PhoneNumber,
      Date: actiontime
    })
  })
}

//modify account
modifyAccountForm.addEventListener('submit', async e => {
  e.preventDefault()
  const element = JSON.parse(localStorage.getItem('acc'))
  if (!document.querySelector('#modifyAccountForm .new-card').checked) {
    var date = new Date(); 
    var actiontime = date.getFullYear() + "/" 
      + (date.getMonth()+1) + "/"
      + date.getDate() + " @ "  
      + date.getHours() + ":"  
      + date.getMinutes() + ":" 
      + date.getSeconds();
    const docref1 = await setDoc(doc(database,'Bank-activities',user,'Actions', randString(28)),{
      Detalii: "Acest utilizator a facut modififcari la datele personale la id-ul contului urmator:",
      ID_Cont: element.ID,
      Old_Name_Cont: element.Name,
      Old_Phone_Number: element.PhoneNumber,
      New_Name_Cont: document.querySelector('#modifyAccountForm .name').value,
      New_Phone_Number: document.querySelector('#modifyAccountForm .phone').value,
      IBAN: element.IBAN,
      Date: actiontime
    })
    const docRef = await setDoc(doc(database, 'Accounts', element.docID),{
        Name: document.querySelector('#modifyAccountForm .name').value,
        PhoneNumber: document.querySelector('#modifyAccountForm .phone').value,
        ID: element.ID,
        IBAN: element.IBAN,
        CardNumber: element.CardNumber,
        Balance: element.Balance,
        CW: element.CW,
        ExpirationDate: element.ExpirationDate
      })
      
  } else {
    var date = new Date(); 
    var actiontime = date.getFullYear() + "/" 
      + (date.getMonth()+1) + "/"
      + date.getDate() + " @ " 
      + date.getHours() + ":"  
      + date.getMinutes() + ":" 
      + date.getSeconds();
    const docref1 = await setDoc(doc(database,'Bank-activities',user,'Actions', randString(28)),{
      Detalii: "Acest utilizator a schimbat cardul si a facut modififcari la datele personale la id-ul contului urmator:",
      ID_Cont: element.ID,
      Old_Name_Cont: element.Name,
      Old_Phone_Number: element.PhoneNumber,
      New_Name_Cont: document.querySelector('#modifyAccountForm .name').value,
      New_Phone_Number: document.querySelector('#modifyAccountForm .phone').value,
      IBAN: element.IBAN,
      New_CardNumber: randNumber(1000000000000000, 9999999999999999),
      New_CW: randNumber(100, 999),
      New_ExpirationDate: expirationDate(),
      Old_CardNumber: element.CardNumber,
      Old_CW: element.CW,
      Old_ExpirationDate: element.ExpirationDate,
      Date: actiontime
    })
    const docRef = await setDoc(doc(database, 'Accounts', element.docID),{
        Name: document.querySelector('#modifyAccountForm .name').value,
        PhoneNumber: document.querySelector('#modifyAccountForm .phone').value,
        CardNumber: randNumber(1000000000000000, 9999999999999999),
        CW: randNumber(100, 999),
        ExpirationDate: expirationDate(),
        ID: element.ID,
        IBAN: element.IBAN,
        Balance: element.Balance
      })
  }
  location.reload();
})

//delete account
async function deleteAcc ( id) {
  
  await deleteDoc(doc(database, 'Accounts', id))
  await deleteDoc(doc(database, 'Card-Transfer', id))
  await deleteDoc(doc(database, 'Card-Payments', id))
  location.reload()
}

console.log(user)

//submit account
addAccountForm.addEventListener('submit', async e => {
  e.preventDefault()

  const ID = randString(28);
  const IBAN = createIBAN();
  const Name = document.querySelector('#addAccountForm .name').value;
  const CardNumber = randNumber(1000000000000000, 9999999999999999);
  const CW = randNumber(100,999);
  const PhoneNumber = document.querySelector('#addAccountForm .phone').value
  const Balance = parseInt(document.querySelector('#addAccountForm .balance').value)
  const ExpirationDate = expirationDate()

  //add account to "Accounts" collection
  try{
    const docRef = await setDoc(doc(database, 'Accounts', ID), {
      ID: ID,
      IBAN: IBAN,
      Name: Name,
      CardNumber: CardNumber,
      CW: CW,
      PhoneNumber: PhoneNumber,
      Balance: Balance,
      ExpirationDate: ExpirationDate,
      Active: "true"
    })
    var date = new Date(); 
    var actiontime = date.getFullYear() + "/" 
      + (date.getMonth()+1) + "/"
      + date.getDate() + " @ "  
      + date.getHours() + ":"  
      + date.getMinutes() + ":" 
      + date.getSeconds();
    const docref1 = await setDoc(doc(database,'Bank-activities',user,'Actions', randString(28)),{
      Detalii: "Acest utilizator a creat un cont",
      ID_Cont: ID,
      Name_Cont: Name,
      Balance: Balance,
      IBAN: IBAN,
      ExpirationDate: ExpirationDate,
      Date: actiontime
    })
  }catch{
    const docRef = {
      ID: ID,
      IBAN: IBAN,
      Name: Name,
      CardNumber: CardNumber,
      CW: CW,
      PhoneNumber: PhoneNumber,
      Balance: Balance,
      ExpirationDate: ExpirationDate,
      Active: "true"
    }
    console.log("docRef", docRef)
  }

 // database.collection('Card-Transfer').doc(ID).collection('Received').add({id: 12132 })

  //add account to "Payments" collection
  await setDoc(doc(database, 'Card-Transfer', ID),{})

  await setDoc(doc(database, 'Card-Payments', ID),{}) 

  // await setDoc(doc(database, 'Card-Transfer', ID, 'Received', randString(28)),{})

  // await setDoc(doc(database, 'Card-Transfer', ID, 'Sent', randString(28)),{})

  // await setDoc(doc(database, 'Card-Payments', ID, 'Payments', randString(28)),{})

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
