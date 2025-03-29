// models/attraction.model.js

module.exports = (sequelize, DataTypes) => {
  const Attraction = sequelize.define('Attraction', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('landmark', 'food', 'retail', 'recreation', 'entertainment', 'education', 'service', 'other'),
      allowNull: false
    },
    subCategory: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.ENUM('point', 'area', 'building')
    },
    location: {
      type: DataTypes.GEOMETRY('POINT')
    },
    // Address
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    postalCode: DataTypes.STRING,
    country: DataTypes.STRING,

    // Contact
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    website: DataTypes.STRING,

    // Images (JSON)
    images: {
      type: DataTypes.JSONB,
      defaultValue: []
    },

    // Amenities
    amenities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },

    // Hours of Operation
    hoursOfOperation: {
      type: DataTypes.JSONB,
      defaultValue: []
    },

    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    // Ratings
    averageRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    // Price
    priceLevel: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    priceDescription: DataTypes.STRING,

    // Accessibility
    wheelchairAccessible: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    brailleSignage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    audioGuides: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    serviceAnimalsAllowed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    accessibilityRating: DataTypes.FLOAT,

    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },

    publishedStatus: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'published'
    },

    // Food Options
    foodOptions: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },

    // Retail Info
    retailInfo: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },

    sitecoreId: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'attractions',
    timestamps: true
  });

  return Attraction;
};
