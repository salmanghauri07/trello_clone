import baseRepository from "../utils/baseRepository.js";

export default class boardServices extends baseRepository {
  constructor(model) {
    super(model);
  }

  async findByIdWithAccess(
    boardId,
    userId,
    access = "member", // "member" (owner OR member) or "owner" (strict owner only)
    projection = {},
    options = {},
    populate = ""
  ) {
    let filter = { _id: boardId };

    if (access === "owner") {
      filter.owner = userId;
    } else if (access === "member") {
      filter.$or = [{ owner: userId }, { "members.user": userId }];
    }

    let query = this.model.findOne(filter, projection, options);

    if (populate) {
      query = query.populate(populate);
    }

    return query;
  }
}
