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
        //query
        
        connection.query('SELECT * FROM santri', function (err, result) {
            if (err) {
                req.flash('error', err);
                res.render('santri', {url:'http://localhost:3000/',username: req.session.username, 
                    data: ''
                });
            } else { 
                //render ke view posts index
                
                res.render('santri/index', {url:'http://localhost:3000/',username: req.session.username,
                    data: result // <-- data posts
                });
            }
        });
    }
    else
    {
        res.render('index');
    }
});
/**
 * SEARCH ENGINE
 */
router.get('/search', function(req, res, next) {
    if(req.session.loggedin === true)
    {
        var nama = req.query.nama;

        var sql = "SELECT * FROM santri WHERE nama LIKE '%"+nama+"%'";
        connection.query(sql, function(error, result){
        if(error) console.log(err);
        res.render('santri/index', {url:'http://localhost:3000/',username: req.session.username,
            data: result // <-- data posts
        });

    });
    }
    else
    {
        res.render('index');
    }
    
});
/**
 * CREATE POST
 */
router.get('/create', function (req, res, next) {
    if(req.session.loggedin === true){
        res.render('santri/create', {url:'http://localhost:3000/',username: req.session.username,
            nama: '',
            kelas: '',
            gender: '',
            nisn: ''
        })
    }
    else
    {
        res.render('index');
    }
});

router.post('/store', function (req, res, next) {
    if(req.session.loggedin === true)
    {
        let nama   = req.body.nama;
        let kelas = req.body.kelas;
        let gender = req.body.gender;
        let nisn = req.body.nisn;
        let errors  = false;

        if(nama.length === 0) {
            errors = true;

            // set flash message
            req.flash('error', "Nama tidak boleh kosong!");
            // render to add.ejs with flash message
            res.render('santri/create', {url:'http://localhost:3000/',username: req.session.username,
                nama: nama,
                kelas: kelas,
                gender: gender,
                nisn: nisn
            })
        }

        if(kelas.length === 0) {
            errors = true;

            // set flash message
            req.flash('error', "Kelas tidak boleh kosong!");
            // render to add.ejs with flash message
            res.render('santri/create', {url:'http://localhost:3000/',username: req.session.username,
                nama: nama,
                kelas: kelas,
                gender: gender,
                nisn: nisn
            })
        }

        if(!errors) {

            let formData = {
                nama: nama,
                kelas: kelas,
                gender: gender,
                nisn: nisn
            }
            // insert query
            connection.query('INSERT INTO santri SET ?', formData, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to add.ejs
                    res.render('santri/create', {url:'http://localhost:3000/',username: req.session.username,
                        nama: formData.nama,
                        kelas: formData.kelas,
                        gender: formData.gender,
                        nisn: formData.nisn                    
                    })
                } else {                
                    req.flash('success', 'Data berhasil disimpan!');
                    res.redirect('/santri');
                }
            })
        }
            
    }
    else
    {
    res.render('index');
    }
    
});

/**
    EDIT POST
 */
router.get('/edit/(:id)', function(req, res, next) {
    if(req.session.loggedin === true)
    {
        let id = req.params.id;
   
        connection.query('SELECT * FROM santri WHERE id = ' + id, function(err, rows, fields) {
            if(err) throw err
             
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'Data Santri dengan ID ' + id + " tidak ditemukan!")
                res.redirect('/santri')
            }
            // if book found
            else {
                // render to edit.ejs
                res.render('santri/edit', {url:'http://localhost:3000/',username: req.session.username,
                    id:      rows[0].id,
                    nama:   rows[0].nama,
                    kelas: rows[0].kelas,
                    gender: rows[0].gender,
                    nisn: rows[0].nisn
                })
            }
        })  
    }
    else
    {
    res.render('index');
    }
});

/**
 * UPDATE POST
 */
router.post('/update/:id', function(req, res, next) {

    if(req.session.loggedin === true)
    {
        let id      = req.params.id;
        let nama   = req.body.nama;
        let kelas = req.body.kelas;
        let gender = req.body.gender;
        let nisn = req.body.nisn;
        let errors  = false;

        if(nama.length === 0) {
            errors = true;

            // set flash message
            req.flash('error', "Nama tidak boleh dikosongkan!");
            // render to edit.ejs with flash message
            res.render('santri/edit', {url:'http://localhost:3000/',username: req.session.username,
                id:         req.params.id,
                nama:      nama,
                kelas:    kelas,
                gender: gender,
                nisn: nisn
            })
        }

        if(kelas.length === 0) {
            errors = true;

            // set flash message
            req.flash('error', "Kelas tidak boleh dikosongkan!");
            // render to edit.ejs with flash message
            res.render('santri/edit', {url:'http://localhost:3000/',username: req.session.username,
                id:         req.params.id,
                nama:      nama,
                kelas:    kelas,
                gender: gender,
                nisn: nisn
            })
        }

        // if no error
        if( !errors ) {   
    
            let formData = {
                nama: nama,
                kelas: kelas,
                gender: gender,
                nisn: nisn
            }

            // update query
            connection.query('UPDATE santri SET ? WHERE id = ' + id, formData, function(err, result) {
                //if(err) throw err
                if (err) {
                    // set flash message
                    req.flash('error', err)
                    // render to edit.ejs
                    res.render('santri/edit', {
                        id:     req.params.id,
                        nama:   formData.nama,
                        kelas: formData.kelas,
                        gender: formData.gender,
                        nisn: formData.nisn
                    })
                } else {
                    req.flash('success', 'Data berhasil diupdate!');
                    res.redirect('/santri');
                }
            })
        }
            
    }
    else
    {
    res.render('index');
    }
    
});

/**
 * DELETE POST
 */
router.get('/delete/(:id)', function(req, res, next) {
    if(req.session.loggedin === true)
    {
        let id = req.params.id;
     
        connection.query('DELETE FROM santri WHERE id = ' + id, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // redirect to posts page
                res.redirect('/santri')
            } else {
                // set flash message
                req.flash('success', 'Data santri berhasil dihapus!')
                // redirect to posts page
                res.redirect('/santri')
            }
        }) 
    }
    else
    {
    res.render('index');
    }
    
});



module.exports = router;