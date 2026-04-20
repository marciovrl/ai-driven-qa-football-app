import Joi from "joi";

const titleSchema = Joi.object({
  competition: Joi.string().required(),
  year: Joi.number().required()
});

export const teamSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  address: Joi.string().allow(null).required(),
  nickname: Joi.string().allow(null).required(),
  titles: Joi.array().items(titleSchema).allow(null).required()
});

export const teamsSchema = Joi.array().items(teamSchema);
