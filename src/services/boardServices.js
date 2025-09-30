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
    let condition = { _id: boardId };

    if (access === "owner") {
      condition.owner = userId;
    } else if (access === "member") {
      condition.$or = [{ owner: userId }, { "members.user": userId }];
    }

    let q = this.model.findOne(condition, projection, options);

    if (populate) q = q.populate(populate);

    return q;
  }
}
