import models from "../models/lang.model.js";
import axios from "axios";

export const exTranslate = async (req, res)=>{
    console.log(req.body.language);
    const lang = req.body.language;
    console.log(models.models[lang].EX)

    const translationBody = {
        modelId: models.models[lang].EX, 
        task: "translation",
        input: [{ source: req.body.extractedKeys }],
        userId: null,
      };

    try {
        const response = await axios.post(
            'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/compute',
            translationBody,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(response.data);
        res.send(response.data);
    } catch (error) {
        console.error("There was an error: ", error?.response?.data || error.message);
        res.status(error?.response?.status || 500).json({ error: error?.message || "Internal Server Error" });
    }
};

export const xeTranslate = async (req,res)=>{
    const lang = req.body.language;

    const body = {
        modelId: models.models[lang].XE, // ✅ Ensure this is the correct translation model
        task: "translation",
        input: req.body.input, // ✅ Translate only values
        userId: null,
    };


    try {
        const response = await axios.post(
            'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/compute',
            body,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        res.send(response.data);
    } catch (error) {
        console.error("There was an error: ", error?.response?.data || error.message);
        res.status(error?.response?.status || 500).json({ error: error?.message || "Internal Server Error" });
    }
};