const { v4: uuidv4 } = require('uuid');

// array for storing receipt ids with points 
const receipts = [];

const processReceipt = (req, res) => {
    let totalPoints = 0;

    // add 1 point for every alphanumeric char in the retailer name
    const retailerName = req.body.retailer
    for (let i = 0; i < retailerName.length; i++) {
        // if ascii value of char is alphanumeric add a point
        let charCode = retailerName.charCodeAt(i);
        if ((charCode > 47 && charCode < 58) ||
            (charCode > 96 && charCode < 123 ||
            (charCode > 64 && charCode < 91)
            )) {
                totalPoints += 1;
            }
    }

    const totalPrice = parseFloat(req.body.total);

    // add 50 point if total is a round dollar amount with no cents
    if (Number.isInteger(totalPrice)) {
        totalPoints += 50;
    }
    
    // add 25 pounts if total is a multiple of 0.25
    if ((totalPrice % 0.25) == 0) {
        totalPoints += 25;
    }

    const items = req.body.items;

    // add 5 points for every 2 items on the receipt
    totalPoints += 5 * Math.floor(items.length / 2);

    // for each item, if the trimmed length of the item description is a multiple of 3, add the product of the price multiplied by 0.2 rounded up to the nearest integer
    items.forEach((item) => {
        if ((item.shortDescription.trim().length) % 3 == 0) {
            totalPoints += Math.ceil(item.price * 0.2);
        }
    })

   // add 6 points if the purchase date is odd
   const purchaseDate = req.body.purchaseDate
   if ((parseInt(purchaseDate.split('-')[2]) % 2) != 0) {
    totalPoints += 6;
   }

   // add 10 points if time of purchase is after 2:00 PM and before 4:00 PM
   const purchaseTime = req.body.purchaseTime;
   const hours = parseInt(purchaseTime.split(':')[0]);
   const minutes = parseInt(purchaseTime.split(':')[1]);

   if ((16 < hours > 14) || (hours == 14 && minutes > 0)) {
    totalPoints += 10;
   }

    // generate random id and add receipt to array
    const id = uuidv4();
    receipts.push({ "id": id, "points": totalPoints });

    res.status(200).json({ "id": id });
    return
}

const getPoints = (req, res) => {
    const id = req.params.id

    // search for receipt with matching id
    const foundReceipt = receipts.find(receipt => receipt.id == id);
    if (!foundReceipt) {
        res.status(400).json({ "ERROR": `Receipt with id: ${id} not found` })
        return
    }
    res.status(200).json({ "points": foundReceipt.points });
    return
}

module.exports = {
    processReceipt,
    getPoints
}