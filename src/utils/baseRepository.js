export default class baseRepository {
  constructor(model) {
    this.model = model;
  }

  // Find one document
  async findOne(query, projection = {}, options = {}, populate = "") {
    let q = this.model.findOne(query, projection, options);
    if (populate) q = q.populate(populate);
    return q;
  }

  // Find by ID
  async findById(id, projection = {}, options = {}, populate = "") {
    let q = this.model.findById(id, projection, options);
    if (populate) q = q.populate(populate);
    return q;
  }

  // Find multiple documents
  async find(query = {}, projection = {}, options = {}, populate = "") {
    let q = this.model.find(query, projection, options);
    if (populate) q = q.populate(populate);
    return q;
  }

  // Create a document
  async create(data) {
    return this.model.create(data);
  }

  // Update one document
  async updateOne(filter, update, options = {}, populate = "") {
    let q = this.model.updateOne(filter, update, options);
    if (populate) q = q.populate(populate);
    return q;
  }

  // Update by ID
  async updateById(id, update, options = {}, populate = "") {
    let q = this.model.findByIdAndUpdate(id, update, { new: true, ...options });
    if (populate) q = q.populate(populate);
    return q;
  }

  // Delete one document
  async deleteOne(filter, options = {}) {
    return this.model.deleteOne(filter, options);
  }

  // Delete by ID
  async deleteById(id, options = {}) {
    return this.model.findByIdAndDelete(id, options);
  }
}
