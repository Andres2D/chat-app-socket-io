const { Schema, model} = require('mongoose');

const CategorySchema = Schema({
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
    }
});

CategorySchema.methods.toJSON = function() {
    let {_id, __v, ...category} = this.toObject();
    category.uid = _id;
    return category;
}

module.exports = model('Category', CategorySchema);
