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

router.get('/search/date', function (req, res, next) {
    var date1 = req.query.date1;
    var date2 = req.query.date2;

    var sql = "SELECT santri.nama AS nama, santri.kelas AS kelas, pasal.nama_pasal AS pasal, pasal.keterangan_pasal AS keterangan, catatan FROM pelanggaran JOIN santri ON pelanggaran.santri_id = santri.id JOIN pasal ON pelanggaran.pasal_id = pasal.id WHERE waktu BETWEEN '"+date1+"' AND '"+date2+"' ORDER BY santri_id";
    connection.query(sql, function (error, result) {
        if (error) console.log(error);
        
        var pelanggaran = result.map(function (item) {
            return { 
                nama: item.nama,
                kelas : item.kelas,
                pasal: item.pasal,
                keterangan: item.keterangan,
                catatan: item.catatan };
        });
        res.json(pelanggaran);
    });
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
    const sqlFormattedDate = new Date(date.getTime()).toISOString().slice(0, 19).replace('T', ' '); 
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
        req.session.timestamp = {
            waktu : sqlFormattedDate,
        }
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


router.post('/store', function (req, res, next) {
    var requestBody = req.body
    var santri = requestBody.santri_id
    var pasal = requestBody.pasal_id
    var catatan = requestBody.catatan
    var waktu = req.session.timestamp.waktu

    console.log(requestBody)

    var sql = "INSERT INTO pelanggaran(santri_id,  pasal_id, catatan, waktu) VALUES ('"+santri+"', '"+pasal+"', '"+catatan+"', '"+waktu+"')"

    connection.query(sql, function(err, result){
        if (err) console.log(err);

        req.flash(result)
    })
    res.redirect("/pelanggaran")
});

router.get('/search/nama', function (req, res, next) {
        var nama = req.query.nama;

        var sql = "SELECT * FROM santri WHERE nama LIKE '%" + nama + "%'";
        connection.query(sql, function (error, result) {
            if (error) console.log(error);
            
            var suggestions = result.map(function (item) {
                return { 
                    id: item.id,
                    nama: item.nama,
                    kelas: item.kelas };
            });
            res.json(suggestions);
        });
});

router.get('/search/pasal', function (req, res, next) {
    var nama = req.query.nama;

    var sql = "SELECT * FROM pasal WHERE nama_pasal LIKE '%" + nama + "%'";
    connection.query(sql, function (error, result) {
        if (error) console.log(error);
        
        var suggestions = result.map(function (item) {
            return { 
                id: item.id,
                nama: item.nama_pasal,
                keterangan: item.keterangan_pasal };
        });
        res.json(suggestions);
    });
});




module.exports = router;