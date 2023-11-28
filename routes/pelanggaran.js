var express = require('express');
var router = express.Router();
const session = require('express-session');

//import database
var connection = require('../library/database');

/**
 * INDEX POSTS
 */
router.get('/', function (req, res, next) {
    
    if(req.session.loggedin === true){
        res.render('pelanggaran/index', {url:'http://localhost:3000/',username: req.session.username, 
        });
    }
    else
    {
        res.render('index');
    }
});

router.get('/create', function (req, res, next) {
    var date = new Date();
    var tahun = date.getFullYear();
    var bulan = date.getMonth();
    var tanggal = date.getDate();
    var hari = date.getDay();
    var jam = date.getHours();
    var menit = date.getMinutes();
    var detik = date.getSeconds();
    switch(hari) {
    case 0: hari = "Minggu"; break;
    case 1: hari = "Senin"; break;
    case 2: hari = "Selasa"; break;
    case 3: hari = "Rabu"; break;
    case 4: hari = "Kamis"; break;
    case 5: hari = "Jum'at"; break;
    case 6: hari = "Sabtu"; break;
    }
    switch(bulan) {
    case 0: bulan = "Januari"; break;
    case 1: bulan = "Februari"; break;
    case 2: bulan = "Maret"; break;
    case 3: bulan = "April"; break;
    case 4: bulan = "Mei"; break;
    case 5: bulan = "Juni"; break;
    case 6: bulan = "Juli"; break;
    case 7: bulan = "Agustus"; break;
    case 8: bulan = "September"; break;
    case 9: bulan = "Oktober"; break;
    case 10: bulan = "November"; break;
    case 11: bulan = "Desember"; break;
    }
    var tampilTanggal = hari + ", " + tanggal + " " + bulan + " " + tahun;
    var tampilWaktu = jam + ":" + menit + ":" + detik;
    if(req.session.loggedin === true){
        res.render('pelanggaran/create', {url:'http://localhost:3000/',username: req.session.username,
            waktu: tampilTanggal+" (Jam: "+tampilWaktu+")",
            nama: '',
            kelas:'',
            pasal: '',
            keterangan: '',
            catatan: '',
        })
    }
    else
    {
        res.render('index');
    }
});



module.exports = router;