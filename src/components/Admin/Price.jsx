// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';

// function Commodity(props) {
//     const [open, setOpen] = useState(false);
//     const [openDeleteModal, setOpenDeleteModal] = useState(false);

//     const { gold, silver, goldAsking, goldBidding, silverAsking, silverBidding } = props;

//     const [goldGMValueUSD, setGoldGMValueUSD] = useState()
//     const [goldGMValueAED, setGoldGMValueAED] = useState()
//     const [silverGMValueUSD, setSilverGMValueUSD] = useState()
//     const [silverGMValueAED, setSilverGMValueAED] = useState()

//     const [metal, setMetal] = useState('Gold');
//     const [purity, setPurity] = useState('9999');
//     const [weight, setWeight] = useState('GM')
//     const [unit, setUnit] = useState(1)

//     const [buyPremiumUSD, setBuyPremiumUSD] = useState()
//     const [buyPremiumAED, setBuyPremiumAED] = useState()
//     const [sellPremiumUSD, setSellPremiumUSD] = useState()
//     const [sellPremiumAED, setSellPremiumAED] = useState()

//     const [sellAEDInput, setSellAEDInput] = useState()
//     const [sellUSDInput, setSellUSDInput] = useState()
//     const [buyAEDInput, setBuyAEDInput] = useState()
//     const [buyUSDInput, setBuyUSDInput] = useState()

//     const [saveBtn, setSaveBtn] = useState(true)
//     const [saveChangesBtn, setSaveChangesBtn] = useState(false)
//     const [confirmDelete, setConfirmDelete] = useState('')
//     const [updateCommodityID, setUpdateCommodityID] = useState()

//     const [commodities, setCommodities] = useState([]);

//     const { user } = useContext(AuthContext);
//     const { firebase } = useContext(FirebaseContext);


//     const fetchMetalPrices = async () => {
//         const apiKey = '4a8f8fa4a941a1adfe60879e295c6078';
//         const url = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=IND,XAU,XAG`;
    
//         try {
//             const response = await axios.get(url);
//             const prices = response.data.rates;
//             return {
//                 gold: prices.XAU,
//                 silver: prices.XAG
//             };
//         } catch (error) {
//             console.error('Error fetching metal prices:', error);
//             return {
//                 gold: null,
//                 silver: null
//             };
//         }
//     };

//     const handleOpen = () => {
//         setOpen(true);
//         calculateRates();
//         setSaveBtn(true);
//         setSaveChangesBtn(false);
//     };

//     const handleClose = () => {
//         setOpen(false);
//         resetForm();
//     };

//     function resetForm() {
//         setMetal('Gold');
//         setPurity('9999');
//         setWeight('GM');
//         setUnit(1);

//         setBuyPremiumUSD('');
//         setBuyPremiumAED('');
//         setSellPremiumUSD('');
//         setSellPremiumAED('');

//         setSellAEDInput('');
//         setSellUSDInput('');
//         setBuyAEDInput('');
//         setBuyUSDInput('');
//     }

//     const calculateRates = () => {
//         performCalculation();
//     };

//     async function fetchCommodities() {
//         const uid = user.uid;
    
//         try {
//             const response = await fetch(`/api/commodities/${uid}`);
//             const commoditiesArray = await response.json();
//             setCommodities(commoditiesArray);
//         } catch (error) {
//             console.error('Error fetching commodities:', error);
//         }
//     }

//     const saveCommodityData = async () => {
//         const newCommodity = {
//             uid: user.uid,
//             metal: metal,
//             purity: purity,
//             weight: weight,
//             unit: unit,
//             sellAED: sellAEDInput,
//             buyAED: buyAEDInput,
//             buyPremium: buyPremiumAED || 0,
//             sellPremium: sellPremiumAED || 0,
//         };
    
//         try {
//             const response = await fetch('/api/commodities', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(newCommodity),
//             });
    
//             if (response.ok) {
//                 console.log('Commodity saved successfully');
//                 fetchCommodities();
//                 setOpen(false);
//                 resetForm();
//             } else {
//                 console.error('Error saving commodity:', response.statusText);
//             }
//         } catch (error) {
//             console.error('Error saving commodity:', error);
//         }
//     };

//     const updateCommodityData = async () => {
//         const updatedCommodity = {
//             uid: user.uid,
//             metal: metal,
//             purity: purity,
//             weight: weight,
//             unit: unit,
//             sellAED: sellAEDInput,
//             buyAED: buyAEDInput,
//             buyPremium: buyPremiumAED || 0,
//             sellPremium: sellPremiumAED || 0,
//         };
    
//         try {
//             const response = await fetch(`/api/commodities/${updateCommodityID}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(updatedCommodity),
//             });
    
//             if (response.ok) {
//                 console.log('Commodity updated successfully');
//                 fetchCommodities();
//                 setOpen(false);
//                 resetForm();
//             } else {
//                 console.error('Error updating commodity:', response.statusText);
//             }
//         } catch (error) {
//             console.error('Error updating commodity:', error);
//         }
//     };


