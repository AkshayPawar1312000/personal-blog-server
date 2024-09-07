const DB = require("../config/db");
const jwt = require("jsonwebtoken");

// Create a personal blog
const createPersonalBlog = async (req, res) => {
  try {
    const { title, author, blogContent } = req.body;
    if (!title || !author || !blogContent) {
      return res.status(404).send({
        success: false,
        message: "Please provide all fields",
      });
    }
    const data = await DB.query(
      `INSERT INTO personal_blogs (title, author, blogContent )  VALUES(? , ? , ? )`,
      [title, author, blogContent]
    );
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Error In INSERT QUERY",
      });
    }
    res.status(201).send({
      success: true,
      message: "New personal blog created Successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Create Personal blog API",
      error: error,
    });
  }
};

// Get all Personal Blogs
const getAllPersonalBlog = async (req, res) => {
  try {
    const data = await DB.query(`SELECT * FROM personal_blogs`);
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Personal Blogs NOT found",
      });
    }
    res.status(200).send({
      success: true,
      message: "All Personal Blogs records",
      totalLength: data[0].length,
      result: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Get All Personal Blogs api",
      error: err,
    });
  }
};

// Get a Personal Blog accourding to ID
const getPersonalBlog = async (req, res) => {
  try {
    const blodID = req.params.id;
    if (!blodID) {
      return res.status(404).send({
        success: false,
        message: "Blog ID is Invalid..",
      });
    }
    const data = await DB.query(`SELECT * FROM personal_blogs WHERE id=?`, [
      blodID,
    ]);
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "NO Blogs Found",
      });
    }
    res.status(200).send({
      success: true,
      data: data[0],
    });
  } catch (error) {
    console.log(error);
  }
};

// Update personal blog
const updatePersonalBlog = async (req, res) => {
  try {
    const blogID = req.params.id;
    if (!blogID) {
      return res.status(404).send({
        success: false,
        message: "Blog ID is NOT Found",
      });
    }
    const { title, author, blogContent } = req.body;

    const data = await DB.query(
      `UPDATE personal_blogs SET title = ?, author = ?, blogContent = ? WHERE id = ?`,
      [title, author, blogContent, blogID]
    );
    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in Update the personal blog",
      });
    }
    res.status(200).send({
      success: true,
      message: "Personal Blog Updated Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Update personal blogs API",
      error: error,
    });
  }
};

// Delete perticular personal blog
const deletePersonalBlog = async (req, res) => {
  try {
    const blodID = req.params.id;
    if (!blodID) {
      return res.status(200).send({
        success: false,
        message: "Blog ID not Found!",
      });
    }
    await DB.query(`DELETE FROM personal_blogs WHERE id = ?`, [blodID]);
    return res.status(200).send({
      success: true,
      message: "Personal blog Delete Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  createPersonalBlog,
  getAllPersonalBlog,
  getPersonalBlog,
  updatePersonalBlog,
  deletePersonalBlog,
};
