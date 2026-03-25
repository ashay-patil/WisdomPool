const Experience = require('../models/experience');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, UnauthorizedError } = require('../custom-errors');
const Likes = require('../models/likes');


const createExperience = async (req, res) => {
    const { company, position, role, description,status, rounds, interviewDate } = req.body;
    const experience = await Experience.create({ company, position, role,status, description, rounds, interviewDate, user: req.user.id });
    res.status(StatusCodes.CREATED).json({ success: true, experience });
};
const updateExperience = async (req, res) => {
    const { id } = req.params;
    const experience = await Experience.findById(id);
  
    if (!experience) {
      throw new NotFoundError('Experience not found');
    }
  
    if (experience.user.toString() !== req.user.id) {
      throw new UnauthorizedError('Not authorized to update this experience');
    }
  
    // Clean up empty fields
    const filteredBody = Object.fromEntries(
      Object.entries(req.body).filter(([_, value]) => value !== "")
    );
  
    const updatedExperience = await Experience.findByIdAndUpdate(
      id,
      filteredBody,
      { new: true, runValidators: true }
    );
  
    res.status(StatusCodes.OK).json({ success: true, experience: updatedExperience });
  };
  

const deleteExperience = async (req, res) => {
    const { id } = req.params;

    const experience = await Experience.findById(id);
    if (!experience) {
        throw new NotFoundError('Experience not found');
    }

    if (experience.user.toString() !== req.user.id) {
        throw new UnauthorizedError('Not authorized to delete this experience');
    }

    await experience.deleteOne();

    res.status(StatusCodes.OK).json({ success: true, message: 'Experience deleted successfully' });
};


const getAllMyExperiences = async (req, res) => {
    const experiences = await Experience.find({ user: req.user.id })
        .populate('user', 'name email');

    res.status(StatusCodes.OK).json({
        success: true,
        count: experiences.length,
        experiences
    });
};

const toggleLike = async (req, res)=>{
    const likedBy = req.user.id;
    const exp = req.params.id;
    console.log("reached toggle Like");
    const like = await Likes.findOne({likedBy, experience:exp});
    console.log("Like Object : ",like);
    const experience = await Experience.findById(exp);
    const initial_likes = experience.likes ? experience.likes : 0;
    console.log("Experience Object : ",experience)
    if(!like){
      await Likes.create({likedBy, experience:exp});
      console.log("Likes created");
      experience.likes = initial_likes + 1;
      await experience.save();
      console.log("Experience updated with like count")
      return res.status(StatusCodes.CREATED).json({success : true, liked:true, totalLikes : initial_likes + 1});
    }
    
    let prev = like.liked;

    prev = !prev;

    like.liked = prev;
    console.log("likes updated");
    const updated = await like.save();

    if(prev){
      experience.likes = initial_likes + 1;
    }
    else experience.likes = initial_likes - 1;

    await experience.save();
    console.log("Experience updated with like count");
    return res.status(StatusCodes.OK).json({success : true, liked:prev, totalLikes : prev? initial_likes + 1 : initial_likes - 1});

  
}

const getLikeStatus = async(req, res)=>{
  const likedBy = req.user.id;
    const exp = req.params.id;

    const like = await Likes.findOne({likedBy, experience:exp});

    if(!like){
      return res.status(StatusCodes.OK).json({success:true, liked:false})
    }
    console.log("GEetlike status ",like);
    return res.status(StatusCodes.OK).json({success:true, liked:like.liked});
}

module.exports = {createExperience, updateExperience, deleteExperience, getAllMyExperiences, toggleLike, getLikeStatus}