//     const confirmDeleteBtn = async () => {
//         if (confirmDelete) {
//             try {
//                 const response = await fetch(`/api/commodities/${confirmDelete}`, {
//                     method: 'DELETE',
//                 });
    
//                 if (response.ok) {
//                     console.log('Commodity deleted successfully');
//                     setOpenDeleteModal(false);
//                     fetchCommodities();
//                 } else {
//                     console.error('Error deleting commodity:', response.statusText);
//                 }
//             } catch (error) {
//                 console.error('Error deleting commodity:', error);
//             }
//         }
//     };

//     useEffect(() => {
//         fetchCommodities();
//     }, [user]);

//     // Function to Perform Calculation for Gold and Silver
//     const performCalculation = () => {
//         let unitMultiplier = 1;

//         if (weight === "GM") {
//             unitMultiplier = 1;
//         } else if (weight === "KG") {
//             unitMultiplier = 1000;
//         } else if (weight === "TTB") {
//             unitMultiplier = 116.6400;
//         } else if (weight === "TOLA") {
//             unitMultiplier = 11.664;
//         } else if (weight === "OZ") {
//             unitMultiplier = 31.1034768;
//         }

//         if (metal === 'Silver' || metal === 'Silver Kilobar') {
//             const goldUSDResult = silverBidding;
//             const calculatedRate = ((goldUSDResult) / 31.1035 * 3.67 * unit * unitMultiplier) * (purity / Math.pow(10, purity.length)) + parseFloat(buyPremiumAED || 0);

//             const sellAEDInputValue = parseFloat(calculatedRate).toFixed(4);
//             const sellUSDInputValue = (calculatedRate / 3.67).toFixed(4);

//             setSellAEDInput(sellAEDInputValue);
//             setSellUSDInput(sellUSDInputValue);

//             const goldUSDBiddingResult = silverAsking;
//             const buyRate = (((goldUSDBiddingResult) / 31.1035) * 3.67 * unit * unitMultiplier) * (purity / Math.pow(10, purity.length)) + parseFloat(sellPremiumAED || 0);

//             const goldSellAEDInputValue = buyRate.toFixed(4);
//             const goldSellUSDInputValue = (buyRate / 3.67).toFixed(4);

//             setBuyAEDInput(goldSellAEDInputValue);
//             setBuyUSDInput(goldSellUSDInputValue);
//         } else {
//             const goldUSDResult = goldBidding;
//             const calculatedRate = ((goldUSDResult) / 31.1035 * 3.67 * unit * unitMultiplier) * (purity / Math.pow(10, purity.length)) + parseFloat(buyPremiumAED || 0);

//             const sellAEDInputValue = parseFloat(calculatedRate).toFixed(4);
//             const sellUSDInputValue = (calculatedRate / 3.67).toFixed(4);

//             setSellAEDInput(sellAEDInputValue);
//             setSellUSDInput(sellUSDInputValue);

//             const goldUSDBiddingResult = goldAsking;
//             const buyRate = (((goldUSDBiddingResult) / 31.1035) * 3.67 * unit * unitMultiplier) * (purity / Math.pow(10, purity.length)) + parseFloat(sellPremiumAED || 0);

//             const goldSellAEDInputValue = buyRate.toFixed(4);
//             const goldSellUSDInputValue = (buyRate / 3.67).toFixed(4);

//             setBuyAEDInput(goldSellAEDInputValue);
//             setBuyUSDInput(goldSellUSDInputValue);
//         }
//     };

//     const handleMetalChange = (event) => {
//         const selectedMetal = event.target.value;

//         switch (selectedMetal) {
//             case 'Gold kilobar':
//                 setWeight('KG');
//                 break;
//             case 'Gold TOLA':
//                 setWeight('TOLA');
//                 break;
//             case 'Gold TEN TOLA':
//                 setWeight('TTB');
//                 break;
//             case 'Gold Coin':
//                 setWeight('GM');
//                 break;
//             case 'Silver':
//                 setWeight('GM');
//                 break;
//             case 'Silver Kilobar':
//                 setWeight('KG');
//                 break;
//             default:
//                 setWeight('GM');
//         }
//         setMetal(selectedMetal);
//         setPurity('9999');
//         calculateRates();
//     };

//     const handlePurityChange = (event) => {
//         setPurity(event.target.value);
//     };

//     useEffect(() => {
//         calculateRates();
//     }, [
//         metal,
//         purity,
//         unit,
//         weight,
//         goldAsking,
//         goldBidding,
//         silverAsking,
//         silverBidding,
//         sellPremiumAED,
//         sellPremiumUSD,
//         buyPremiumAED,
//         buyPremiumUSD,
//     ]);

//     const handleWeightChange = (event) => {
//         setWeight(parseFloat(event.target.value) || 1);
//     };

