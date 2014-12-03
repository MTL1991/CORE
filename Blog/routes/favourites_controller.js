var models = require('../models/models.js');


exports.index= function(req,res,next){
  console.log("1 " + req.user + "2 " + req.session.user + "3 " + req.session.user.id);
	models.Favourite
		.findAll({where: {userId: req.user.id,
							best: [4,5]}})
		.success(function(favourites){

			var postIds=favourites.map(function(favourite){
				return favourite.postId;
			});
		      
          var where_value_patch;
                 if (postIds.length == 0) {
                      where_value_patch = '"Posts"."id" in (NULL)';
                 } else {
                      where_value_patch = '"Posts"."id" in (' + postIds.join(',') + ')';
                 }

		models.Post
			.findAll({order: 'updatedAt DESC',
				where: where_value_patch,
				include: [ {model: models.User, as: 'Author'} ,
                    models.Favourite ]
                  })
			.success(function(posts){

          var fc = require('./favourites_controller.js');

         for(var i in posts){
           posts[i].stars = fc.starsHtml(req,res, posts[i], favourites);
          console.log ("Estrellas en el for "+ posts[i].stars);
         }

          res.render('favourites/index' ,{
            posts: posts
          });

        })
      .error(function(error) {
              next(error);
          });



})
 .error(function(error) {
            next(error);
        });

};

exports.add=function(req,res,next){

var newbest= req.body.best || 0;

console.log('BEST = ' + newbest);

var redir = req.query.redir || '/users/' + req.user.id + '/favourites/' ;

models.Favourite
    .findOrCreate({userId: req.user.id,
                postId: req.post.id},
              {best: newbest})
  
    .success(function(favourite){
    console.log('success0');
    favourite.best = newbest;
    console.log('success1');
    

    favourite.save()
    .success(function(){
      req.flash('success', 'Favorito marcado con exito.');
      res.redirect(redir);
    })
    .error(function(error){
              next(error);
            });
  })
    .error(function(error){
              next(error);
            });


};

exports.del=function(req,res,next){

  var redir = req.query.redir || '/users/' + req.user.id + '/favourites/' ;

  models.Favourite
        .find({where: {userId: req.user.id,
                postId: req.post.id}})
        .success(function(favourite){
          if(favourite){
            favourite.destroy()
            .success(function(){
              req.flash('success', 'Favorito eliminado con exito');
              res.redirect(redir);
            })
            .error(function(error){
              next(error);
            });
          }

        })

 .error(function(error){
              next(error);
            });

};

exports.starsHtml=function(req, res, posts, favourites){
  var estrellas = 0;

        for(var i in favourites){
          if (posts.favourites [i] != undefined){
            
          if (posts.favourites[i].userId == req.session.user.id){
          estrellas = posts.favourites[i].best;
          //estrellas = favourite.best;
          console.log("Estrellas " + estrellas);
      
        return estrellas;
      }}
    }
    return estrellas;  
  }
