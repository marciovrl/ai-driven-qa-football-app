import Joi from "joi";

const titleSchema = Joi.object({
  competition: Joi.string().required(),
  year: Joi.number().required()
});

export const teamSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  address: Joi.string().required(),
  nickname: Joi.string().required(),
  titles: Joi.array().items(titleSchema).optional()
});

export const teamsSchema = Joi.array().items(teamSchema);
