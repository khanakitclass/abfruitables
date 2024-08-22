const Joi = require("joi");
const pick = require("../helper/pick");

const validate = (schema) => (req, res, next) => {

    const objs = pick(req, Object.keys(schema));


    const { error, value } = Joi.compile(schema)
        .prefs({ abortEarly: false })
        .validate(objs);

    if (error) {

        const errMsg = error.details.map((v) => v.message).join(", ");
        return next(new Error("Validation Error: " + errMsg));
    }


    Object.assign(req, value);


    next();
};

module.exports = validate;
