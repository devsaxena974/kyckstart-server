const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const fileUpload = require('express-fileupload')
const path = require("path");
const PORT = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());//allows us to use request.body and get json data
app.use(fileUpload())



//ROUTES//

app.get("/", (req, res) => {
    res.send("Hello World")
})

//MEMBERS TABLE

app.post("/becomeMember/", async (req, res) => {
    try {
        const {email} = req.body
        const {business} = req.body

        const query = await pool.query("INSERT INTO members (email, business) VALUES ($1, $2)", [email, business])


        res.json("business added to membership")
    } catch (error) {
        console.error(error.message)
    }
})

//get all business that a user has membership for:

app.get("/members/:email", async (req, res) => {
    try {
        const {email} = req.params
        const query = await pool.query("SELECT business FROM members WHERE email=$1", [email])

        res.json(query.rows)
    } catch (error) {
        console.log(error.message)
    }
})

//get all members that have subscribed to a business:

app.get("/allMembers/:business", async (req, res) => {
    try {
        const {business} = req.params

        const query = await pool.query("SELECT email FROM members WHERE business=$1", [business])
        res.json(query.rows)
    } catch (error) {
        console.log(error.message)
    }
})

//get a single business from email and business params:

app.get("/members/:email/:business", async (req, res) => {
    try {
        const {email} = req.params
        const {business} = req.params

        const query = await pool.query("SELECT business FROM members WHERE email=$1 AND business=$2", [email, business])

        res.json(query.rows)
    } catch (error) {
        console.log(error.message)
    }
})

app.delete("/deleteMembership/:email/:business", async (req, res) => {
    try {
        const {email} = req.params
        const {business} = req.params

        const query = await pool.query("DELETE FROM members WHERE email=$1 AND business=$2", [email, business])
        res.json("Membership was deleted")
    } catch (error) {
        console.log(error.message)
    }
})

//post user and user_type on signup:

app.post("/newUser", async(req,res) => {
    try {
        const {email} = req.body
        const {user_type} = req.body

        const addUser = await pool.query("INSERT INTO users (email, user_type) VALUES ($1, $2)", [email, user_type])

        
    } catch (error) {
        console.error(error.message)
    }
})

//get users:

app.get("/users/:email", async (req, res) => {
    try {
        const {email} = req.params
        const query = await pool.query("SELECT user_type FROM users WHERE email=$1", [email])

        res.json(query.rows)
    } catch (error) {
        console.error(error.message)
    }
})

//update a user type when business is added:

// app.put("/users/update/:email", async(req, res) => {
//     try {
//         const {email} = req.params
//         const {user_type} = req.body

//         const query = await pool.query("UPDATE users SET user_type=$1 WHERE email=$2", [user_type, email])
//     } catch (error) {
//         console.error(error.message)
//     }
// })

//create a business

app.post("/businesses", async(req, res) => {
    try {
        const {name} = req.body
        const {type} = req.body
        const {phone} = req.body
        const {address} = req.body
        const {city} = req.body
        const {state} = req.body
        const {country} = req.body
        const {email} = req.body
        const {description} = req.body
        const {imgPath} = req.body
        const {website} = req.body
       
        const newBusiness = await pool.query(
            "INSERT INTO businesses (name, type, phone, address, city, state, country, email, description, image_path, website) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
            [name, type, phone, address, city, state, country, email, description, imgPath, website])
        
        res.json("business was created")
        //post user type into users table:
        // const user_type = 'business_owner'
        // const newUser = pool.query("INSERT INTO users (email, type) VALUES ($1, $2)", [email, user_type])
    } catch (error) {
        console.error(error.message);
    }
})

//upload file

app.post("/uploadImage", (req, res) => {
    if(req.files === null) {
        return res.json({ msg: 'No file was uploaded' })
    }

    const file = req.files.file;

    file.mv(`C:/Users/Devanshu Saxena/kyckstart/client/public/uploads/${file.name}`, err => {
        if(err) {
            console.error(err)
            return res.status(500).send();
        }

        return res.json({ fileName: file.name, filePath: `/uploads/${file.name}` })
    })
})

