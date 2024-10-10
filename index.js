const express = require('express')
const app = express ()

const path = require('path')
const fs = require("fs")
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res)=>{
    //get data from file
    fs.readFile('./tasks', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        //console.log(data);
        //console.log(typeof data);
        console.log(data.split("\n"));
        //task list data
        const tasks = (data.split("\n"))
        res.render('index', {tasks: tasks})
    });
})
app.listen(3001, () =>{
    console.log ('Example app is started at http://localhost:3001')
})