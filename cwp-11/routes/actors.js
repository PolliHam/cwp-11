const express = require('express');
const router = express.Router();
let actors = require('../actors.json');
const logger = require('./log/logger')

const errCreate = {code: 400, message: 'error in creating '}
const validErr = {code: 400, message: 'validating error '}
const idErr = {code: 400, message: 'Where is id?'}
const invId = {code: 400, message: 'invalid id'}
const invBirth = {code: 400, message: 'invalid birth'}

router.get('/readall', (req, res) => {
    actors.sort((x, y) => {
        return x.liked - y.liked;
    });
    logger.log(req.url.toString() + '\n');
    res.send(actors);
})

router.get('/read', (req, res) => {
    logger.log(req.url.toString() + '\n');
    res.send(actors.find(actor => actor.id == req.body.id));
})

router.post('/create', (req, res) => {
    let r = req.body;
    logger.log(req.url.toString() + '\n' + r.name + ' ' + r.birth + ' ' + r.films + ' ' + r.liked);
    let obj = {};
    obj.id = Date.now();
    if(!r.name || ! r.birth || !r.films || !r.liked || !r.photo){
        res.send(errCreate);
        return;
    }
    let flag = true;
    obj.name = r.name;
    obj.budget =isNaN(++r.budget)|| parseInt(r.budget) <= 0 ? flag = false : --r.budget;
    obj.liked = isNaN(++r.liked)||parseInt(r.liked) < 0 ? flag = false : --r.liked;
    obj.films = isNaN(++r.films)||parseInt(r.films) < 0 ? flag = false : --r.films;
    obj.photo = r.photo;
    if(!validDate(r.birth)){
        res.send(invBirth);
        return;
    }
    obj.birth = r.birth;
    if(!flag){
        res.send(validErr);
        return;
    }
    actors.push(obj);
    res.send(obj);
})

router.post('/delete', (req, res) => {
    let r= req.body;
    logger.log(req.url.toString() + '\n' + r.name + ' ' + r.birth + ' ' + r.films + ' ' + r.liked);
    if(!r.id){
        res.send(idErr);
        return;
    }
    let id = parseInt(r.id);
    let index = actors.findIndex(i => i.id == id);
    if(index < 0){
        res.send(invId);
        return;
    }
    actors.splice(index, 1);
    res.send(actors);
})

router.post('/update', (req, res) => {
    let r = req.body;
    logger.log(req.url.toString() + '\n' + r.name + ' ' + r.birth + ' ' + r.films + ' ' + r.liked);
    if(!r.id){
        res.send(idErr);
        return;
    }
    let id = parseInt(r.id);
    let ind = actors.findIndex(i => i.id == id);
    if(ind < 0){
        res.send(invId);
        return;
    }
    r.name ? actors[ind].name = r.name : null;
    r.birth && validDate(r.birth) ? actors[ind].birth = r.birth : null;
    ! isNaN(++r.films)&& r.films ? actors[ind].films = r.films : null;
    ! isNaN(++r.liked)&& r.liked ? actors[ind].liked = r.liked : null;
    r.photo ? actors[ind].photo = r.photo : null;
    res.send(actors[ind]);
})

function validDate(date){
    let d = date.split('.');
    if(parseInt(d[0]) > 31 && parseInt(d[0]) <1)
        return false;
    if(parseInt(d[1]) > 12 && parseInt(d[1]) <1)
        return false;
    if(d[2].length > 4 || parseInt(d[2]) > 2017)
        return false;
    return true;
}

module.exports = router;