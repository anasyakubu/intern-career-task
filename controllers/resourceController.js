const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");

const dataPath = path.join(__dirname, "../data/resources.json");

const getAllResources = (req, res) => {
  const resources = JSON.parse(fs.readFileSync(dataPath));
  res.status(200).json(resources);
};

const getResourceById = (req, res) => {
  const resources = JSON.parse(fs.readFileSync(dataPath));
  const resource = resources.find((r) => r.id === req.params.id);
  if (resource) {
    res.status(200).json(resource);
  } else {
    res.status(404).json({ message: "Resource not found" });
  }
};

const createResource = (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const resources = JSON.parse(fs.readFileSync(dataPath));
  const newResource = { id: uuidv4(), ...req.body };
  resources.push(newResource);
  fs.writeFileSync(dataPath, JSON.stringify(resources, null, 2));

  res.status(201).json(newResource);
};

const updateResource = (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const resources = JSON.parse(fs.readFileSync(dataPath));
  const index = resources.findIndex((r) => r.id === req.params.id);
  if (index !== -1) {
    resources[index] = { id: req.params.id, ...req.body };
    fs.writeFileSync(dataPath, JSON.stringify(resources, null, 2));
    res.status(200).json(resources[index]);
  } else {
    res.status(404).json({ message: "Resource not found" });
  }
};

const deleteResource = (req, res) => {
  const resources = JSON.parse(fs.readFileSync(dataPath));
  const index = resources.findIndex((r) => r.id === req.params.id);
  if (index !== -1) {
    const deletedResource = resources.splice(index, 1);
    fs.writeFileSync(dataPath, JSON.stringify(resources, null, 2));
    res.status(200).json(deletedResource);
  } else {
    res.status(404).json({ message: "Resource not found" });
  }
};

module.exports = {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
};
