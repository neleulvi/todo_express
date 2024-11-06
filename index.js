const express = require('express')
const app = express ()
const path = require('path')
const fs = require("node:fs")
app.use(express.urlencoded({ extended: true}))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//meetod faili lugemiseks
const readFile = (filename) => {
    //tagastab lubaduse
    return new Promise((resolve, reject) => {
        //loeb sisse faili sisu
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            //task list data from file
            const tasks = JSON.parse(data)
            resolve(tasks)
        });
    })
}
const writeFile = (filename, data) => {
    return new Promise((resolve, reject) =>{
        //get data from file
        fs.writeFile(filename, data, 'utf-8', err =>{
            if(err) {
                console.error(err);
                return;
            }
            resolve(true)
        });
    })
}

app.get('/', (req, res)=>{
    console.log("get all")
    //get data from file
    readFile('./tasks.json')
        .then((tasks) => {
            res.render('index', {
                tasks: tasks,
                error: null
        })
        })
})
//for parsing application /x-www-form-urlencoded
app.use(express.urlencoded({ extended:true}))

app.post('/', (req, res) =>{
    console.log("post")
    let error = null
    if (req.body.task.trim().length == 0){
        error = "please insert correct task data"
        readFile('./tasks.json')
        .then(tasks =>{
            res.render('index', {
                tasks:tasks,
                error:error
            })
        })
    }else {
    //get data from file
    console.log("else")
        readFile('./tasks.json')
        .then((tasks) => {
            let index
            console.log("before")
            if(tasks.length === 0)
            {
                index = 0
            }else{
                index = tasks[tasks.length-1].id + 1;
            }
            const newTask = {
                "id": index,
                "task": req.body.task
            }
            tasks.push(newTask)
            console.log(tasks)
            const data = JSON.stringify(tasks, null, 2)
            writeFile('./tasks.json', data)
            res.redirect('/')
        }) 
        }
})

app.get('/delete-task/:taskId', (req, res) => {
    console.log("delete2")
    let deletedTaskId = parseInt(req.params.taskId)
    readFile('./tasks.json')
    .then(tasks => {
        tasks.forEach((task, index) =>{
            if(task.id === deletedTaskId){
                tasks.splice(index, 1)
            }
        })
        const data = JSON.stringify(tasks, null, 2)
        writeFile('./tasks.json', data)
    
            res.redirect('/')
    })
})

app.get('/delete-tasks', (req, res) =>{
    console.log("delete")
    tasks = []
    const data = JSON.stringify(tasks, null, 2)
    writeFile('./tasks.json', data)
    res.redirect('/')

})


app.get('/update-task/:taskId', (req,res) => {
    let updateTaskId = parseInt(req.params.taskId)  
    readFile('./tasks.json')
        .then(tasks => {
            console.log("before update if clause")
            let updateTask
            tasks.forEach((task) => {
                if(task.id === updateTaskId){
                    console.log("update if clause")
                    console.log(task.task)
                    updateTask = task.task
                }
            })
            res.render('update', {
               updateTask : updateTask,
               updateTaskId: updateTaskId,
               error: null 
            })
        })
})
app.post('/update-task/', (req, res) =>{
    console.log(req.body)
    //parse int ütleb, päring tuleb brauseri kehast, kus ta küsib task id ja annab selle täisarvuna(serveris on sõned)
    let updateTaskId = parseInt(req.body.taskId)

    let updateTask = req.body.task
    let error = null
    if (updateTask.trim().length === 0){
        error = "please insert correct task data"
            res.render('update', {
                updateTask : updateTask,
                updateTaskId : updateTaskId,
                error:error 
            })
    }else {
        readFile('./tasks.json')
        .then(tasks => {
            tasks.forEach((task, index) =>{
                
                if(task.id === updateTaskId){
                    console.log("update mind")
                    tasks[index].task = updateTask
                }
            })
                console.log(tasks)
                const data = JSON.stringify (tasks, null, 2)
                writeFile('./tasks.json', data)
                res.redirect('/')
            }) 
        }
})



app.listen(3001, () =>{
    console.log ('Example app is started at http://localhost:3001')
})