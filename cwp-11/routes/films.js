const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const router = express();
router.use(bodyParser.json());

const creatErr = {code: 400, message: 'Creating error'};
const validErr = {code: 400, message: 'Validating error'};
const fieldIdErr = {code: 400, message: 'Field id wrong'};
const idErr = {code: 400, message: 'Invalid id'};

let films = require('../top250.json');

router.get('/readall', (req, res) => {
    films.sort((x, y) => {
        return x.position - y.position;
    })
    res.send(films);
});

router.get('/read', (req, res) => {

    if(req.body.id === undefined
        ||  isNaN(parseInt(req.body.id))
        || req.body.id < 0
        || parseInt(req.body.id) > films.length){

        res.send(idErr);
    }
    else{

        res.send(films.find(film => film.id == req.body.id));
    }
});

router.post('/create', (req,res) => {

    let obj = {};
    const params = req.body;
    obj.id = Date.now();
    console.log(params);
    if(!params.title || !params.rating || !params.year || !params.budget || !params.gross || !params.poster || !params.position){
        res.send(creatErr);
        return;
    }
    let flag = true;
    obj.title = params.title;
    obj.rating = parseFloat(params.rating) < 0 ? flag = false : params.rating;
    obj.year = parseInt(params.year) < 1900 ? flag = false : params.year;
    obj.budget = parseInt(params.budget) < 0 ? flag = false : params.budget;
    obj.gross = parseInt(params.gross) < 0 ? flag = false : params.gross;
    obj.poster = params.poster;
    obj.position = parseInt(params.position) < 0 ? flag = false : params.position;
    if (!flag) {
        res.send(validErr);
        return;
    }
    if (films[0].position > obj.position)
        obj.position =  films[0].position -1;

    if (films[films.length - 1].position < obj.position)
        obj.position = films[films.length - 1].position + 1;

    films = films.map((element) => {
        if(element.position >= obj.position)
            element.position++;
        return element;
    })
    films.push(obj);
    res.send(obj);
})


router.post('/update', (req, res) => {
    const params = req.body;
    if(!params.id){
        res.send(idErr);
        return;
    }
    const id = parseInt(params.id);
    const film = films[films.findIndex(i => i.id == id)];
    if(film === undefined){
        res.send(idErr);
        return;
    }
    params.position -=1;
    params.title ? film.title = params.title : null;
    params.rating ? film.rating = params.rating : null;
    params.budget ? film.budget = params.budget : null;
    params.gross ? film.gross = params.gross : null;
    params.poster ? film.poster = params.poster : null;
    params.position ? film.position = params.position : null;
    params.year ? film.year = params.year : null;
    films=films.map((element) => {
        if(element.position >= film.position)
            element.position++;
        return element;
    });
    films.sort((x, y) => {
        return x.position - y.position;
    })
    let pos = 1;
    films.map((element) => {
        if(element.position !== pos)
            element.position = pos;
        pos++;
    })
    res.send(film);
})

router.post('/delete', (req, res) => {
    const params = req.body;
    if(!params.id){
        res.send(idErr);
        return;
    }
    let id = parseInt(params.id);
    let filmIndex = films.findIndex(i => i.id === id);
    if(filmIndex < 0){
        res.send(fieldIdErr);
        return;
    }
    const delPosition = films[filmIndex].position;
    films.splice(filmIndex, 1);
    films.map((element) => {
        if(element.position > delPosition)
            element.position--;
        return element;
    })
    res.send(films);
})








router.get('/', (req, res) => {

    res.send('Hello World!');
});


function save(){
    fs.writeFileSync('allfilms.json',JSON.stringify(films));
}

module.exports=router;