//get image path:
app.get("business/getImage/:email", async(req, res) => {
    try {
        const {email} = req.params
        const query = await pool.query("SELECT image_path FROM businesses WHERE email=$1", [email])
    } catch (error) {
        console.error(error.message)
    }
})

// get all businesses

app.get("/businesses", async(req, res) => {
    try {
        const allBusinesses = await pool.query("SELECT * FROM businesses ORDER BY num_members DESC");
        res.send(allBusinesses.rows);
    } catch (error) {
        console.error(error.message);
    }
});

//get number of members in a business by name:
app.get("/businesses/getMembersByName/:name", async(req, res) => {
    try {
        const {name} = req.params
        const getBusinessByName = await pool.query("SELECT num_members FROM businesses WHERE name=$1", [name])
        res.json(getBusinessByName.rows)
    } catch (error) {
        console.log(error.message)
    }
})

//Update Members by business name:
app.put("/businesses/updateMembersByName/:name", async(req, res) => {
    try {
        const {name} = req.params
        const {updatedNumber} = req.body
        

        const updateNumMembers = await pool.query("UPDATE businesses SET num_members = num_members + 1 WHERE name=$1", [name])

        res.json("Number of members was updated")
    } catch (error) {
        console.log(error.message)
    }
})

//Decrease number of member when user cancels membership:
app.put("/businesses/removeMembersByName/:name", async (req, res) => {
    try {
        const {name} = req.params

        const query = await pool.query("UPDATE businesses SET num_members = num_members - 1 WHERE name = $1", [name])
        res.json("Business # of members was updated successfully")
    } catch (error) {
        console.log(error.message)
    }
})

//fetch a business via email

app.get("/businesses/:email", async(req, res) => {
    try {
        const {email} = req.params
        const getEmailBusiness = await pool.query("SELECT * FROM businesses WHERE email=$1", [email])

        res.json(getEmailBusiness.rows)
    } catch (error) {
        console.error(error.message)
    }
})

//update name

app.put("/businesses/editName/:email", async(req,res) => {
    try {
        
        const {email} = req.params
        const {name} = req.body
        const updateBusiness = await pool.query("UPDATE businesses SET name=$1 WHERE email=$2",
        [name, email])

        res.json("Business was updated")

    } catch (error) {
        console.error(error.message)
    }
})

//update type

app.put("/businesses/editType/:email", async(req,res) => {
    try {
        
        const {email} = req.params
        const {type} = req.body
        const updateBusiness = await pool.query("UPDATE businesses SET type=$1 WHERE email=$2",
        [type, email])

        res.json("Business was updated")

    } catch (error) {
        console.error(error.message)
    }
})

//update description

app.put("/businesses/editDescription/:email", async(req,res) => {
    try {
        
        const {email} = req.params
        const {description} = req.body
        const updateBusiness = await pool.query("UPDATE businesses SET description=$1 WHERE email=$2",
        [description, email])

        res.json("Business was updated")

    } catch (error) {
        console.error(error.message)
    }
})

//update website

app.put("/businesses/editWebsite/:email", async(req,res) => {
    try {
        
        const {email} = req.params
        const {website} = req.body
        const updateBusiness = await pool.query("UPDATE businesses SET website=$1 WHERE email=$2",
        [description, email])

        res.json("Business was updated")

    } catch (error) {
        console.error(error.message)
    }
})

//delete a business

app.delete("/businesses/:id", async(req,res) => {
    try {
        
        const {id} = req.params
        const deleteBusiness = await pool.query("DELETE FROM businesses WHERE id=$1", [id])

        res.json("Business was deleted.")

    } catch (error) {
        console.error(error.message)
    }
})


app.listen(PORT, () => {
    console.log(`server has started on port ${PORT}`);
});