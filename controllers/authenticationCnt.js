const sql  = require('./../models/db');
const express = require('express');
const jwt = require('jsonwebtoken')
const bcrypte = require('bcrypt')
const creetoken = (id) =>{
    return jwt.sign({id } ,"The word of tokens", {
        expiresIn : "30d"
    })
}


const createSendToken = (user, statusCode, res) => {
    const token = creetoken(user.id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + 10 * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
    // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
    res.cookie('jwt', token, cookieOptions);
  
    // Remove password from output
    user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };




exports.login = async (req,res , next) => {
    const {email , password} = req.body;

    sql.getConnection((err,connection)=> {
        if(err ) throw err

        console.log("connectd sucssesfuly");
        console.log(req.body);

        connection.query("select * from user where email = ?" , email , async (err,rows)=> {
            connection.release();
            if(rows.length == 0) {
                res.status(401).json("User not found ")
            }else{
                const check = await bcrypte.compare(password,rows[0].password);
                console.log(check);
                if(check) {
                    console.log(rows[0]);
                    createSendToken(rows[0] , 200 ,res);

                }else{
                    res.status(401).json("User or password are wrong");
                }
            }
        } )
    } )
}

exports.signup = async (req,res , next) => {
    let newuser = req.body;
    console.log(newuser.Email);
    console.log(newuser.password);
    console.log(newuser.FullName);
    if(!newuser.Email ||
        !newuser.password ||
        !newuser.FullName
        ){
            console.log("here");
            res.status(401).json('All fields required');
        }else{
              try {
                newuser.password = await bcrypte.hash(newuser.password , 12);
             } catch (error) {
                res.status(401).json('some thingwent wrong');
                next()
            }
            

            console.log(newuser);

            sql.getConnection((err,connection) => {

                connection.query("INSERT INTO user SET ?" ,newuser , (err ,rows) => {
                    
                    if(!rows || rows.length == 0) {
                        res.status(200).json("problem")
                    }else {
                        console.log(rows);
                        connection.query("SELECT id from user where Email = ?" , newuser.Email ,(err2 ,rows2)=>{
                            connection.release()
                            createSendToken(rows2[0].id , 201 , res)
                        } )
                        // 
                    }
                } )
            })

        
        }
      

    
}

