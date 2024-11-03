const mongoose = require("mongoose");

exports.generateMongooseSchemas = (entities) => {
  const schemas = [];

  // Iterate over each entity
  for (const entity of entities) {
    const schemaFields = {};

    // Iterate over each field in the entity
    for (const field of entity.schema) {
      // Check if the field has nested schema
      if (field.type === "object" && field.schema) {
        schemaFields[field.name] = new mongoose.Schema(
          generateNestedSchema(field.schema),
          { _id: false }
        );
      } else if (field.type === "object array" && field.schema) {
        schemaFields[field.name] = [
          new mongoose.Schema(generateNestedSchema(field.schema), {
            _id: true,
          }),
        ];
      } else if (field.type === "prices") {
        schemaFields[field.name] = {
          amount: {
            type: mongoose.Schema.Types.Decimal128,
            required: field.required,
            default: 0,
            min: field.min || 0,
            max: field.max || Number.MAX_VALUE,
          },
          currency: {
            type: String,
            required: field.required,
            enum: [
              "MWK",
              "USD",
              "EUR",
              "GBP",
              "JPY",
              "CAD",
              "AUD",
              "CHF",
              "CNY",
              "INR",
              "BRL",
            ],
            default: field.defaultCurrency || "USD",
          },
        };
      } else {
        schemaFields[field.name] = { type: getFieldMongooseType(field.type) };

        switch (field.type) {
          case "number":
          case "price":
          case "decimal":
            schemaFields[field.name].min = field.min || Number.MIN_VALUE;
            schemaFields[field.name].max = field.max || Number.MAX_VALUE;
            break;
          case "select":
          case "dropdown":
          case "radio":
            schemaFields[field.name].enum = field.options.map(
              (option) => option.value
            );
            break;
          case "ref":
            schemaFields[field.name] = {
              type: mongoose.Schema.Types.ObjectId,
              required: field.required,
            };
            break;
          case "richtext":
            schemaFields[field.name] = {
              type: String,
              required: field.required,
            };
            break;
          case "boolean":
          case "check":
            schemaFields[field.name] = {
              type: Boolean,
              required: field.required,
              default: false,
            };
            break;
          case "password":
            schemaFields[field.name] = {
              type: String,
              required: field.required,
            };
            break;
          case "email":
            schemaFields[field.name] = {
              type: String,
              required: field.required,
              validate: {
                validator: (v) =>
                  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
                message: (props) =>
                  `${props.value} is not a valid email address!`,
              },
            };
            break;
          case "tags":
            schemaFields[field.name] = [{ type: String }];
            break;
          default:
            if (field.required) {
              schemaFields[field.name].required = true;
            }
        }
      }
    }

    // Create Mongoose schema for the entity with timestamps option
    const schema = new mongoose.Schema(schemaFields, {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
      timestamps: true,
    });
    schema.index({ "$**": "text" });
    // Add the schema to the array
    schemas.push({
      name: entity.name,
      endpoint: entity.name,
      schema,
    });
  }

  return schemas;
};

// Helper function to generate nested schema
function generateNestedSchema(nestedSchema) {
  const nestedFields = {};

  for (const field of nestedSchema) {
    if (field.type === "prices") {
      nestedFields[field.name] = {
        amount: {
          type: mongoose.Schema.Types.Decimal128,
          required: field.required,
          default: 0,
          min: field.min || 0,
          max: field.max || Number.MAX_VALUE,
        },
        currency: {
          type: String,
          required: field.required,
          enum: [
            "MWK",
            "USD",
            "EUR",
            "GBP",
            "JPY",
            "CAD",
            "AUD",
            "CHF",
            "CNY",
            "INR",
            "BRL",
          ],
          default: field.defaultCurrency || "USD",
        },
      };
    } else {
      nestedFields[field.name] = { type: getFieldMongooseType(field.type) };

      if (field.required) {
        nestedFields[field.name].required = true;
      }
    }
  }

  return nestedFields;
}

// Function to map field types to Mongoose types
function getFieldMongooseType(fieldType) {
  switch (fieldType) {
    case "text":
    case "richtext":
      return String;
    case "number":
    case "price":
      return Number;
    case "decimal":
      return mongoose.Schema.Types.Decimal128;
    case "select":
    case "dropdown":
    case "radio":
      return String;
    case "date":
      return Date;
    case "datetime":
      return Date;
    case "time":
      return String; // Assuming time is stored as string
    case "ref":
      return mongoose.Schema.Types.ObjectId;
    case "object":
      return mongoose.Schema.Types.Mixed; // For nested objects
    case "object array":
      return [mongoose.Schema.Types.Mixed]; // For an array of nested objects
    case "image":
    case "video":
    case "audio":
    case "icon":
    case "document":
      return String; // Assuming binary data is stored as Buffer
    case "color":
      return String; // Assuming color is stored as string
    case "range":
      return Number;
    case "password":
      return String;
    case "email":
      return String;
    case "phone":
      return String;
    case "boolean":
    case "check":
      return Boolean;
    case "tags":
    case "image array":
      return [String];
    case "prices":
      return {
        amount: {
          type: mongoose.Schema.Types.Decimal128,
          required: true,
          default: 0,
        },
        currency: {
          type: String,
          required: true,
          enum: [
            "MWK",
            "USD",
            "EUR",
            "GBP",
            "JPY",
            "CAD",
            "AUD",
            "CHF",
            "CNY",
            "INR",
            "BRL",
          ],
          default: "MWK",
        },
      };
    default:
      return mongoose.Schema.Types.Mixed; // Default to mixed type
  }
}
