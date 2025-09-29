export default class baseRepository {
  constructor(model) {
    this.model = model;
  }

  async findOne(query, projection = {}, options = {}) {
    return this.model.findOne(query, projection, options);
  }

  async findById(id, projection = {}, options = {}) {
    return this.model.findById(id, projection, options);
  }

  async find(query = {}, projection = {}, options = {}) {
    return this.model.find(query, projection, options);
  }

  async create(data) {
    return this.model.create(data);
  }

  async updateOne(filter, update, options = {}) {
    return this.model.updateOne(filter, update, options);
  }

  async updateById(id, update, options = {}) {
    return this.model.findByIdAndUpdate(id, update, { new: true, ...options });
  }

  async deleteOne(filter, options = {}) {
    return this.model.deleteOne(filter, options);
  }

  async deleteById(id, options = {}) {
    return this.model.findByIdAndDelete(id, options);
  }
}
