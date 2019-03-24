const express = require('express');
const router = express.Router();


router.post('/api/appareils', (req, res, next) => {
    console.log(req.body);

    const appareil = new Appareil({
        name: req.body.name,
        status: req.body.status
    });

    appareil.save()
        .then(
            () => {
                res.status(201).json({
                    message: "Appareil Added success"
                });
            }
        )
        .catch(
            (error) => {
                res.status(400).json({
                    error: error
                })
            }
        )

});
router.get('/api/appareils', (req, res) => {
    const appareils = [
        {
            id: 1,
            name: 'Iphone',
            status: true
        },
        {
            id: 2,
            name: 'Ordinateur',
            status: false
        },
        {
            id: 3,
            name: 'Frigo',
            status: true
        }
    ];

    res.status(200).json(appareils);
});

module.exports = router;
