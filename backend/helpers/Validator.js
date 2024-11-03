const { check } = require('express-validator');
const { Schema } = require('mongoose');

// Function to generate validation rules from Mongoose schema
exports.generateValidationSchema = (mongooseSchema) => {
    const validationSchema = [];

    function traverseSchema(path, schemaType) {
        let rule = check(path);

        // Handle required fields
        if (schemaType.isRequired) {
            rule = rule.notEmpty();
        }

        // Handle type-specific validations
        if (schemaType instanceof Schema.Types.String) {
            if (schemaType.minLength != null) {
                rule = rule.isLength({ min: schemaType.minLength });
            }
            if (schemaType.maxLength != null) {
                rule = rule.isLength({ max: schemaType.maxLength });
            }
            if (schemaType.enum) {
                rule = rule.isIn(schemaType.enumValues);
            }
            if (schemaType.match) {
                rule = rule.matches(schemaType.match);
            }
            if (schemaType.lowercase) {
                rule = rule.isLowercase();
            }
            if (schemaType.uppercase) {
                rule = rule.isUppercase();
            }
        } else if (schemaType instanceof Schema.Types.Number) {
            if (schemaType.min != null) {
                rule = rule.isFloat({ min: schemaType.min });
            }
            if (schemaType.max != null) {
                rule = rule.isFloat({ max: schemaType.max });
            }
            if (schemaType.isInteger) {
                rule = rule.isInt();
            }
        } else if (schemaType instanceof Schema.Types.Date) {
            if (schemaType.min) {
                rule = rule.isAfter(schemaType.min);
            }
            if (schemaType.max) {
                rule = rule.isBefore(schemaType.max);
            }
        } else if (schemaType instanceof Schema.Types.Boolean) {
            rule = rule.isBoolean();
        } else if (schemaType instanceof Schema.Types.ObjectId) {
            rule = rule.isMongoId();
        } else if (schemaType instanceof Schema.Types.Buffer) {
            rule = rule.isBase64();
        } else if (schemaType instanceof Schema.Types.Array) {
            if (schemaType.minLength != null) {
                rule = rule.isLength({ min: schemaType.minLength });
            }
            if (schemaType.maxLength != null) {
                rule = rule.isLength({ max: schemaType.maxLength });
            }
        }

        // Add the rule to the validationSchema array
        validationSchema.push(rule);
    }

    function generateValidationRules(path, schema) {
        schema.eachPath((nestedPath, nestedSchemaType) => {
            const fullPath = path ? `${path}.${nestedPath}` : nestedPath;
            traverseSchema(fullPath, nestedSchemaType);
            if (nestedSchemaType instanceof Schema) {
                generateValidationRules(fullPath, nestedSchemaType);
            }
        });
    }

    generateValidationRules('', mongooseSchema);
    console.log(validationSchema)
    return validationSchema;
}