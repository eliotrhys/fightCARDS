var express = require('express');
var router = express.Router({mergeParams: true});
var Fighter = require('../models/fighter');
var Comment = require('../models/comment');
var middleware = require('../middleware');


//COMMENTS NEW

router.get("/new", middleware.isLoggedIn, function(req, res){
  // find fighter by id
  Fighter.findById(req.params.id, function(err, fighter){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {fighter: fighter})
    }
  });
});

// COMMENTS CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
  // lookup fighter using ID
  Fighter.findById(req.params.id, function(err, fighter){
    if(err){
      console.log(err);
      res.redirect('/fighters');
    } else {
      // console.log(req.body.comment);
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          req.flash('error', 'Something went wrong!')
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          fighter.comments.push(comment);
          fighter.save();
          console.log(comment);
          req.flash('success', 'Successfully added comment!')
          res.redirect('/fighters/' + fighter._id);
        }
      });
    }
  });
});

// COMMENTS EDIT ROUTE

router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.redirect('back');
    } else {
      res.render('comments/edit', {fighter_id: req.params.id, comment: foundComment})
    }
  });
});

// COMMENTS UPDATE

router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.redirect('back');
    } else {
      res.redirect('/fighters/' + req.params.id);
    }
  });
});

// COMMENT DESTROY ROUTE

router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted!');
      res.redirect('/fighters/' + req.params.id);
    }
  });
});

module.exports = router;
