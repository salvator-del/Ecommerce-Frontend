import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";





export default async function handler(req,res) {
    if (req.method !== 'POST') {
        res.json('should be a POST request');
        return;
    }
    const {
        name,email,city,
        postalCode,streetAddress,country,
        products,
    } = req.body;
    await mongooseConnect();
    const productsIds = products.split(',');
    const uniqueIds = [...new Set(productsIds)];
    const productsInfos = await Product.find({_id:uniqueIds});

    let line_items = [];
    for (const productId of uniqueIds) {
        const productInfo = productsInfos.find(p => p._id.toString() === productId);
        const quantity = productsIds.filter(id => id === productId)?.length || 0;
        if (quantity > 0 && productInfo) {
            line_items.push({
                quantity,
                price_data: {
                    currency: "KES",
                    product_data: {name:productInfo.title},
                    unit_amount: quantity * productInfo.price,
                },
            });
        }
    }
    
    const orderDoc = await Order.create({
        line_items,name,email,city,postalCode,
        streetAddress,country,paid:false,
    });

    // Make sure to install 'unirest' using npm or yarn: npm install unirest
    // const makeMpesaPayment = async () => {
    // try {
    //     const response = await unirest
    //     .post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest')
    //     .headers({
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer oscP6MOOkzrCf4QObUuWTfqqW3rT',
    //     })
    //     .send({
    //         line_items,
    //         "BusinessShortCode": 174379,
    //         "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjMxMTIwMTYzMzMz",
    //         "Timestamp": "20231120163333",
    //         "TransactionType": "CustomerPayBillOnline",
    //         "Amount": 1,
    //         "PartyA": 254708374149,
    //         "PartyB": 174379,
    //         "PhoneNumber": 254708374149,
    //         "CallBackURL": "https://mydomain.com/path",
    //         "AccountReference": "CompanyXLTD",
    //         "TransactionDesc": "Payment of X" 
    //     });

    //     console.log(response.raw_body);
    // } catch (error) {
    //     console.error(error);
    // }
    // };

}