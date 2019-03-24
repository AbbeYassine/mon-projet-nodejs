const Appareil = require('../models/appareil');

exports.createAppareil = (req, res) => {
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
        ).catch(
        (error) => {
            res.status(400).json({
                error: "Appareil Not Added !!!!!!!!!!! " + error
            });
        }
    )
};

exports.getAllAppareil = (req, res) => {
    Appareil.find()
        .then(
            (data) => {

                //console.log(data);
                res.status(201).json(data);

            }
        ).catch(
        (error) => {
            res.status(400).json({
                error: "Appareil Not !!!!!!!!!!! " + error
            });
        }
    )
};

exports.updateAppareilById = (req, res) => {
    const appareil = new Appareil({
        _id: req.body._id,
        name: req.body.name,
        status: req.body.status
    });

    Appareil.updateOne({
        _id: req.params.id
    }, appareil)
        .then(
            () => {
                res.status(201).json({
                    message: "Appareil updated success"
                });
            }
        ).catch(
        (error) => {
            res.status(400).json({
                error: "Appareil Not updated !!!!!!!!!!! " + error
            });
        }
    )
};

exports.getAppareilById = (req, res) => {
    Appareil.findOne({
        _id: req.params.id
    })
        .then(
            (data) => {
                console.log('Appareil By Id ');
                console.log(data);
                res.status(201).json(data);
            }
        ).catch(
        (error) => {
            res.status(400).json({
                error: "Appareil Not !!!!!!!!!!! " + error
            });
        }
    )
};


exports.deleteAppareilById = (req, res) => {
    Appareil.deleteOne({
        _id: req.params.id
    })
        .then(
            (data) => {
                console.log('Delete Appareil By Id ');
                console.log(data);
                res.status(201).json(data);
            }
        ).catch(
        (error) => {
            res.status(400).json({
                error: "Delete Appareil Not !!!!!!!!!!! " + error
            });
        }
    )
};
