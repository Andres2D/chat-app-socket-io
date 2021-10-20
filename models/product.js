const { Schema, model} = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'The name is required'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String
    },
    aviable: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    }
});

ProductSchema.methods.toJSON = function() {
    let {_id, __v, ...category} = this.toObject();
    category.uid = _id;
    return category;
}

module.exports = model('Product', ProductSchema);