//     const convertUSDToAED1 = (event) => {
//         const inputValue = parseFloat(event.target.value) || 0;

//         if (!isNaN(inputValue)) {
//             setSellPremiumUSD(inputValue);
//             setSellPremiumAED((inputValue * 3.67).toFixed(2));
//         } else {
//             setSellPremiumUSD(0);
//             setSellPremiumAED('');
//         }
//     };

//     const convertAEDToUSD1 = (event) => {
//         const inputValue = parseFloat(event.target.value) || 0;

//         if (!isNaN(inputValue)) {
//             setSellPremiumAED(inputValue);
//             setSellPremiumUSD((inputValue / 3.67).toFixed(2));
//         } else {
//             setSellPremiumUSD('');
//         }
//     };

//     const convertUSDToAED2 = (event) => {
//         const inputValue = parseFloat(event.target.value) || 0;

//         if (!isNaN(inputValue)) {
//             setBuyPremiumUSD(inputValue);
//             // Convert and update AED input value
//             setBuyPremiumAED((inputValue * 3.67).toFixed(2));
//         } else {
//             setBuyPremiumUSD(0);
//             setBuyPremiumAED(''); // Clear AED input if USD input is not a valid number
//         }
//     };

//     // Handler function for converting AED to USD for buyPremium
//     const convertAEDToUSD2 = (event) => {
//         const inputValue = parseFloat(event.target.value) || 0;

//         if (!isNaN(inputValue)) {
//             setBuyPremiumAED(inputValue);
//             setBuyPremiumUSD((inputValue / 3.67).toFixed(2));
//         } else {
//             setBuyPremiumUSD(''); // Clear USD input if AED input is not a valid number
//         }
//     };

//     // Save Commodity Data
//     const saveCommodityData = async () => {
//         const newCommodity = {
//             metal: metal,
//             purity: purity,
//             weight: weight,
//             unit: unit,
//             sellAED: sellAEDInput,
//             buyAED: buyAEDInput,
//             buyPremium: buyPremiumAED || 0,
//             sellPremium: sellPremiumAED || 0,
//         };


//         const uid = user.uid;
//         // Add a new document with a generated id.
//         const docRef = await addDoc(collection(db, `users/${uid}/commodities`), newCommodity);
//         console.log("Document written with ID: ", docRef.id);
//         fetchFirebaseData()
//         setOpen(false);
//         resetForm()
//     }

//     // Edit Commodity Btn
//     const editCommodityBtn = (index) => {
//         setOpen(true)
//         setSaveChangesBtn(true)
//         setSaveBtn(false)
//         // console.log(index);

//         commodities.forEach((commodity) => {
//             if (commodity.id === index) {
//                 // console.log(commodity);
//                 setMetal(commodity.metal)
//                 setPurity(commodity.purity)
//                 setUnit(commodity.unit)
//                 setWeight(commodity.weight)
//                 setSellPremiumAED(commodity.sellPremium)
//                 setBuyPremiumAED(commodity.buyPremium)

//                 setSellPremiumUSD((commodity.sellPremium / 3.67).toFixed(2));
//                 setBuyPremiumUSD((commodity.buyPremium / 3.67).toFixed(2))
//             }
//         })
//         performCalculation()
//         setUpdateCommodityID(index)
//     }

//     // Update Commodity Data
//     const updateCommodityData = async () => {
//         const updatedCommodity = {
//             metal: metal,
//             purity: purity,
//             weight: weight,
//             unit: unit,
//             sellAED: sellAEDInput,
//             buyAED: buyAEDInput,
//             buyPremium: buyPremiumAED || 0,
//             sellPremium: sellPremiumAED || 0,
//         };

//         const uid = user.uid;
//         const docId = updateCommodityID

//         try {
//             // Update an existing document
//             await updateDoc(doc(db, `users/${uid}/commodities`, docId), updatedCommodity);
//             console.log("Document updated with ID: ", docId);

//             // Fetch updated data and perform any additional actions
//             await fetchFirebaseData();

//             // Close the modal or reset the form as needed
//             setOpen(false);
//             resetForm();
//         } catch (error) {
//             console.error("Error updating document: ", error);
//         }
//     }

//     // Delete Commodity Btn
//     const deleteCommodityBtn = (index) => {
//         setOpenDeleteModal(true)
//         setConfirmDelete(index)
//     }

//     // Confirm Delete Btn
//     const confirmDeleteBtn = async () => {
//         if (confirmDelete) {
//             const uid = user.uid;
//             const commodityDocRef = doc(db, `users/${uid}/commodities/${confirmDelete}`);

//             try {
//                 await deleteDoc(commodityDocRef);
//                 setOpenDeleteModal(false);
//                 fetchFirebaseData(); // Assuming this function fetches data after deletion
//             } catch (error) {
//                 console.error("Error deleting document:", error);
//                 // Handle error if needed
//             }

//             setOpenDeleteModal(false)
//             fetchFirebaseData()
//         }
//     }
