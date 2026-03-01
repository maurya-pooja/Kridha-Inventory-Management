const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'inventory_db'
});
db.connect((err)=>{
    if(err){
        console.log("Database Error:"+err.message);
    }else{
        console.log("MySql connected successfully");
    }
});
// app.listen(5000,()=>{
//     console.log("Server running on port 5000");
// });


// add product
app.post('/api/add-product',(req,res)=>{
    const {product_name, brand_name,category,price,stock_quantity,description} = req.body;
    const sql = "INSERT INTO products (product_name, brand_name,category,price,stock_quantity,description) VALUES(?, ?, ?, ?, ?, ?)";
    db.query(sql,[product_name,brand_name,category,price,stock_quantity,description],(err,result)=>{
        if(err){
            console.log("Insert Error:", err);
            return res.status(500).json(err);
        } 
        res.status(200).json({message:"Product Added to Successfully!"});
    });
});


// get all products (dashboard & table)
app.get('/api/get-products', (req,res)=>{
    const sql = "SELECT * FROM products";
    db.query(sql,(err,data)=>{
        if(err){
            console.log("Fetch Error:",err);
            return res.status(500).json(err);
        }
        return res.json(data);
    });
});

// delete product

app.delete('/api/delete-product/:id',(req,res)=>{
    const{id} = req.params;
    const sql = "DELETE FROM products WHERE id = ?";
    db.query(sql,[id],(err,result)=>{
        if(err){
            console.log("Delete Error:",err);
            return res.status(500).json(err);
        }
        res.status(200).json({message:"Product Deleted!"});
    });
});


app.put('/api/update-product/:id',(req,res)=>{
    const {id} = req.params;
    const {product_name, brand_name, category,price,stock_quantity,description} = req.body;
    const sql = "UPDATE products SET product_name=?, brand_name=?, category=?,price=?, stock_quantity=?, description=? WHERE id=?";
    db.query(sql,[product_name,brand_name,category,price,stock_quantity,description,id],(err,result)=>{
        if(err){
            console.log("Update Error:", err);
            return res.status(500).json(err);
        }
        res.status(200).json({message:"Product Updated Successfully!"});
    });
});


// edit form m for filling old data 
app.get('/api/get-product/:id',(req,res)=>{
    const {id} = req.params;
    const sql = "SELECT * FROM products WHERE id = ?";
    db.query(sql,[id],(err,data)=>{
        if(err){
            console.log("Database Error:", err);
            return res.status(500).json({error: "Database query failed", details:err});
        } 
        if(data.length===0){
            return res.status(404).json({message:"Product not found"});
        }
        return res.json(data[0]);
    });
});

// Billing
app.post("/api/generate-bill", (req, res) => {
    const { cart, customerName, customerMobile } = req.body;
    const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

    db.query("INSERT INTO sales (customer_name, customer_mobile, total_amount) VALUES (?,?,?)", 
    [customerName, customerMobile, totalAmount], (err, result) => {
        
        if (err) return res.status(500).json(err);
        const saleId = result.insertId; 

        
        cart.forEach(item => {  
            db.query("INSERT INTO sale_items (sale_id, product_name, quantity, price) VALUES (?,?,?,?)", 
            [saleId, item.product_name, item.qty, item.price]);

        
            db.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?", [item.qty, item.id]);
        });

        res.status(200).json({ message: "Bill Saved Successfully!", saleId });
    });
});

app.get('/api/get-sale-items/:saleId', (req, res) => {
    db.query("SELECT * FROM sale_items WHERE sale_id = ?", [req.params.saleId], (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});


app.post('/api/login',(req,res)=>{
    const {username, password} = req.body;
    const sql = "SELECT * FROM users WHERE username = ? AND password =?";
    db.query(sql,[username,password],(err,data)=>{
        if(err) return res.status(500).json({message:"Server Error"});
        if(data.length>0){
            return res.status(200).json({message:"Login success", user:data[0]});
        }else{
            return res.status(401).json({message:"Enter correct username & password!"});
        }
    });
});

// password change
app.put('/api/change-password',(req,res)=>{
    const{username,oldPassword,newPassword} = req.body;
    const checkSql = "SELECT * FROM users WHERE username = ? AND password =?";
    db.query(checkSql,[username,oldPassword],(err,data) =>{
        if(err) return res.status(500).json({message:"Server Error"});
        if(data.length>0){
            const updateSql = "UPDATE users SET password =? WHERE username = ?";
            db.query(updateSql,[newPassword,username],(err,result)=>{
                if(err) return res.status(500).json({message:"Update fail!"})
                return res.status(200).json({message:"Password successfully change.!"})
            });
        }else{
            res.status(401).json({message:"old password is wrong"});
        }
    }) ;
});


// total products count

app.get('/api/stats/total-products',(req,res)=>{
    db.query("SELECT COUNT(*) as total FROM products",(err,result)=>{
        if(err) return res.status(500).json(err);
        res.json(result[0]);
    });
});

app.get('/api/stats/low-stock',(req,res)=>{
    db.query("SELECT COUNT(*) AS lowStockCount FROM products WHERE stock_quantity < 10", (err,result)=>{
        if(err) return res.status(500).json(err);
        res.json(result[0]);
    });
});

app.get('/api/stats/today-sales',(req,res)=>{
    const sql = "SELECT SUM(total_amount) as todayTotal FROM sales WHERE DATE(sale_date) = CURDATE()";
    db.query(sql,(err,result)=>{
        if(err) return res.status(500).json(err);
        res.json(result[0] || {todayTotal : 0});
    });
});

app.get('/api/get-sales',(req,res)=>{
    const sql = "SELECT * FROM sales ORDER BY sale_date ASC";
    db.query(sql,(err,data)=>{
        if(err){
            console.error("Database Error:", err);
            return res.status(500).json({error:"dos't data fetch", details:err});
        }
        res.status(200).json(data);
    });
});


app.listen(5000,()=>{
    console.log("Server running on port 5000");
});