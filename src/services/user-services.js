const UserRepository=require('../repositories/user-repository');
const jwt=require('jsonwebtoken');
const {JWT_KEY}=require('../config/server-config');
const bcrypt=require('bcrypt');

class UserService{
    constructor(){
        this.UserRepository=new UserRepository;
    }

    async create(data){
        try {
            const user=await this.UserRepository.create(data);
            return user;    
        } 
        catch(error){
            console.log("Something went wrong in the service layer");
            throw error;
        }
    }

    async signIn(email,password){
        try{
            //step 1-> fetch the user using the email
            const user=await this.UserRepository.getByEmail(email);
            //step 2-> compare incoming plain password with stored encrypted password
            const passwordsMatch=this.checkPassword(password,user.password);
            if(!passwordsMatch){
                console.log("Passwords don't match");
                throw {error:'Incorrect Password'};
            }
            //step 3-> if passwords match, then create a token and send it to the user
            const newJWT=this.createToken({email:user.email,id:user.id});
            return newJWT;
        } 
        catch(error){
            console.log("Something went wrong in the sign-in process");
            throw error;
        }
    }

    async isAuthenticated(token){
        try{
            const response=this.verifyToken(token);
            if(!response){
                throw {error:'Invalid token'};
            }
            const user=await this.UserRepository.getById(response.id);
            if(!user){
                throw{error:'No user with corresponding token exists'};
            }
            return user.id;
        } 
        catch(error){
            console.log("Something went wrong in the sign-in process");
            throw error;
        }
    }

    createToken(user){
        try{
           const result=jwt.sign(user,JWT_KEY,{expiresIn:'1d'});
           return result;
        } 
        catch(error){
            console.log("Something went wrong in token creation");
            throw error;
        }
    }

    verifyToken(token){
        try{
           const response=jwt.verify(token,JWT_KEY);
           return response; 
        } 
        catch(error){
            console.log("Something went wrong in token validation",error);
            throw error;
        }
    }

    checkPassword(userInputPlainPassword,encryptedPassword){
        try{
            return bcrypt.compareSync(userInputPlainPassword,encryptedPassword);
        } 
        catch(error){
            console.log("Something went wrong in password comparison");
            throw error;
        }
    }

    isAdmin(userId){
        try{
            return this.UserRepository.isAdmin(userId);
        } 
        catch(error){
            console.log("Something went wrong in password comparison");
            throw error;
        }
    }
}

module.exports=UserService;