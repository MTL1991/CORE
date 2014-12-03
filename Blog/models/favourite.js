
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Favourites',
            { userId: {
                 type: DataTypes.INTEGER,
                 validate: {
                     notEmpty: {msg: "El campo autorId no puede estar vacio"}
                 }
              },
               postId: {
                 type: DataTypes.INTEGER,
                 validate: {
                     notEmpty: {msg: "El campo postId no puede estar vacio"}
                 }
              },
              best:{
                type: DataTypes.INTEGER,
                 validate: {
                     notEmpty: {msg: "El campo best no puede estar vacio"},
                     max: {args: 5,
                            msg: "El campo best debe ser menor o igual que 5"},
                    min: {args: 1,
                            msg: "El campo best debe ser mayor o igual que 1"
                          }
                 }
              }
          
            });
}