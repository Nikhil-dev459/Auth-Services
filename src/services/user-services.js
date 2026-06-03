const UserRepository=require('../repositories/user-repository');
const jwt=require('jsonwebtoken');
const {JWT_KEY}=require('../config/server-config');

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
           const response=jwt.verify(user,JWT_KEY);
           return response; 
        } 
        catch(error){
            console.log("Something went wrong in token creation");
            throw error;
        }
    }
}

module.exports=UserService;