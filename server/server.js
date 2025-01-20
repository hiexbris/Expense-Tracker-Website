import cors from 'cors';
import mongoose from 'mongoose';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET_KEY = "SAFETY";

mongoose.connect('mongodb://127.0.0.1:27017/tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const recordschema = new mongoose.Schema({
    name: { type: String },
    price: { type: Number }
}, { timestamps: true });

const catschema = new mongoose.Schema({
    category: {type:String},
    record: [recordschema]
});

const loginschema = new mongoose.Schema({
    username: {type:String},
    password: {type:String} 
})

const User = mongoose.model('user', loginschema, 'user')


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(403).json({ message: 'Access denied, no token provided' });
    }
  
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;  // Attach user info to request
        const requestUsername = req.params.username;
        if (decoded.username !== requestUsername) {
            return res.status(403).json({ message: 'Access denied, token mismatch' });
        }
        next();
    }catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }


app.post('/verify-token', (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        // Send back the username if the token is valid
        res.json({ username: decoded.username });
    });
});


app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
  
    const existingUser = await User.findOne({ username });
  
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username already taken' });
    }
  
    try {
        await User.create({
            username: username,
            password: await bcrypt.hash(password, 10), // Make sure to hash the password before saving
          })
        const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ success: true, message: 'User created successfully', token: token });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, message: 'Error occurred while saving the user' });
    }
  });


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jwt.sign({ username: username }, SECRET_KEY, {expiresIn: '1h'})
        res.json({ success: true, token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


app.post('/cat_name/:username', authenticateToken, function(req, res){
    const { username } = req.params;
    const Cats_db = mongoose.model(username, catschema, username);
    async function getCats() {
        const documents = await Cats_db.find({});
        const categories_root = documents.map(function(doc) {
            return doc.category; 
        });
        res.json(categories_root); 
    }
    getCats()
})

app.post('/total/:username', authenticateToken, async function(req, res) {
    const data = req.body;
    const { username } = req.params;
    const Cats_db = mongoose.model(username, catschema, username);
    const categories = await Cats_db.find({});
    const result = [];

    categories.forEach(cat => {
        let total = 0;
        cat.record.forEach(item => {
            if (item.createdAt >= new Date(data.starttime) && item.createdAt <= new Date(data.endtime)) {
                total += item.price;
            }});
        result.push({ _id: cat.category, total });
    });
    result.sort((a, b) => b.total - a.total);
    res.json(result);
});


app.post('/spent/:username', authenticateToken, function(req, res){
    const data = req.body;
    const { username } = req.params;
    const Cats_db = mongoose.model(username, catschema, username);
    async function worker() {
        await Cats_db.findOneAndUpdate(
            { category: data.cat },
            { $push: { record: { name: data.Item, price: data.Price } } },
            { new: true }
        );
    }
    worker()
    res.sendStatus(200);
})

app.post('/newcat/:username', authenticateToken, function(req, res){
    const data = req.body;
    const { username } = req.params;
    const Cats_db = mongoose.model(username, catschema, username);
    async function newcatadd(){
        await Cats_db.create({
            category: data.newcat,
            record: [] 
        });
    }
    newcatadd()
    res.sendStatus(200);
})

app.post('/deletecat/:username', authenticateToken, function(req, res){
    const data = req.body;
    const { username } = req.params;
    const Cats_db = mongoose.model(username, catschema, username);
    async function deletecat(){
        await Cats_db.findOneAndDelete({ category: data.cat });
    }
    deletecat()
    res.sendStatus(200);
})

app.post('/getrecord/:username', authenticateToken, function(req, res){
    const data = req.body;
    const { username } = req.params;
    const Cats_db = mongoose.model(username, catschema, username);
    
    async function findrecordti(){
        const category = await Cats_db.findOne({ category: data.name });
        let result = []
        category.record.forEach(item => {
            if (item.createdAt >= new Date(data.starttime) && item.createdAt <= new Date(data.endtime)) {
                result.push(item);
            }})
        res.json(result)
    }

    async function findrecordpr(){
        const category = await Cats_db.findOne({ category: data.name});
        let result = []
        category.record.forEach(item => {
            if (item.createdAt >= new Date(data.starttime) && item.createdAt <= new Date(data.endtime)) {
                result.push(item);
            }})
        result.sort((a, b) => b.price - a.price);
        res.json(result)
    }

    async function findrecordva(){
        const category = await Cats_db.findOne({ category: data.name});
        let result = []
        category.record.forEach(item => {
            if (item.createdAt >= new Date(data.starttime) && item.createdAt <= new Date(data.endtime)) {
                result.push(item);
            }})
        result.sort((a, b) => a.name.localeCompare(b.name));
        res.json(result)
    }

    if (data.sort === 'time'){findrecordti();}
    if (data.sort === 'price'){findrecordpr();}
    if (data.sort === 'name'){findrecordva();}
})

app.post('/deleteitem/:username', authenticateToken, function(req, res){
    const data = req.body;
    const { username } = req.params;
    const Cats_db = mongoose.model(username, catschema, username);
    
    async function asd(){
        await Cats_db.updateOne(
            { category: data.category, "record._id": data._id }, 
            { $pull: { record: { _id: data._id } } }
        )
    }
    
    asd()
    res.json({nahdasde: 'gaand ka danda'})
})

app.listen(5000, function(){
    console.log("Server has started")
})