const express = require("express");
const router = express.Router();

const Medicine = require("../models/Medicine");


// =====================================================
// ADD MEDICINE
// =====================================================

router.post("/add", async (req, res) => {

    try {

        const {
            userId,
            medicineName,
            dosage,
            period,
            time
        } = req.body;


        const medicine = new Medicine({

            userId,
            medicineName,
            dosage,
            period,
            time

        });


        await medicine.save();


        res.status(201).json({

            message: "Medicine added successfully!",

            medicine: medicine

        });


    } catch (error) {

        console.error("Medicine error:", error);


        res.status(500).json({

            message: "Failed to add medicine.",

            error: error.message

        });

    }

});


// =====================================================
// GET ALL MEDICINES FOR A USER
// =====================================================

router.get("/:userId", async (req, res) => {

    try {

        const medicines = await Medicine.find({

            userId: req.params.userId

        });


        res.json(medicines);


    } catch (error) {

        console.error("Fetch medicine error:", error);


        res.status(500).json({

            message: "Failed to fetch medicines."

        });

    }

});


// =====================================================
// UPDATE MEDICINE
// =====================================================

router.put("/:id", async (req, res) => {

    try {

        const {
            medicineName,
            dosage,
            period,
            time
        } = req.body;


        const updatedMedicine =
            await Medicine.findByIdAndUpdate(

                req.params.id,

                {
                    medicineName,
                    dosage,
                    period,
                    time
                },

                {
                    new: true
                }

            );


        if (!updatedMedicine) {

            return res.status(404).json({

                message: "Medicine not found."

            });

        }


        res.json({

            message: "Medicine updated successfully!",

            medicine: updatedMedicine

        });


    } catch (error) {

        console.error("Update medicine error:", error);


        res.status(500).json({

            message: "Failed to update medicine.",

            error: error.message

        });

    }

});


// =====================================================
// DELETE MEDICINE
// =====================================================

router.delete("/:id", async (req, res) => {

    try {

        const deletedMedicine =
            await Medicine.findByIdAndDelete(

                req.params.id

            );


        if (!deletedMedicine) {

            return res.status(404).json({

                message: "Medicine not found."

            });

        }


        res.json({

            message: "Medicine deleted successfully!"

        });


    } catch (error) {

        console.error("Delete medicine error:", error);


        res.status(500).json({

            message: "Failed to delete medicine.",

            error: error.message

        });

    }

});


module.exports = router;