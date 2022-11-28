 export class UserModel{

  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    public username?: string,
    public avatar?: string,
  ) {}

   get token(){

    if (!this._tokenExpirationDate || new Date() >= this._tokenExpirationDate){
      return null;
    }

    return this._token;
   }

   set setUsername(newUsername: string){
    this.username = newUsername;
   }
 }
